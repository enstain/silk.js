"use strict";
//import {mock} from 'mocktail';

//SEND HEADER TO EVERY API POINT
//X-Secret = 
//ajax data = json

class API {
	constructor() {
		
	}

	static create(entity, callback) {
		console.log('request for create', JSON.stringify(entity));
		setTimeout(function() {
			callback();
		},  Math.floor(Math.random() * (1000 + 1)) + 1000);
		
	}

	static show(entity) {
		return true;
	}
}

export default API;