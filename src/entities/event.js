"use strict";

import Entity from "../entity"

class Event extends Entity {

	constructor(silk_data) {
		super();
		this.payload.silk_data = silk_data;
	}

}

export default Event;
