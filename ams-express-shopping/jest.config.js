module.exports = {
    roots: ['test'],
    testMatch: ['**/?(*.)+(spec|test)\\.js'],
    setupFiles: ['./test/awaitTestBundlePdpReady.js'] // creates an AMS instance with the test bundle and waits for the loading to be done before the tests begin
  };