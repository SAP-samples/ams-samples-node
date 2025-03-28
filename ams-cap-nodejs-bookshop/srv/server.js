const cds = require('@sap/cds');
const { technicalUserFlows: { TECHNICAL_USER, PRINCIPAL_PROPAGATION }, cap: { amsPluginRuntime } } = require("@sap/ams");
const { mapTechnicalUserApi, mapPrincipalPropagationApi } = require('../ams/mapAPI');

cds.on('bootstrap', () => {
    const cdsAuthProvider = amsPluginRuntime.authProvider;
    cdsAuthProvider.xssecAuthProvider.withApiMapper(mapTechnicalUserApi, TECHNICAL_USER);
    cdsAuthProvider.xssecAuthProvider.withApiMapper(mapPrincipalPropagationApi, PRINCIPAL_PROPAGATION);
    // cdsAuthProvider.xssecAuthProvider.withServicePlanMapper(plan => `internal.${plan}`);
})

cds.on('served', async () => {
    await amsPluginRuntime.getAms().whenReady(5000); // AMS startup check. TODO: couple this with /health endpoint instead
    console.log("AMS has become ready.");
});