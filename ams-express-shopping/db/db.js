const products = [
    { id: 1, name: 'MacBook Pro M3', price: 3000, category: 'pc' },
    { id: 2, name: 'Dell 34 inch Widescreen Monitor', price: 400, category: 'monitor' },
    { id: 3, name: 'Apple Mouse', price: 70, category: 'accessory' },
    { id: 4, name: 'Cherry Keyboard', price: 40, category: 'accessory' },
    { id: 5, name: 'Yubikey', price: 30, category: 'securityAccessory' }
];

const orders = [
    { id: 1, productId: 1, quantity: 1, createdBy: 'carol' },
    { id: 2, productId: 3, quantity: 1, createdBy: 'carol' },
    { id: 3, productId: 2, quantity: 1, createdBy: 'alice' },
    { id: 4, productId: 4, quantity: 1, createdBy: 'bob' }
];

class SimpleDb {
    #products;
    #orders;

    constructor() {
        this.reset();
    }

    get products() {
        return this.#products;
    }

    get orders() {
        return this.#orders;
    }

    reset() {
        this.#products = [...products];
        this.#orders = [...orders];
    }
}

module.exports = new SimpleDb();