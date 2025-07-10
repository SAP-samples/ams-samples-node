const request = require('supertest');
const server = require('../server');
const db = require('../db/db');

beforeEach(() => {
    db.reset();
});

describe('GET /health', () => {
    it('should return 200 without authentication', async () => {
        const response = await request(server).get('/health');
        expect(response.status).toBe(200);
    });
});

describe('GET /products', () => {
    it('should allow access for user with ReadProducts policy', async () => {
        const response = await request(server)
            .get('/products')
            .auth('alice', '');
        expect(response.status).toBe(200);
    });

    it('should deny access without ReadProducts policy', async () => {
        const response = await request(server)
            .get('/products')
            .auth('carol', '');
        expect(response.status).toBe(403);
    });
});

describe('DELETE /orders/:id', () => {
    it('should allow deleting any orders with DeleteOrders policy', async () => {
        const response = await request(server)
            .delete('/orders/1')
            .auth('alice', '');
        expect(response.status).toBe(204);
    });

    it('should deny deleting orders of other users without DeleteOwnOrders policy', async () => {
        const response = await request(server)
            .delete('/orders/4')
            .auth('bob', '');
        expect(response.status).toBe(403);
    });
});

describe('POST /orders', () => {
    it('should allow arbitrary order creation for user with CreateOrders policy', async () => {
        const response = await request(server)
            .post('/orders')
            .auth('alice', '')
            .send({ productId: 1, quantity: 1000 }); // { id: 1, name: 'MacBook Pro M3', price: 3000, category: 'pc' }
        expect(response.status).toBe(201);
    });

    it('should only allow order creation for accessories for user with OrderAccessory policy', async () => {
        let response = await request(server)
            .post('/orders')
            .auth('bob', '')
            .send({ productId: 5, quantity: 1 }); // { id: 5, name: 'Yubikey', price: 30, category: 'securityAccessory' }
        expect(response.status).toBe(403);

        response = await request(server)
            .post('/orders')
            .auth('bob', '')
            .send({ productId: 4, quantity: 1 }); // { id: 4, name: 'Cherry Keyboard', price: 40, category: 'accessory' }
        expect(response.status).toBe(201);
    });

    it(`should only allow order creation for accessories with total order volume < 100
        for user with OrderAccessory policy calling via ExternalOrder`, async () => {
        // order too expensive (160 > 100)
        let response = await request(server)
            .post('/orders')
            .auth('bob|ExternalOrder', '')
            .send({ productId: 4, quantity: 4 }); // { id: 4, name: 'Cherry Keyboard', price: 40, category: 'accessory' }
        expect(response.status).toBe(403);

        // wrong product category (securityAccessory instead of accessory)
        response = await request(server)
            .post('/orders')
            .auth('bob|ExternalOrder', '')
            .send({ productId: 5, quantity: 1 }); // { id: 5, name: 'Yubikey', price: 30, category: 'securityAccessory' }
        expect(response.status).toBe(403);

        // order total too expensive (120)
        response = await request(server)
            .post('/orders')
            .auth('bob|ExternalOrder', '')
            .send({ productId: 5, quantity: 4 }); // { id: 5, name: 'Yubikey', price: 30, category: 'securityAccessory' }
        expect(response.status).toBe(403);

        response = await request(server)
            .post('/orders')
            .auth('bob|ExternalOrder', '')
            .send({ productId: 4, quantity: 2 }); // { id: 4, name: 'Cherry Keyboard', price: 40, category: 'accessory' }
        expect(response.status).toBe(201);
    });
});

describe('GET /orders', () => {
    it('should allow access for user with ReadOrders policy', async () => {
        const response = await request(server)
            .get('/orders')
            .auth('alice', '');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(4);
    });

    it('should filter out orders of other users with ReadOwnOrders policy', async () => {
        const response = await request(server)
            .get('/orders')
            .auth('bob', '');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 4, productId: 4, quantity: 1, createdBy: 'bob' }]);
    });

    it('should deny access without read orders privilege', async () => {
        const response = await request(server)
            .get('/orders')
            .auth('carol', '');
        expect(response.status).toBe(403);
    });
});

afterAll(() => {
    server.close();
});