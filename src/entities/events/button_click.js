"use strict";

import Event from "../event"

class ButtonClick extends Event {

	constructor(silk_data) {
		super(silk_data);
		super.addToQueue();
	}

}

export default ButtonClick;