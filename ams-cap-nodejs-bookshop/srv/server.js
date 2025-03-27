const cds = require('@sap/cds');
const { technicalUserFlows: { TECHNICAL_USER, PRINCIPAL_PROPAGATION }, cap: { amsPluginRuntime } } = require("@sap/ams");

const TECHNICAL_USER_APIS = [
    "ReadCatalog"
]

const PRINCIPAL_PROPAGATION_APIS = [
    "AMS_ValueHelp",
    "ReadCatalog"
]

function mapTechnicalUserApi(api) {
    if (TECHNICAL_USER_APIS.includes(api)) {
        return `internal.${api}`;
    }
}

function mapPrincipalPropagationApi(api) {
    if (PRINCIPAL_PROPAGATION_APIS.includes(api)) {
        return `internal.${api}`;
    }
}

cds.on('bootstrap', () => {
    const cdsAuthProvider = amsPluginRuntime.authProvider;
    cdsAuthProvider.xssecAuthProvider.withApiMapper(mapTechnicalUserApi, TECHNICAL_USER);
    cdsAuthProvider.xssecAuthProvider.withApiMapper(mapPrincipalPropagationApi, PRINCIPAL_PROPAGATION);
    // cdsAuthProvider.xssecAuthProvider.withServicePlanMapper(plan => `internal.${plan}`);
})

cds.on('served', async () => {
    await amsPluginRuntime.getAms().whenReady(5000); // AMS startup check. TODO: couple this with /health endpoint instead
    console.error("AMS ready");
});