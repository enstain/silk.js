"use strict";

import Barn from "../node_modules/barn/index.js"
import PageInspector from "./page_inspector"
import CookiesRecorder from "./cookies_recorder"
import API from "./api"

class Queue {
	constructor() {
		this.barn = new Barn(localStorage); 
	}

	addToQueue(entity) {
		console.log('add to queue', entity)
		let identity = this.getIdentity();
		this.barn.lpush('list', entity.uuid);
		this.barn.set(entity.uuid, {
			type: entity.constructor.name,
			user_id: identity.uuid,
			user_agent: identity.user_agent,
			ip_address: PageInspector.getIpAddress(),
			page_url: PageInspector.getPageUrl(),
			payload: entity.payload
		});
	}

	setIdentity(identity) {
		this.barn.set(identity.uuid, identity);
	}

	getIdentity() {
		let uuid = CookiesRecorder.getCookie("identity_uuid");
		return this.barn.get(uuid);
	}

	lookupQueue() {
		while (this.barn.llen('list') > 0) {
			let uuid = this.barn.lpop('list');
			if (API.isEntityUncompleteSaved(uuid)) {
				let unsaved_entity = this.barn.get(uuid);
				API.create(unsaved_entity);
			}
		}
		this.barn.condense();
	}
}

export default Queue;