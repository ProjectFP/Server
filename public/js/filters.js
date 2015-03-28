(function($, Caman){

'use strict';

	$(document).ready(function registerCamanFilters(){

		Caman.Filter.register("custom", custom);

		function custom() {
			this.process("custom", function (rgba) {
				return rgba;
			});
		}

        // When filtering both RGB and hsl at the same time it's more efficient
        Caman.Filter.register("filterByMaxMin", function(currentMin, currentMax, percent, bhash){
          var threshold = {};
          var factor = percent / 100;
          _.each(currentMin, function(value, key){
            threshold[key] = (currentMax[key] - currentMin[key])*factor;
          });
          this.process("filterByMaxMin", function(rgba){

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
        
        //Filter by Min Max RGB only
        Caman.Filter.register("filterByMaxMinRGB", function(currentMin, currentMax, percent){
          var threshold = {};
          var factor = percent / 100;
          _.each(currentMin, function(value, key){
            threshold[key] = (currentMax[key] - currentMin[key])*factor;
          });
          this.process("filterByMaxMinRGB", function(rgba){

            var hsl = Caman.Convert.rgbToHSL(rgba);
            if (rgba.r > currentMin.r + threshold.r || 
                rgba.g > currentMin.g + threshold.g || 
                rgba.b > currentMin.b + threshold.b){
              rgba.r = 255;
              rgba.g = 255;
              rgba.b = 255;
            } 

            return rgba;
          });
        });

        //Filter by Min Max RGB only
        //hueMax = 0.6; hueMin = 0.1
        //This should be tuned
        Caman.Filter.register("filterByHue", function(hueMax, hueMin){
          this.process("filterByHue", function(rgba){

            var hsl = Caman.Convert.rgbToHSL(rgba);

            if(hsl.h < hueMax && hsl.h > hueMin){
              rgba.r = 255;
              rgba.g = 255;
              rgba.b = 255;
            }
            return rgba;
          });
        });

        Caman.Filter.register("filterByBrightness", function(currentMin, currentMax, percent){
          var factor = percent / 100;
          // min + range * factor to get threshold
          var threshold = currentMin.bright + (currentMax.bright - currentMin.bright)*factor;
          this.process("filterByBrightness", function(rgba){

            var brightness = Math.floor(Math.sqrt( 0.241*rgba.r*rgba.r + 0.691*rgba.g*rgba.g + 0.068*rgba.b*rgba.b ));            
            if (brightness > threshold){
              rgba.r = 240;
              rgba.g = 240;
              rgba.b = 240;
            }

            return rgba;
          });
        });
        
        //Need to run this first and can save time by skipping hsl
        Caman.Filter.register("findMinMax", function(currentMin, currentMax, applyHsl, applyBrightness){
          currentMin.r = 255;
          currentMin.g = 255;
          currentMin.b = 255;

          currentMax.r = 1;
          currentMax.g = 1;
          currentMax.b = 1;
          if (applyHsl){
            currentMin.h = 1;
            currentMin.s = 1;
            currentMin.l = 1;

            currentMax.h = 0;
            currentMax.s = 0;
            currentMax.l = 0;
          }
          if (applyBrightness){
            currentMin.bright = 255;
            currentMax.bright = 1;
          }

          this.process("findMinMax", function(rgba){

            _.each(rgba, function(value,key){
              if(value > currentMax[key]){
                currentMax[key] = value;
              }
              if(value < currentMin[key]){
                currentMin[key] = value;
              }
            });

            if(applyHsl){
              var hsl = Caman.Convert.rgbToHSL(rgba);
              _.each(hsl, function(value,key){
                if(value > currentMax[key]){
                  currentMax[key] = value;
                }
                if(value < currentMin[key]){
                  currentMin[key] = value;
                }
              });
            }

            if (applyBrightness){
              var brightness = Math.floor(Math.sqrt( 0.241*rgba.r*rgba.r + 0.691*rgba.g*rgba.g + 0.068*rgba.b*rgba.b ));
              if (brightness > currentMax.bright){
                currentMax.bright = brightness;
              }
              if (brightness < currentMin.bright){
                currentMin.bright = brightness;
              }
            }

            return rgba;
          });
        });

	});
})($,Caman);