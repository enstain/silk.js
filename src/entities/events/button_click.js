"use strict";

import Event from "../event"

class ButtonClick extends Event {

	constructor(silk_data) {
		super(silk_data);
		this.event_type = "click";
		super.addToQueue();
	}

}

export default ButtonClick;