"use strict";

class MockFailureAPI {
	constructor() {
		
	}

	static create(entity, callback) {
		console.log('mock request for create', JSON.stringify(entity));
	}

	static show(entity) {
		return true;
	}
}

export default MockFailureAPI;