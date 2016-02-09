"use strict";

import Entity from "../entity"

class PageView extends Entity {

	constructor() {
		super();
		this.event_type = "pageview";
		this.referer_uri = document.referrer;
		super.addToQueue();
	}

}

export default PageView;