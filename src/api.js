"use strict";

class API {
	constructor() {
		
	}

	static create(entity, callback) {
		console.log('request for create', JSON.stringify(entity));
		setTimeout(function() {
			console.log('timeout');
			callback();
		},  Math.floor(Math.random() * (1000 + 1)) + 1000);
		
	}

	static isEntityUncompleteSaved(uuid) {
		return true;
	}
}

export default API;