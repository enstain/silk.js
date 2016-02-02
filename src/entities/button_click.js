"use strict";

import Entity from "../entity"

class ButtonClick extends Entity {

	constructor(silk_data) {
		super();
		this.payload.silk_data = silk_data;
		super.addToQueue();
	}

}

export default ButtonClick;