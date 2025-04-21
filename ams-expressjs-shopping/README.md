# SAP Identity Service Authentication and Authorization Sample

This project is a sample application that demonstrates how to use SAP Identity Service for authentication and authorization via the client libraries [`@sap/xssec`](https://www.npmjs.com/package/@sap/xssec) and [`@sap/ams`](https://www.npmjs.com/package/@sap/ams).

---

## Demonstrated Features

1. **Authentication via IAS (Identity Authentication Service)**:
   - Uses the `@sap/xssec` library to authenticate users via SAP Identity Service.

1. **Authorization via AMS (Authorization Management Service)**:
   - Uses the `@sap/ams` library to check user privileges for specific actions and resources and provide instance-based authorization.
   - Demonstrates how to configure and use the `IdentityServiceAuthProvider` for authorization based on IAS tokens.

1. **Middleware Integration**:
   - Demonstrates how to integrate the client libraries into an Express application for seamless access to the security context and authorization checks in any place where the `req` object is available.

1. **Technical communication** via SAP Identity Service APIs
   - Demonstrates how the `IdentityServiceAuthProvider` can authorize principal propagation requests from other systems that consume SAP Identity Service APIs of this application. The resulting authorizations are the intersection of the user's policies and the policies defined for the consumed API.

1. **Mocking security contexts for Testing**:
   - Shows how different security contexts can be mocked for testing without authenticating via a real IAS instance.
   - Demonstrates how to compile DCL policies locally to DCN and use users with mocked policy assignments for testing without a real AMS instance.

1. **Privilege-Based UI Rendering**:
   - Includes an example of how to retrieve potential user privileges to determine which UI elements to display.

---

## Project Structure

- **`server.js`**:
  - The main application server setup.

- **`auth/authenticate.js` and `auth/authorize.js`**:
  - Contains the main logic for setting up authentication and authorization.

- **`auth/dcl`**:
  - Defines the authorization policies.

- **`db`**:
  - A mock database with dummy data.

- **`service`**:
  - Service layer of the application with request handlers for the REST API.

- **`ui`**:
  - A simple UI to demonstrate features of this project when logged in with users that have different policies assigned.

- **`test`**:
  - Tests against the REST API that demonstrate the expected result of the authorization checks.

---

## Testing

### Run Unit Tests
```bash
npm i
npm test
```

### Start server for local testing
```bash
NODE_ENV=test npm start
```

The application UI will be accessible under https://localhost:3000.