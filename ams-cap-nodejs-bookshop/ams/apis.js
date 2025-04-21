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

module.exports = {
    mapTechnicalUserApi,
    mapPrincipalPropagationApi
}