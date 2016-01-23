"use strict";

import Queue from "./queue"

class Entity {

	constructor() {
		this.uuid = Entity.uuid_generator();
	}

	fetchPayload() {
		this.payload = {}
	}

	addToQueue() {
		new Queue().addToQueue(this);
	}

	static uuid_generator() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	}

}

export default Entity;