var formidable = require('formidable');
var util       = require('util');
var fs         = require('fs-extra');
var tesseract  = require('node-tesseract');
var Caman      = require('caman').Caman;
var _          = require('lodash');
var fs         = require('fs');
var path       = require('path');


// customized filter
Caman.Filter.register("findMinMax", function(currentMin, currentMax){
  currentMin.r = 255;
  currentMin.g = 255;
  currentMin.b = 255;

  currentMax.r = 1;
  currentMax.g = 1;
  currentMax.b = 1;

  currentMin.h = 1;
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

      if(hsl.h < 0.90 && hsl.h > 0.1){
        rgba.r = 255;
        rgba.g = 255;
        rgba.b = 255;
      }
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
    var new_location = '/';

    var canvas = Caman(temp_path, function () {
      var currentMin = {};
      var currentMax = {};
      var bhash = {};
      this.findMinMax(currentMin, currentMax);

      this.render(function () {
        console.log(currentMin, currentMax);
        // this.filterByMaxMin(currentMin, currentMax, 50, bhash);

        this.render(function(){
          console.log(bhash);
          var newName = 'filtered.png';
          console.log(__dirname+'/../' + new_location + newName);
          this.save(__dirname+'/../' + new_location + newName);
          console.log('saving');

          // fs.writeFile('rgbcsv.txt', string, function (err) {
          //     if (err) throw err;
          //     console.log('It\'s saved! in same location.');
          // });

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
          
        });ß
      });
    });
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
