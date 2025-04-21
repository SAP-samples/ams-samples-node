@label: 'Read Products'
@description: 'Allows to see the products of the shop.'
POLICY ReadProducts {
    GRANT read ON products;
}

@label: 'Delete Orders'
@description: 'Allows to delete any orders of the shop.'
POLICY DeleteOrders {
    USE ReadOrders;
    GRANT delete ON orders;
}

@label: 'Create Orders'
@description: 'Allows to create orders for any products of the shop. The orders that can be created can be restricted by the product category and the order total.'
POLICY CreateOrders {
    USE ReadProducts;
    USE ReadOwnOrders;
    GRANT create ON orders WHERE order.total IS NOT RESTRICTED AND product.category IS NOT RESTRICTED;
}

@label: 'Read Orders'
@description: 'Allows to see any orders of the shop. The orders that can be seen can be restricted to orders of specific users.'
POLICY ReadOrders {
    GRANT read ON orders WHERE order.createdBy IS NOT RESTRICTED;
}

@label: 'Read Own Orders'
@description: 'Allows to see the orders created by the user.'
POLICY ReadOwnOrders {
    USE shopping.ReadOrders RESTRICT order.createdBy = $user.scim_id;
}
