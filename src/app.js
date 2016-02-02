"use strict";

import PageView from "./entities/page_view"
import FormSubmit from "./entities/form_submit"
import ButtonClick from "./entities/button_click"
import {queue} from "./queue"

//new PageView();

window.addEventListener("load", function load(event){
    window.removeEventListener("load", load, false);

    function onLoadHook() {
    	jQuery('form[data-silk]').submit(function() {
    		/*let form = jQuery(this);
    		let silk_data = form.data('silk-submit');*/
    		console.log('form', jQuery(this));
	    	new FormSubmit(jQuery(this));
    	}); 
    		
	    jQuery('[data-silk-click]').bind("click", function() {
	    	let silk_data = jQuery(this).data('silk-click');
	    	new ButtonClick(silk_data);
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
