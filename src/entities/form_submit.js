"use strict";

import Entity from "../entity"

class FormSubmit extends Entity {

	constructor(form) {
		super();
		this.fetchPayload(form);
		super.addToQueue();
	}

	fetchPayload(form) {
		super.fetchPayload();
		form.serializeArray().map(field => 
			this.payload[field.name] = field.value
		)
	}

	static create() {
		return new FormSubmit().uuid;
	}

}

export default FormSubmit;