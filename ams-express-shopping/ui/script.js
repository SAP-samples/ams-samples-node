document.addEventListener('DOMContentLoaded', () => {
    const userSelect = document.getElementById('user-select');
    const externalApiCheckbox = document.getElementById('external-api-checkbox');
    const productsTableBody = document.getElementById('products-table').querySelector('tbody');
    const ordersTableBody = document.getElementById('orders-table').querySelector('tbody');
    const cartTableBody = document.getElementById('cart-table').querySelector('tbody');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const resetCartBtn = document.getElementById('reset-cart-btn');

    let shoppingCart = [];
    let currentUser = 'alice';
    let products = [];
    let orders = [];
    let privileges = [];

    const getAuthHeader = (user, isOrder = false) => {
        const username = isOrder && externalApiCheckbox.checked ? `${user}|ExternalOrder` : user;
        const credentials = btoa(`${username}:`);
        return `Basic ${credentials}`;
    };

    const fetchPrivileges = async () => {
        try {
            const response = await fetch('/privileges', {
                headers: { 'Authorization': getAuthHeader(currentUser) }
            });
            if (response.ok) {
                const data = await response.json();
                privileges = data.privileges;
            } else {
                console.error('Error fetching privileges:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching privileges:', error);
        }
    };

    const adjustUIBasedOnPrivileges = () => {
        const canReadOrders = privileges.some(p => p.action === 'read' && p.resource === 'orders');
        const canCreateOrders = privileges.some(p => p.action === 'create' && p.resource === 'orders');
        const canDeleteOrders = privileges.some(p => p.action === 'delete' && p.resource === 'orders');

        document.getElementById('orders-section').style.display = canReadOrders ? 'block' : 'none';
        document.getElementById('cart-section').style.display = canCreateOrders ? 'block' : 'none';

        document.querySelectorAll('#orders-table button').forEach(button => {
            button.disabled = !canDeleteOrders;
        });

        document.querySelectorAll('#products-table button').forEach(button => {
            button.disabled = !canCreateOrders;
        });

        placeOrderBtn.disabled = !canCreateOrders;
        resetCartBtn.disabled = !canCreateOrders;
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('/products', {
                headers: { 'Authorization': getAuthHeader(currentUser) }
            });
            if (response.ok) {
                products = await response.json();
                renderProducts(products);
            } else if (response.status === 403) {
                alert('User is not authorized to view products.');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('/orders', {
                headers: { 'Authorization': getAuthHeader(currentUser) }
            });
            if (response.ok) {
                orders = await response.json();
                renderOrders(orders);
            } else if (response.status === 403) {
                alert('User is not authorized to view orders.');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const renderProducts = (products) => {
        productsTableBody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td>
                    <button onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </td>
            `;
            productsTableBody.appendChild(row);
        });
    };

    const renderOrders = (orders) => {
        ordersTableBody.innerHTML = '';
        orders.forEach(order => {
            const product = products.find(p => p.id === order.productId);
            const totalAmount = order.quantity * product.price;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.productId}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${order.quantity}</td>
                <td>${totalAmount}</td>
                <td>${order.createdBy}</td>
                <td>
                    <button onclick="deleteOrder(${order.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            ordersTableBody.appendChild(row);
        });
    };

    const renderCart = () => {
        cartTableBody.innerHTML = '';
        shoppingCart.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td>
                    <button onclick="removeFromCart(${item.id})">
                        <i class="fas fa-minus-circle"></i>
                    </button>
                </td>
            `;
            cartTableBody.appendChild(row);
        });
    };

    window.addToCart = (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            const cartItem = shoppingCart.find(item => item.id === productId);
            if (cartItem) {
                cartItem.quantity += 1;
            } else {
                shoppingCart.push({ ...product, quantity: 1 });
            }
            renderCart();
        }
    };

    window.removeFromCart = (productId) => {
        shoppingCart = shoppingCart.filter(item => item.id !== productId);
        renderCart();
    };

    window.deleteProduct = async (productId) => {
        // Removed "delete product" logic
    };

    window.deleteOrder = async (orderId) => {
        try {
            const response = await fetch(`/orders/${orderId}`, {
                method: 'DELETE',
                headers: { 'Authorization': getAuthHeader(currentUser) }
            });
            if (response.ok) {
                fetchOrders();
            } else if (response.status === 403) {
                alert('User is not authorized to delete orders.');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const placeOrder = async () => {
        const orderItems = shoppingCart.map(item => ({
            productId: item.id,
            quantity: item.quantity
        }));
        try {
            const response = await fetch('/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getAuthHeader(currentUser, true)
                },
                body: orderItems.length > 1 ? JSON.stringify(orderItems) : JSON.stringify(orderItems[0])
            });
            if (response.ok) {
                shoppingCart = [];
                renderCart();
                fetchOrders();
            } else if (response.status === 403) {
                alert('User is not authorized to place this order.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const resetCart = () => {
        shoppingCart = [];
        renderCart();
    };

    userSelect.addEventListener('change', () => {
        currentUser = userSelect.value;

        Promise.all([
            fetchPrivileges(),
            fetchProducts()        
        ])
        .then(() => {
            return fetchOrders();
        })
        .finally(() => {
            adjustUIBasedOnPrivileges();
        });
    });

    externalApiCheckbox.addEventListener('change', () => {
        fetchProducts();
        fetchOrders();
    });

    placeOrderBtn.addEventListener('click', placeOrder);
    resetCartBtn.addEventListener('click', resetCart);

    Promise.all([
        fetchPrivileges(),
        fetchProducts()        
    ])
    .then(() => {
        return fetchOrders();
    })
    .finally(() => {
        adjustUIBasedOnPrivileges();
    });
});