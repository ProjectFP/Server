var Caman      = require('caman').Caman;
var _          = require('lodash');

var RGBMAX = 255;
var RGBMIN = 0;
var HSLRANGE = {
    upper: 0.6,
    lower: 0.1
};
var ACCEPTANCE = 50;

Caman.Filter.register("findMinMax", function(currentMin, currentMax){
  currentMin.r = RGBMAX;
  currentMin.g = RGBMAX;
  currentMin.b = RGBMAX;

  currentMax.r = RGBMIN;
  currentMax.g = RGBMIN;
  currentMax.b = RGBMIN;

  currentMin.h = RGBMIN;
  currentMin.s = RGBMIN;
  currentMin.l = RGBMIN;

  currentMax.h = RGBMIN;
  currentMax.s = RGBMIN;
  currentMax.l = RGBMIN;

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

Caman.Filter.register("filterByMaxMin", function(currentMin, currentMax, bhash){
  var threshold = {};
  var factor = ACCEPTANCE / 100;
  _.each(currentMin, function(value, key){
    threshold[key] = (currentMax[key] - currentMin[key])*factor;
  });
  this.process("filterByDarkest", function(rgba){

    var hsl = Caman.Convert.rgbToHSL(rgba);
    if (rgba.r > currentMin.r + threshold.r || 
        rgba.g > currentMin.g + threshold.g || 
        rgba.b > currentMin.b + threshold.b){
      rgba.r = RGBMAX;
      rgba.g = RGBMAX;
      rgba.b = RGBMAX;
    } else {

      if (bhash[Math.floor(hsl.l*100)/100]){
        bhash[Math.floor(hsl.l*100)/100]++;
      }else{
        bhash[Math.floor(hsl.l*100)/100] = RGBMIN;
      }

      if(hsl.h < HSLRANGE.upper && hsl.h > HSLRANGE.lower){
        rgba.r = RGBMAX;
        rgba.g = RGBMAX;
        rgba.b = RGBMAX;
      } else {
        rgba.r = RGBMIN;
        rgba.g = RGBMIN;
        rgba.b = RGBMIN;
      }
    }

    return rgba;
  });
});

exports.camanFilter = Caman;
