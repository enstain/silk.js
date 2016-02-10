"use strict";

import Entity from "../entity"

class Event extends Entity {

	constructor(silk_data) {
		super();
		this.action_name = silk_data;
	}

}

export default Event;
