"use strict";

import SourceResolver from "./page_inspector_utils/source_resolver.js"

class PageInspector {

	constructor() {
        this.source_data = new SourceResolver().data;
	}

	getPageUrl() {
		return document.location.href
	}

}

export default PageInspector;