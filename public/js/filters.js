(function($, Caman){

'use strict';

	$(document).ready(function registerCamanFilters(){

		Caman.Filter.register("custom", custom);

		function custom() {
			this.process("custom", function (rgba) {
				return rgba;
			});
		}

	});
})($,Caman);