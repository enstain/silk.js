"use strict";

import Entity from "../entity"

class PageView extends Entity {

	constructor() {
		super();
		this.fetchPayload();
		super.addToQueue();
	}

	fetchPayload() {
		this.payload = {
			referer_uri: document.referrer
		}
	}

	static create() {
		return new PageView().uuid;
	}

}

export default PageView;