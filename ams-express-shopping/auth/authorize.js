const { AuthorizationManagementService, IdentityServiceAuthProvider, TECHNICAL_USER_FLOW, PRINCIPAL_PROPAGATION_FLOW } = require("@sap/ams");
const { mapTechnicalUserApi, mapPrincipalPropagationApi } = require("./apis");

/** @type {AuthorizationManagementService} */
let ams;
if (process.env.NODE_ENV === 'test') {
    ams = AuthorizationManagementService.fromLocalDcn("./test/dcn", {
        assignments: "./test/mockPolicyAssignments.json"
    });
} else {
    // production
    const identityService = require('./identityService');
    ams = AuthorizationManagementService.fromIdentityService(identityService);
}

const authProvider = new IdentityServiceAuthProvider(ams)
    .withApiMapper(mapTechnicalUserApi, TECHNICAL_USER_FLOW)
    .withApiMapper(mapPrincipalPropagationApi, PRINCIPAL_PROPAGATION_FLOW);
const amsMw = authProvider.getMiddleware();
const authorize = amsMw.authorize();

ams.on("error", event => {
    if (event.type === "bundleRefreshError") {
        if(ams.isReady()) {
            console.warn("AMS bundle refresh error:", event.error);
        } else {
            console.error("AMS initial bundle fetch error:", event.error);
        }
    }
});

module.exports = {
    authorize,
    ams,
    amsMw,
    authProvider
}