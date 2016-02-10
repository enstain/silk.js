"use strict";

import Entity from "../entity"

class PageView extends Entity {

	constructor() {
		super();
		this.event_type = "pageview";
		super.addToQueue();
	}

}

export default PageView;