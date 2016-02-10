"use strict";

import Event from "../event"

class FormSubmit extends Event {

	constructor(silk_data, form) {
		super(silk_data);
		this.event_type = "formSubmit";
		this.fetchPayload(form);
		super.addToQueue();
	}

	fetchPayload(form) {
		let o = {}
		let a = form.serializeArray()

		$.each(a, function() {
			console.log('serial', this);
			if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
		})

		this.payload = o;
	}

}

export default FormSubmit;