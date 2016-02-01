"use strict";

import PageView from "./entities/page_view"
import FormSubmit from "./entities/form_submit"
import AddToCart from "./entities/add_to_cart"
import {queue} from "./queue"

new PageView();

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);

    function onLoadHook() {
    	jQuery('[data-silk="form_submit"]').bind("submit", function() {
	    	new FormSubmit(jQuery(this));
	    });

	    jQuery('[data-silk="add_to_cart_click"]').bind("click", function() {
	    	new AddToCart();
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
