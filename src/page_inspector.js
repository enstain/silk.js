"use strict";

class PageInspector {

	constructor() {
		
	}

	static getUserAgent() {
		return navigator.userAgent
	}

	static getIpAddress() {
		return "127.0.0.1"
	}

	static getPageUrl() {
		return document.location.href
	}

}

export default PageInspector;