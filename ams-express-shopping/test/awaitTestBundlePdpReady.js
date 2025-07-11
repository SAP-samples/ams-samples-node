const { ams } = require("../auth/authorize");

/**
 * This script is configured as a setup script in the jest config to wait for the AMS instance to be ready before running the test cases.
 */
module.exports = async() => {
    try {
        await ams.whenReady(process.env.AMS_STARTUP_TIMEOUT);
    } catch(e) {
        console.error(e);
        process.exit(1);
    }
}