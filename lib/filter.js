var Caman      = require('caman').Caman;


Caman.Filter.register("threshold", function(adjusted){
  var threshold = 255 * adjusted /100;

  this.process("threshold", function(rgba){
    //Filter by threshold
    if (rgba.r > threshold || rgba.g > threshold || rgba.b > threshold){
      rgba.r = 240;
      rgba.g = 240;
      rgba.b = 240;
    }else{
      rgba.r = 15;
      rgba.g = 15;
      rgba.b = 15;
    }

    return rgba;
  });
});

Caman.Filter.register("test", function(adjusted){
  var threshold = 255 * adjusted /100;

  this.process("test", function(rgba){

    var array = ['r', 'g', 'b'];
    var total = 0;
    for (var i=0; i<array.length; i++){
      if (rgba[array[i]] > threshold){
        rgba[array[i]] = 240;
      }else{
        rgba[array[i]] = 15;
      }
      total += rgba[array[i]];
    }

    rgba.r = total/3;
    rgba.g = total/3;
    rgba.b = total/3;  

    return rgba;
  });
});

Caman.Filter.register("filterThreshold", function(adjusted){
  var threshold = 255 * adjusted /100;

  this.process("filterThreshold", function(rgba){

    var array = ['r', 'g', 'b'];
    var count = 0;
    for (var i=0; i<array.length; i++){
      if (rgba[array[i]] < threshold){
        count++;
      }
    }

    if (count < 2){
      rgba.r = 255;
      rgba.g = 255;
      rgba.b = 255;  
    }

    return rgba;
  });
});

//Filter by RBG range
Caman.Filter.register("filterByRBGRange", function(adjusted){
  var range = adjusted;

  this.process("filterByRBGRange", function(rgba){

    var array = [rgba.r, rgba.g, rgba.b];
    var max = _.max(array);
    var min = _.min(array);

    if (max > min + range){
      rgba.r = 255;
      rgba.g = 255;
      rgba.b = 255; 
    }

    return rgba;
  });
});


//Determine hash of all the brightness value and number of occurance
Caman.Filter.register("hashScale", function(hash, first){
  this.process("hashScale", function(rgba){
    var rgb = {
      r: rgba.r,
      g: rgba.g,
      b: rgba.b
    };

    var brightness = Math.floor(Math.sqrt( 0.241*rgb.r*rgb.r + 0.691*rgb.g*rgb.g + 0.068*rgb.b*rgb.b ));
    if (first){    
      if (hash[brightness]){
        hash[brightness]++;
      } else {
        hash[brightness] = 1;
      }
    }else{
      var json = rgb.r+"-"+rgb.g+"-"+rgb.b;
      if (hash[brightness]){
        if (hash[brightness][json]){
          hash[brightness][json]++;
        }else{
          hash[brightness][json] = 1;
        }
      } else {
        hash[brightness] = {};
        hash[brightness][json] =1;
      }
    }

    return rgba;
  });
});


Caman.Filter.register("filterByBrightness", function(min, threshold){
  this.process("filterByBrightness", function(rgba){
    var brightness = Math.floor(Math.sqrt( 0.241*rgba.r*rgba.r + 0.691*rgba.g*rgba.g + 0.068*rgba.b*rgba.b ));


    if (brightness > min+threshold){
      rgba.r = 240;
      rgba.g = 240;
      rgba.b = 240;
    }

    return rgba;
  });
});

exports = Caman;var calculateHue = function(rgba){
  var r = rgba.r/255;
  var b = rgba.b/255;
  var g = rgba.g/255;
  var hue;

  var min = _.min([r, b, g]);
  var max = _.max([r, b, g]);

  if (r === max){
    hue = (g-b)/(max-min);
  } else if (b === max){
    hue = 2.0 + (b-r)/(max-min);
  } else {
    hue = 4.0 + (r-g)/(max-min);
  }

  hue = hue*60;

  if (hue < 0){
    hue = hue+360;
  }
  return hue;
};