# CAP Bookshop Sample with SAP Cloud Identity Services

This sample uses the [CAP bookshop sample](https://github.com/SAP-samples/cloud-cap-samples/tree/main/bookshop) to demonstrate authentication via [SAP Cloud Identity Services](https://help.sap.com/docs/identity-authentication?locale=en-US) (SCI) and [policy based authorization](https://help.sap.com/docs/identity-authentication/identity-authentication/configuring-authorization-policies?locale=en-US) via its Authorization Management Service (AMS) component.

The repository contains a guided tour for the [CodeTour](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour#:~:text=CodeTour%20is%20a%20Visual%20Studio,a%20code%20review%2FPR%20change.) VSCode extension. The tour guides you through all files in the project related to AMS step-by-step with explanations.
Additionally, for a brief overview of the changes required to add AMS to a minimal version of the sample, you can also compare the file changes in this [PR](https://github.com/SAP-samples/ams-samples-node/pull/9).

### AMS
AMS is the component of SCI for managing authorization policies that control access rights of the application. It allows defining fine-grained access rules at runtime without re-deploying or restarting the application.

Multi-Tenant applications benefit from a ready-to-use authorization cockpit in which administrators of customers are able to extend and manage policies for a tenant-specific user base.\
When deployed, the application's authorizations are managed in the SCI administration cockpit. When running locally, e.g. during development or testing, policies are edited in the IDE and can be assigned to mocked users via the [CAP configuration](./.cdsrc.json).

## Documentation
Refer to the [@sap/ams CAP integration guide](https://www.npmjs.com/package/@sap/ams#cap-integration) for additional documentation.

## Demonstrated Features
- Authentication via SCI (`auth.kind = "ias"`)
- Authorization via AMS
  - [Role](https://cap.cloud.sap/docs/guides/security/authorization#roles) Assignments
  - Advanced filter conditions that exceed the capabilities of the standard [instance-based cds conditions](https://cap.cloud.sap/docs/guides/security/authorization#instance-based-auth)
- [Hybrid testing](https://cap.cloud.sap/docs/advanced/hybrid-testing) via `cds bind`
- Auto-Configuration for deployment via [cds add](https://cap.cloud.sap/docs/tools/cds-cli#cds-add)

<!-- ## Code Tour
Take a [guided tour](.tours/cap-sap-identity-service-sample.tour) through the project by installing the [CodeTour](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.codetour) VS Code extension.

It is probably the quickest way to get an overview about the specifics of a CAP project that uses AMS for managing authorizations. -->

## Getting started
After cloning the sample, first install the necessary node dependencies.

```shell
npm i
```

To play with the sample, we suggest to start your CAP application in watch mode with debug output enabled for the AMS runtime and development plugin:

```shell
DEBUG=ams npx cds watch   # uses the @sap/cds-dk installed locally as devDependency
DEBUG=ams cds watch       # requires @sap/cds-dk installed globally
```

## Testing Locally
### Integration tests
You can look at the integration tests for the [`CatalogService`](./test/cat-service.test.js) and the [`AdminService`](./test/admin-service.test.js). They demonstrate the expected behavior of the application for mocked users with different combinations of authorization policies.

### Manual tests
To test the effect of changes, you can make manual requests against the server by authenticating via *Basic Auth* as one of the mocked users (and an empty password). In the [cds env configuration](./.cdsrc.json#L4), you can see and change the list of policies that is assigned to the mocked users.

If the application was started in watch mode, get creative by making changes and observe the effects. Here's some ideas:

#### Create your own admin policy
- create a new admin policy in [adminPolicies.dcl](./ams/dcl/local/adminPolicies.dcl) with a different filter condition
- assign the policy to a user via the [cds env configuration](./.cdsrc.json#L4)
- validate it works as intended
  - make a request to an entity that is filtered base on the attributes of the policy
  - extend the unit tests

#### Extend the AMS annotations
- add more attribute filters via `ams.attributes` annotations
- extend the role policies in [basePolicies.dcl](./ams/dcl/cap/basePolicies.dcl) if the new AMS attribute is applicable for the existing roles
- [create an admin policy](#create-your-own-admin-policy) that filters a role based on this attribute

## Hybrid Testing
For [CAP Hybrid Testing](https://cap.cloud.sap/docs/advanced/hybrid-testing), you can `cds bind -2 <yourIdentityServiceInstance>` and start the application via

```shell
DBEUG=ams cds w --profile hybrid
```


This allows you to test the application locally but bind it against a SAP Identity Service instance in which you can manage and assign policies for your local application.

Refer to  [@sap/ams Hybrid Testing](https://www.npmjs.com/package/@sap/ams#hybrid-testing) for details.

## Testing on SAP BTP
### Prerequisite
To deploy with *sqlite*, you must copy the [db.sqlite](db.sqlite) file to `gen/srv/db.sqlite` after `cds build --production`.

Please note that `cds add mta` creates a `mta.yaml` that contains a `before-all` command that runs `cds build --production`. This deletes and re-creates the `gen` folder after you manually copied the file. In that case, you should add another command behind it such as `cp db.sqlite gen/srv/db.sqlite` instead of manually copying.

### (Optional) Configure Value Help in mta.yaml
To add value help to your application, include provided-apis, value-help-url and value-help-api-name in ams-cap-nodejs-bookshop-auth: 
```yaml
    provided-apis:
      - name: AMS_ValueHelp
        description: Value Help Callback from AMS
        type: public
    authorization:
      enabled: true
      value-help-url: ~{srv-api/srv-cert-url}/odata/v4/ams-value-help/
      value-help-api-name: AMS_ValueHelp
requires:
  - name: srv-api
  - name: app-api
```

### Deployment

:warning: Please make sure to use `@sap/cds-dk` version `>= 8.7.3` to get correct deployment configurations for *ams*/*ias*. Remember to update your global npm installation of `@sap/cds-dk` if you have one as it has priority over the version specified in *node_modules*. Use `cds version -i` to check.

Before deploying the application, you may want to add additional facets via `cds add <facet> --for production` that you would like to use in your deployment, e.g. an `approuter` to login via the browser. However, such facets are out-of-scope of this sample and not necessary to test the *ams*-related features.

Just follow the standard [Deployment](https://cap.cloud.sap/docs/guides/deployment/) guides on Capire to deploy this sample. It should work with `mta`, `helm` and even `cf-manifest` deployments.

### Turn on AMS Logging
To understand what is going on under the hood in the deployed application, we suggest you set environment variable `DEBUG` to `ams` in your deployed application to see debug output from AMS*. Make sure to restart the application for this to take effect.

\*This is just for understanding the sample and not recommended for real applications.

### Testing
You must fetch an IAS token and use it to call the different services of the application.

#### IAS Token Fetch
First, find your IAS service credentials in the environment of your application _or:_ create a **certificate-based** service key for your IAS service instance.

Use the service credentials and a test user's credentials to fetch a user token with an HTTP Client such a `curl` or *Postman* based on the [official documentation](https://help.sap.com/docs/identity-authentication/identity-authentication/configure-client-to-call-identity-authentication-password-token).\
As an alternative, `xssec 4` provides an easy to use [Node.js API](https://www.npmjs.com/package/@sap/xssec#fetching-tokens) to fetch IAS tokens.

Then, use the `id token` from the response as *Bearer token* when making requests to the deployed application.

#### Policy Administration
You can manage AMS policies in the SAP Identity Service administration of your tenant. Find the IAS service instance called *ams-cap-nodejs-bookshop* in the `Applications` tab and create or assign policies under `Authorization Policies`. Give your application up to 15s to react to changes in policy assignments because roles and are [cached for 15s](./.cdsrc.json#L40).

## Troubleshooting
Enable [debug log output](https://www.npmjs.com/package/@sap/ams#logging-1) for AMS to analyze the problem. For deployment related problems, please refer to the relevant documentation of [SAP BTP](https://help.sap.com/docs/btp).

## Support
This sample comes without any guarantees. If you find any problems in the sample, kindly help the community by creating an issue or pull request.
