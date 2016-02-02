"use strict";

import Event from "../event"

class FormSubmit extends Event {

	constructor(silk_data, form) {
		super(silk_data);
		this.fetchPayload(form);
		super.addToQueue();
	}

	fetchPayload(form) {
		form.serializeArray().map(field => 
			this.payload[field.name] = field.value
		)
	}

}

export default FormSubmit;