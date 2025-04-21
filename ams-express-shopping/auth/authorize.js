const { AuthorizationManagementService, IdentityServiceAuthProvider, TECHNICAL_USER_FLOW, PRINCIPAL_PROPAGATION_FLOW } = require("@sap/ams");
const { mapTechnicalUserApi, mapPrincipalPropagationApi } = require("./apis");

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

if (process.env.DEBUG?.split(",").includes("ams")) {
    ams.on("authorizationCheck", event => {
        if (event.type === "checkPrivilege") {
            if (event.decision.isGranted()) {
                console.log(`Privilege '${event.action} ${event.resource}' for ${event.context.token.scimId} was granted based on input`, event.input);
            } else if(event.decision.isDenied()) {
                console.log(`Privilege '${event.action} ${event.resource}' for ${event.context.token.scimId} was denied based on input`, event.input);
            } else {
                console.log(`Privilege '${event.action} ${event.resource}' for ${event.context.token.scimId} was conditionally granted based on input`, event.input);
            }
        }
    });

    ams.on("error", event => {
        if (event.type === "bundleRefreshError") {
            console.warn("AMS bundle refresh error:", event.error);
        }
    });
}

module.exports = {
    authorize,
    ams,
    amsMw,
    authProvider
}