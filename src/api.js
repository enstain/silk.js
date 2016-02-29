"use strict";

import {encoder} from "./encoder"
const BASE_URL = PRODUCTION ? "https://up-finder.com:443/" : "http://staging.up-finder.com:80/";

class API {
	constructor(token) {
		if (DEBUG) {
			console.log('api got token', token);	
		}
		this.token = encoder.decode(token);
	}

	create(entity, callback) {
		this._send("POST", `${BASE_URL}events`, JSON.stringify(entity), callback);
	}

	show(entity_uuid, callback) {
		this._send("GET", `${BASE_URL}events/${entity_uuid}`, 0, callback);
	}

	_send(method, url, params, callback) {
		var xhr = new XMLHttpRequest();
	    xhr.open(method, url, true);
	    
	    xhr.onreadystatechange = function() {
	        if (xhr.readyState == 4) {
	            var data = xhr.responseText;
	            try {
	                data = JSON.parse(data);
	            } catch (exc) {
	            }
	            if (callback) {
	                callback(data);
	            }
	        }
	    }

	    xhr.setRequestHeader("X-Secret", this.token); 
	    if (params) {
	    	xhr.send(params);	
	    } else {
	    	xhr.send();
	    }
	}
}

export default API;