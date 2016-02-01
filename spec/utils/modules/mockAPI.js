"use strict";

class MockAPI {
	constructor() {
		
	}

	static create(entity, callback) {
		console.log('mock request for create', JSON.stringify(entity));
		setTimeout(function() {
			callback();
		},  Math.floor(Math.random() * (100 + 1)));
	}

	static show(entity, callback) {
		setTimeout(function() {
			callback(true);
		},  Math.floor(Math.random() * (100 + 1)));
	}
}

export default MockAPI;