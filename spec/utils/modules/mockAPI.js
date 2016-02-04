"use strict";

class MockAPI {
	constructor() {
		
	}

	static create(entity, callback) {
		console.log('mock request for create', JSON.stringify(entity));
		callback();
	}

	static show(entity, callback) {
		callback(true);
	}
}

export default MockAPI;