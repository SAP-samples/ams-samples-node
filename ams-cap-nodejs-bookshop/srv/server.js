const cds = require('@sap/cds');
const { cap: { getAuthorizationStrategy } } = require("@sap/ams");

cds.on('bootstrap', () => {
    const authorizationStrategy = getAuthorizationStrategy();
    authorizationStrategy.withApiMapper(api => `internal.${api}`);
    // authorizationStrategy.withServicePlanMapper(plan => `internal.${plan}`);
})