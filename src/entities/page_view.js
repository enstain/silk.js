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

}

export default PageView;