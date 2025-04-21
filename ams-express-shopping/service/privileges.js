/**
 * Returns the potential privileges of the user to determine which UI elements to show.
 * @param {import("@sap/ams").AuthorizedRequest} req 
 * @param {import("express").Response} res 
 */
const getPrivileges = (req, res) => {
    const privileges = req[AMS_AUTHORIZATIONS].getPotentialPrivileges();
    
    res.json({ privileges });
};

module.exports = getPrivileges;