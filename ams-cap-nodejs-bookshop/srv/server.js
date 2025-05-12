const cds = require('@sap/cds');
const {  TECHNICAL_USER_FLOW, PRINCIPAL_PROPAGATION_FLOW, amsCapPluginRuntime } = require("@sap/ams");
const { mapTechnicalUserApi, mapPrincipalPropagationApi } = require('./apis');

cds.on('bootstrap', () => {
    const cdsAuthProvider = amsCapPluginRuntime.authProvider;
    cdsAuthProvider.xssecAuthProvider.withApiMapper(mapTechnicalUserApi, TECHNICAL_USER_FLOW);
    cdsAuthProvider.xssecAuthProvider.withApiMapper(mapPrincipalPropagationApi, PRINCIPAL_PROPAGATION_FLOW);
})

cds.on('served', async () => {
    await amsCapPluginRuntime.ams.whenReady(5000); // AMS startup check. TODO: couple this with /health endpoint instead
    console.log("AMS has become ready.");
});