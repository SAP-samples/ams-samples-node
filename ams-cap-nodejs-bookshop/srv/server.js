const cds = require('@sap/cds');
const { technicalUserFlows: { TECHNICAL_USER, PRINCIPAL_PROPAGATION }, amsCapPluginRuntime } = require("@sap/ams");
const { mapTechnicalUserApi, mapPrincipalPropagationApi } = require('../ams/apis');

cds.on('bootstrap', () => {
    const cdsAuthProvider = amsCapPluginRuntime.authProvider;
    cdsAuthProvider.xssecAuthProvider.withApiMapper(mapTechnicalUserApi, TECHNICAL_USER);
    cdsAuthProvider.xssecAuthProvider.withApiMapper(mapPrincipalPropagationApi, PRINCIPAL_PROPAGATION);
    // cdsAuthProvider.xssecAuthProvider.withServicePlanMapper(plan => `internal.${plan}`);
})

cds.on('served', async () => {
    await amsCapPluginRuntime.getAms().whenReady(5000); // AMS startup check. TODO: couple this with /health endpoint instead
    console.log("AMS has become ready.");
});