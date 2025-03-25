const cds = require('@sap/cds');
const { cap: { amsPluginRuntime } } = require("@sap/ams");

cds.on('bootstrap', () => {
    const cdsAuthorizationStrategy = amsPluginRuntime.authorizationStrategy;
    cdsAuthorizationStrategy.xssecStrategy.withApiMapper(api => `internal.${api}`);
    // cdsAuthorizationStrategy.xssecStrategy.withServicePlanMapper(plan => `internal.${plan}`);
})