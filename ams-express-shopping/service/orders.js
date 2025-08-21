const { SECURITY_CONTEXT } = require('@sap/xssec'); // USER_AGENT is just a placeholder during development until the SECURITY_CONTEXT Symbol is available
const { AMS_AUTHORIZATIONS, DclConstants } = require('@sap/ams');
const db = require('../db/db');

/**
 * @param {import("@sap/xssec").IdentityServiceRequest & import("@sap/ams").AuthorizedRequest} req - The request object with IdentityServiceSecurityContext and Authorizations
*/
const deleteOrder = (req, res) => {
    // --- SHOWCASES CONTEXT-FREE AMS AUTHORIZATION CHECK ---

    /* --- PRIVILEGE CHECK ---    
    The following privilege check is equivalent to the privilege check already done via the express middleware for DELETE /orders/:id.
    Doing the check here or via the middleware is a matter of preference.

    This check ensures that the service logic executes only if the authorization is unconditionally granted.
    It leads to an early exit with status code 403 if the authorization is denied or depends on a condition.

    if (!req[AMS_AUTHORIZATIONS].checkPrivilege('delete', 'orders').isGranted()) {
        return res.sendStatus(403);
    }  

    This pattern should be used when the authorization is not expected to depend on any condition.
    */

    const { id } = req.params;
    const orderIndex = db.orders.findIndex(o => o.id === parseInt(id));
    if (orderIndex === -1) {
        return res.status(404).json({ message: 'Order not found' });
    }

    db.orders.splice(orderIndex, 1);
    res.sendStatus(204);
};

/**
 * @param {import("@sap/xssec").IdentityServiceRequest & import("@sap/ams").AuthorizedRequest} req - The request object with IdentityServiceSecurityContext and Authorizations
*/
const createOrder = (req, res) => {
    // --- SHOWCASES CONTEXTUAL AMS AUTHORIZATION CHECK FOR A SINGLE ENTITY ---

    /* --- PRE-CHECK ---    
    The following privilege check is equivalent to the *pre*-check already done via the express middleware for POST /orders.
    Doing the check here or via the middleware is a matter of preference.

    This check ensures that the service logic executes only if the authorization is granted or depends on a condition.
    It leads to an early exit with status code 403 if the authorization is unconditionally denied.

    if (req[AMS_AUTHORIZATIONS].checkPrivilege('create', 'orders').isDenied()) {
        return res.sendStatus(403);
    }   

    This pattern should be used when the authorization is expected to depend on a condition.
    */

    const { productId, quantity } = req.body;
    const product = db.products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const totalAmount = product.price * quantity;

    // --- entity-specific privilege check in endpoint ---
    const input = {
        "product.category": product.category,
        "order.total": totalAmount
    };

    if (!req[AMS_AUTHORIZATIONS].checkPrivilege('create', 'orders', input).isGranted()) {
        return res.sendStatus(403);
    }

    const newOrder = {
        id: db.orders.length + 1,
        productId,
        quantity,
        totalAmount,
        createdBy: req[SECURITY_CONTEXT].token.scimId
    };
    db.orders.push(newOrder);
    res.status(201).json(newOrder);
};

/**
* @param {import("@sap/ams").AuthorizedRequest} req - The request object with IdentityServiceSecurityContext and Authorizations
*/
const getOrders = (req, res) => {
    // --- SHOWCASES CONTEXTUAL AMS AUTHORIZATION CHECK FOR A SET OF ENTITIES (FILTER) ---

    /* --- COMPLEX PRIVILEGE CHECK ---    
    The following privilege check is too complex to be done via the express middleware for POST /orders.
    It distinguishes between three different cases:
        1. The authorization is unconditionally denied.
        2. The authorization is unconditionally granted.
        3. The authorization depends on a condition.

    This pattern should be used when the authorization is expected to potentially (but not necessarily) depend on a condition.
    */

    const decision = req[AMS_AUTHORIZATIONS].checkPrivilege('read', 'orders');
    if (decision.isDenied()) {
        // --- redundant privilege pre-check in endpoint to showcase API (already done via middleware) ---
        return res.sendStatus(403);
    } else if (decision.isGranted()) {
        return res.json(db.orders);
    }

    /* --- CONVERT AMS CONDITION TO DATABASE CONDITION --- 
    The following code demonstrates how Decision#visit can be used with two callbacks to convert from a DCN condition to a database condition.
    In production, the result will typically be an SQL 'where condition'.
    In this sample though, the data lies in Javascript arrays instead of a database, so we need to construct a Javascript function to filter the result set.

    The callbacks are called bottom-up by applying the visitor pattern to the condition tree.
    The first one can be used to transform DCN calls to SQL fragments with corresponding database operators, e.g. "eq(args)" to "args[0] = args[1]".
    The second one can be used to transform AMS attribute names to database field references, e.g. "$app.product.name" to "name".

    Transformators with callbacks for standard SQL dialects will likely be made available in the future.
    */

    const condition = decision
        .visit(
            (call, args) => {
                if (call === DclConstants.operators.EQ) {
                    const creator = args[1 - args.indexOf("createdBy")]

                    return o => o.createdBy === creator;
                } else {
                    // handle remaining DCL operators
                }
            },
            value => {
                if (value.ref === "$app.order.createdBy") {
                    return "createdBy"; // map AMS attribute order.createdBy to db field createdBy
                } else {
                    return value;
                }
            }
        );

    res.json(db.orders.filter(condition));
};

module.exports = {
    getOrders,
    createOrder,
    deleteOrder
};
