const { createSecurityContext, IdentityService, IdentityServiceToken, IdentityServiceSecurityContext, errors: { ValidationError }, SECURITY_CONTEXT } = require('@sap/xssec');

// --- Sets up AUTHENTICATION as pre-condition for AUTHORIZATION ---

const authenticate = process.env.NODE_ENV === 'test' ? buildMockAuthMiddleware() : buildAuthMiddleware();

/*
Middleware for SAP Identity Service based authentication 
following the example in the @sap/xssec documentation:
https://www.npmjs.com/package/@sap/xssec#example
*/
function buildAuthMiddleware() {
    const identityService = require('./identityService');

    return async function authenticate(req, res, next) {
        try {
            const secContext = await createSecurityContext(identityService, { req });
            req[SECURITY_CONTEXT] = secContext;
            return next();
        } catch (e) {
            if (e instanceof ValidationError) {
                console.error("Unauthenticated request: ", e);
                return res.sendStatus(401);
            }

            throw e; // handled in express error handler
        }
    }
}

/*
Middleware for mocked authentication 
following the recommendation in the @sap/xssec documentation for testing without real JWTs:
https://www.npmjs.com/package/@sap/xssec#testing
*/
function buildMockAuthMiddleware() {
    return async function mockAuthentication(req, res, next) {
        const basicAuthUser = req.headers['authorization']?.split(' ')[1];
        const user = Buffer.from(basicAuthUser, 'base64').toString().split(':')[0];
        const [username, api] = user.split('|');

        if (!username) {
            return res.sendStatus(401);
        }

        const mockPayload = {
            app_tid: "default",
            scim_id: username,
            sub: username,
            azp: "client_id",
            ias_apis: api ? [api] : []
        };

        const mockToken = new IdentityServiceToken(null, { header: {}, payload: mockPayload });
        const mockService = new IdentityService({});
        const mockedSecurityContext = new IdentityServiceSecurityContext(mockService, mockToken, {});

        req[SECURITY_CONTEXT] = mockedSecurityContext;
        next();
    }
}

module.exports = authenticate;
