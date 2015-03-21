var formidable = require('formidable');
var util       = require('util');
var fs         = require('fs-extra');
var tesseract  = require('node-tesseract');
var Caman      = require('caman').Caman;
var _          = require('lodash');
var fs         = require('fs');
var path       = require('path');



var string = "";
Caman.Filter.register("writeRGB", function(){
  this.process("writeRGB", function(rgba){
    string += rgba.r+", "+rgba.g+", "+rgba.b+"\n";

    var temp = Caman.Convert.rgbToHSL(rgba);

    return rgba;
  });
});

function calculateHue(rbga){
  var r = rgba.r/255;
  var b = rgba.b/255;
  var g = rbga.g/255;
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
}

var calculateHue = function(rgba){
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

// customized filter
Caman.Filter.register("findMinMax", function(currentMin, currentMax, calculateHue){
  currentMin.r = 255;
  currentMin.g = 255;
  currentMin.b = 255;
  // currentMin.birghtness = 255;
  // currentMin.hue = 360;
  currentMax.r = 1;
  currentMax.g = 1;
  currentMax.b = 1;
  // currentMax.birghtness = 1;
  // currentMax.hue = 1;
  currentMin.h = 1;
  currentMin.s = 1;
  currentMin.l = 1;
  // currentMin.birghtness = 255;
  // currentMin.hue = 360;
  currentMax.h = 0;
  currentMax.s = 0;
  currentMax.l = 0;


  this.process("findMinMax", function(rgba){
    // var brightness = Math.floor(Math.sqrt( 0.241*rgba.r*rgba.r + 0.691*rgba.g*rgba.g + 0.068*rgba.b*rgba.b ));
    // if(brightness > currentMax.brightness){
    //   currentMax.brightness = brightness;
    // }

    // if(brightness < currentMin.brightness){
    //   currentMin.brightness = brightness;
    // }

    // var hue = calculateHue(rgba);
    // if(hue > currentMax.hue){
    //   currentMax.hue = hue;
    // }

    // if(hue < currentMin.hue){
    //   currentMin.hue = hue;
    // }

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

Caman.Filter.register("filterByMaxMin", function(currentMin, currentMax, percent, calculateHue, bhash){
  var threshold = {};
  var factor = percent / 100;
  _.each(currentMin, function(value, key){
    threshold[key] = (currentMax[key] - currentMin[key])*factor;
  });
  this.process("filterByDarkest", function(rgba){
    // var brightness = Math.floor(Math.sqrt( 0.241*rgba.r*rgba.r + 0.691*rgba.g*rgba.g + 0.068*rgba.b*rgba.b ));
    // var hue = Math.floor(calculateHue(rgba));

    var hsl = Caman.Convert.rgbToHSL(rgba);
    if (rgba.r > currentMin.r + threshold.r || 
        rgba.g > currentMin.g + threshold.g || 
        rgba.b > currentMin.b + threshold.b){
        // brightness > currentMin.brightness + threshold.brightness){
      rgba.r = 240;
      rgba.g = 240;
      rgba.b = 240;
    } else {
      // if (hsl.s > currentMax.s - threshold.s){
      //   rgba.r = 240;
      //   rgba.g = 240;
      //   rgba.b = 240;
      // }else{
      //   if (bhash[hsl.h]){
      //     bhash[hsl.h] += 1;
      //   }else{
      //     bhash[hsl.h] = 1;
      //   }
      // } 
    }

    return rgba;
  });
});




// upload image

var upload = function (req, res){
  var form = new formidable.IncomingForm();
  
  form.parse(req, function(err, fields, files) {
    res.writeHead(200, {'content-type': 'text/plain'});
    res.write('received upload:\n\n');
    res.end(util.inspect({fields: fields, files: files}));
  });

  form.on('end', function(fields, files) {
    /* Temporary location of our uploaded file */
    var temp_path = this.openedFiles[0].path;
    /* The file name of the uploaded file */
    var file_name = this.openedFiles[0].name;
    /* Location where we want to copy the uploaded file */
    var new_location = 'uploads/';

    var canvas = Caman(temp_path, function () {

      // this.writeRGB();
      var currentMin = {};
      var currentMax = {};
      var bhash = {};
      this.findMinMax(currentMin, currentMax, calculateHue);
      // console.log(currentMin);
      // var hash = {};
      // this.hashScale(hash, true);


      this.render(function () {
        // console.log(hash);
        // var min = _.min(Object.keys(hash).map(function(string){
        //   return parseInt(string);
        // }));
        // console.log(min);
        // this.filterByBrightness(min, 90);
        // hash = {};
        // this.hashScale(hash, false);
        console.log(currentMin, currentMax);
        this.filterByMaxMin(currentMin, currentMax, 42, calculateHue, bhash);

        this.render(function(){
          console.log(bhash);
          var newName = 'filtered.png';
          console.log(__dirname+'/../' + new_location + newName);
          this.save(__dirname+'/../' + new_location + newName);
          console.log('saving');

          fs.writeFile('rgbcsv.txt', string, function (err) {
              if (err) throw err;
              console.log('It\'s saved! in same location.');
          });

          // Caman js doesn't support asynch save needs use fs write and
          // canvas.toBuffer() to support callback
          fs.writeFile(temp_path, this.canvas.toBuffer(), function(err){
            console.log('fs callback');
            tesseract.process(temp_path,function(err, text) {
              if(err) {
                console.error(err);
              } else {
                console.log("success!");
                console.log(text);
              }
            });

          });

          console.log('after buffering');
          
        });
      });
    });

    // fs.copy(temp_path, new_location + file_name, function(err) {  
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log("success!");
    //     tesseract.process(__dirname + '/../' +new_location + file_name,function(err, text) {
    //       if(err) {
    //         console.error(err);
    //       } else {
    //         console.log(text);
    //       }
    //     });
    //   }
    // });
  });
};

exports.upload = upload;

exports.upload2 = upload2;

function upload2(req, res){
  var imagePath,
      base64Data;

  imagePath = path.resolve(__dirname, './../crop.png');
  base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");

  fs.writeFile("crop.png", base64Data, 'base64', function(err) {
    if(err){
      console.log('Error Writing Image', err);
    }

    tesseract.process(imagePath, function(err, text) {
      if(err) {
        console.error(err);
        res.send(500);

      } else {
        res.status(200).json({text: text});
      }
    });
  });

}