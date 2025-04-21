const { IdentityService } = require('@sap/xssec');
const xsenv = require('@sap/xsenv');

let credentials = xsenv.serviceCredentials({ label: 'identity' });
let identityService = new IdentityService(credentials);

// here one could schedule a function to update certificate and key based on ZTIS
function onUpdatedCertificateAndKey(cert, key) {
    identityService.setCertificateAndKey(cert, key);
}

module.exports = identityService;