const cds = require('@sap/cds');
const { cap: { amsPluginRuntime } } = require("@sap/ams");

cds.on('bootstrap', () => {
    const authorizationStrategy = amsPluginRuntime.authorizationStrategy;
    authorizationStrategy.withApiMapper(api => `internal.${api}`);
    // authorizationStrategy.withServicePlanMapper(plan => `internal.${plan}`);
})