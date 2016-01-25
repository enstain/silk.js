"use strict";

import Barn from "../node_modules/barn/index.js"
import API from "./api"

class Queue {
	constructor(storage) {
		this.barn = new Barn(storage || localStorage); 
	}

	add(entity) {
		console.log('add to queue', entity);
		
		this.barn.lpush('waitList', entity.uuid);
		this.barn.set(entity.uuid, entity.getFetchedObjectForQueue());
	}

	revise() {
		while (this.barn.llen('waitList') > 0) {
			let uuid = this.barn.lpop('waitList');
			if (API.isEntityUncompleteSaved(uuid)) {
				let unsaved_entity = this.barn.get(uuid);
				API.create(unsaved_entity);
			}
		}
		this.barn.condense();
	}
}

export default Queue;