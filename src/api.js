"use strict";

var request = require('ajax-request');
var BASE_URL = "http://staging.up-finder.com:80/";
var token = "test";

class API {
	constructor() {
		
	}

	static create(entity, callback) {
		API._send("POST", `${BASE_URL}events`, JSON.stringify(entity), callback);
	}

	static show(entity_uuid, callback) {
		API._send("GET", `${BASE_URL}events/${entity_uuid}`, 0, callback);
	}

	static _send(method, url, params, callback) {
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

	    xhr.setRequestHeader("X-Secret", token); 
	    if (params) {
	    	xhr.send(params);	
	    } else {
	    	xhr.send();
	    }
	}
}

export default API;