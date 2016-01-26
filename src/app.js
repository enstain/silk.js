"use strict";

import Identity from "./entities/identity"
import PageView from "./entities/page_view"
import FormSubmit from "./entities/form_submit"
import {queue} from "./queue"

Identity.create();
PageView.create();
queue.execute();

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);

    function onLoadHook() {
    	jQuery('form[data-silk]').submit(function() {
	    	new FormSubmit(jQuery(this));
	    });
    }

    if(typeof jQuery=='undefined') {
	    var headTag = document.getElementsByTagName("head")[0];
	    var jqTag = document.createElement('script');
	    jqTag.type = 'text/javascript';
	    jqTag.src = 'https://code.jquery.com/jquery-2.2.0.min.js';
	    jqTag.onload = onLoadHook;
	    headTag.appendChild(jqTag);
	} else {
		onLoadHook();
	}

},false);
