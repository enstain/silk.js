"use strict";

class API {
	constructor() {
		
	}

	static create(entity) {
		console.log('request for', JSON.stringify(entity))
	}

	static isEntityUncompleteSaved(uuid) {
		return true;
	}
}

export default API;