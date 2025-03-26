const cds = require('@sap/cds');
const { cap: { amsPluginRuntime } } = require("@sap/ams");

cds.on('bootstrap', () => {
    const cdsAuthorizationStrategy = amsPluginRuntime.authorizationStrategy;
    cdsAuthorizationStrategy.xssecStrategy.withApiMapper(api => `internal.${api}`);
    // cdsAuthorizationStrategy.xssecStrategy.withServicePlanMapper(plan => `internal.${plan}`);
})

cds.on('served', async () => {
    await amsPluginRuntime.getAms().whenReady(5000); // AMS startup check. TODO: couple this with /health endpoint instead
    console.error("AMS ready");
});