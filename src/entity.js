"use strict";

import {queue} from "./queue"
import PageInspector from "./page_inspector"
import CookiesRecorder from "./cookies_recorder"

class Entity {

	constructor(params) {
		this.uuid = Entity.generateUUID();
		this.user_id = Entity.getUserUUID();
		this.payload = {}
	}

	addToQueue() {
		queue.add(this.serialize());
	}

	serialize() {
		return {
			uuid: this.uuid,
			event_type: this.event_type,
			payload: this.payload,
			user_id: this.user_id,
			page_url: PageInspector.getPageUrl()
		}
	}

	static generateUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		    var r = crypto.getRandomValues(new Uint8Array(1))[0]%16|0, v = c == 'x' ? r : (r&0x3|0x8);
		    return v.toString(16);
		});
	}

	static getUserUUID() {
		let uuid = CookiesRecorder.getCookie("identity_uuid");
		if (uuid === undefined) {
			uuid = Entity.generateUUID();
			CookiesRecorder.setCookie("identity_uuid", uuid);
		}
		return uuid;
	}

}

export default Entity;