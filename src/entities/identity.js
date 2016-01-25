"use strict";

import Entity from "../entity"
import CookiesRecorder from "../cookies_recorder"

class Identity extends Entity {

	constructor() {
		super();
		this.saveToCookies();
	}

	saveToCookies() {
		CookiesRecorder.setCookie("identity_uuid", this.uuid);
	}

	static create() {
		let uuid = Identity.get();
		if (uuid) {
			return uuid;
		} //else
		return new Identity().uuid;
	}

	static get() {
		return CookiesRecorder.getCookie("identity_uuid");
	}

}

export default Identity;