const path = require('node:path');
const express = require('express');
const authenticate = require('./auth/authenticate');
const { authorize, ams, amsMw } = require('./auth/authorize');
const { getProducts } = require('./service/products');
const { getOrders, createOrder, deleteOrder } = require('./service/orders');
const getPrivileges = require('./service/privileges');

const PORT = process.env.PORT || 3000;
const AMS_STARTUP_TIMEOUT = process.env.AMS_STARTUP_TIMEOUT || 30;

let isReady = false;
const healthCheck = (req, res) => {
    if (isReady) {
        res.json({ status: 'UP' });
    } else {
        res.status(503).json({ status: 'DOWN', message: 'Service is not ready' });
    }
};

const amsStartupCheck = async () => {
    try {
        await ams.whenReady(AMS_STARTUP_TIMEOUT);
        isReady = true;
        console.log('AMS has become ready.');
    } catch (e) {
        console.error('AMS did not become become ready in time:', e);
        process.exit(1);
    }
};

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'ui')));
app.use(/^\/(?!health).*/i, authenticate, authorize);

app.get('/health', healthCheck);

app.get('/privileges', getPrivileges);

app.get('/products', amsMw.checkPrivilege('read', 'products'), getProducts);

app.delete('/orders/:id', amsMw.checkPrivilege('delete', 'orders'), deleteOrder);
app.post('/orders', amsMw.checkPrivilege('read', 'products'), amsMw.precheckPrivilege('create', 'orders'), createOrder);
app.get('/orders', amsMw.precheckPrivilege('read', 'orders'), getOrders);

app.use((err, req, res, next) => {
    // replace with proper error handling
    console.error(err.stack);
    return res.sendStatus(500);
});

const server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

amsStartupCheck();

module.exports = server;