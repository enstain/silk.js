"use strict";

class MockAPI {
	constructor() {
		
	}

	static create(entity, callback) {
		console.log('mock request for create', JSON.stringify(entity));
		setTimeout(function() {
			callback();
		},  Math.floor(Math.random() * (1000 + 1)));
	}

	static show(entity) {
		return true;
	}
}

export default MockAPI;