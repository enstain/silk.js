"use strict";

import Entity from "../entity"

class AddToCart extends Entity {

	constructor() {
		super();
		super.addToQueue();
	}

}

export default AddToCart;