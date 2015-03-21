(function($, Caman){

'use strict';

	$(document).ready(function registerCamanFilters(){

		Caman.Filter.register("custom", custom);

		function custom() {
			this.process("custom", function (rgba) {
				return rgba;
			});
		}


        Caman.Filter.register("filterByMaxMin", function(currentMin, currentMax, percent, bhash){
          var threshold = {};
          var factor = percent / 100;
          _.each(currentMin, function(value, key){
            threshold[key] = (currentMax[key] - currentMin[key])*factor;
          });
          this.process("filterByDarkest", function(rgba){

            var hsl = Caman.Convert.rgbToHSL(rgba);
            if (rgba.r > currentMin.r + threshold.r || 
                rgba.g > currentMin.g + threshold.g || 
                rgba.b > currentMin.b + threshold.b){
              rgba.r = 255;
              rgba.g = 255;
              rgba.b = 255;
            } else {

              if (bhash[Math.floor(hsl.l*100)/100]){
                bhash[Math.floor(hsl.l*100)/100]++;
              }else{
                bhash[Math.floor(hsl.l*100)/100] = 1;
              }

              if(hsl.h < 0.60 && hsl.h > 0.1){
                rgba.r = 255;
                rgba.g = 255;
                rgba.b = 255;
              }
            }

            return rgba;
          });
        });

        Caman.Filter.register("findMinMax", function(currentMin, currentMax){
          currentMin.r = 255;
          currentMin.g = 255;
          currentMin.b = 255;

          currentMax.r = 1;
          currentMax.g = 1;
          currentMax.b = 1;

          currentMin.h = 1;ß
          currentMin.s = 1;
          currentMin.l = 1;

          currentMax.h = 0;
          currentMax.s = 0;
          currentMax.l = 0;

          this.process("findMinMax", function(rgba){

            var hsl = Caman.Convert.rgbToHSL(rgba);

            _.each(rgba, function(value,key){
              if(value > currentMax[key]){
                currentMax[key] = value;
              }
              if(value < currentMin[key]){
                currentMin[key] = value;
              }
            });

            _.each(hsl, function(value,key){
              if(value > currentMax[key]){
                currentMax[key] = value;
              }
              if(value < currentMin[key]){
                currentMin[key] = value;
              }
            });

            return rgba;
          });
        });

	});
})($,Caman);