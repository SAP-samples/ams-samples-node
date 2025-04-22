
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/ams-samples-node)](https://api.reuse.software/info/github.com/SAP-samples/ams-samples-node)

# AMS Sample Applications (Node.js)
The Node.js sample applications in this repository demonstrate [policy based authorization](https://help.sap.com/docs/identity-authentication/identity-authentication/configuring-authorization-policies?locale=en-US) with the Authorization Management Service (AMS) in applications that authenticate users via the [SAP Cloud Identity Services](https://help.sap.com/docs/identity-authentication?locale=en-US) (SCI). The focus of the samples is on the authorization via AMS but as the authentication is a necessary requirement, it is demonstrated as well.

- [Node.js CAP sample application](./ams-cap-nodejs-bookshop/)
- [Node.js Express sample application](./ams-express-shopping/)

## Description
AMS is the component of SCI that can be enabled to implement and manage an application's authorization in a flexible policy-based language called Data Control Language (DCL). Besides standard authorization checks, it enables applications to provide instance-based authorization capabilities to customers, e.g. limiting a user's access to a slice of the data based on cross-cutting attributes such as company code or region.

When deployed, authorization policies are managed in the SCI administration cockpit. When running locally, e.g. during development or testing, policies are edited in the IDE and can be assigned to mocked users as demonstrated by the samples.

## Requirements
- a Node.js LTS version that is at least [in maintenance](https://nodejs.org/en/about/previous-releases)
- a JDK 17+ for local DCL compilation before unit tests

## How to obtain support
For bugs and issues of the sample applications themselves or questions about the content, please [create an issue](https://github.com/SAP-samples/ams-samples-node/issues) in this repository.

For formal feature requests, bug reports, security issues and support of the client libraries, please use the support channels mentioned in the `README.md` that comes with [@sap/ams](https://www.npmjs.com/package/@sap/ams) and [@sap/ams-dev](https://www.npmjs.com/package/@sap/ams-dev).
 
## Contributing
If you wish to contribute code for the samples, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License
Copyright (c) 2025 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.
