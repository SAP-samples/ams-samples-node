// ---------------------------------HEADER_START-----------------------------------------------
// Generated from a CAP model by the SAP AMS Plugin (@sap/ams) 2.0.0
// hash of generated content: 8537b8096e1fb048199d1f1559d5eefc36a8df54921c560050a413d40c07688b
// ----------------------------------HEADER_END------------------------------------------------

SCHEMA {
	description: String,
	genre: String,
	just: {
		for: {
			showcasing: {
				attributeNesting: Number
			}
		}
	},
	stock: Number
}