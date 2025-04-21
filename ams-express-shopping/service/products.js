const db = require('../db/db');

/**
* @param {import("../Types").AuthenticatedRequest} req - The request object with securityContext
*/
const getProducts = (req, res) => {
    return res.json(db.products);
};

module.exports = {
    getProducts
};
