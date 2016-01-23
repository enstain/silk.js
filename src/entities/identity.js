"use strict";

import Entity from "../entity"
import CookiesRecorder from "../cookies_recorder"
import Queue from "../queue"

class Identity extends Entity {

	constructor() {
		super();
		this.user_agent = navigator.userAgent;
		this.saveToCookies();
		new Queue().setIdentity(this);
	}

	static create() {
		let uuid = CookiesRecorder.getCookie("identity_uuid");
		if (uuid) {
			return uuid;
		}
		return new Identity().uuid;
	}

	saveToCookies() {
		CookiesRecorder.setCookie("identity_uuid", this.uuid);
	}

}

export default Identity;