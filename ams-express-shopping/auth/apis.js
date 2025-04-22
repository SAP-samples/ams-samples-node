const TECHNICAL_USER_APIS = [
    "GetProducts"
]

const PRINCIPAL_PROPAGATION_APIS = [
    "GetProducts",
    "ExternalOrder"
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