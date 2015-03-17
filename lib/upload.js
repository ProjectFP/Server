var formidable = require('formidable');
var util       = require('util');
var fs         = require('fs-extra');
var tesseract  = require('node-tesseract');
var Caman      = require('caman').Caman;
var _          = require('lodash');



var string = "";
Caman.Filter.register("writeRGB", function(){
  this.process("writeRGB", function(rgba){
    string += rgba.r+", "+rgba.g+", "+rgba.b+"\n";

    var temp = Caman.Convert.rgbToHSL(rgba);

    return rgba;
  });
});

// customized filter
Caman.Filter.register("findMinMax", function(currentMin, currentMax){
  currentMin.r = 255;
  currentMin.g = 255;
  currentMin.b = 255;
  currentMax.r = 1;
  currentMax.g = 1;
  currentMax.b = 1;
  this.process("findMinMax", function(rgba){
    _.each(rgba, function(value,key){
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

Caman.Filter.register("filterByMaxMin", function(currentMin, currentMax, percent){
  var threshold = {};
  var factor = percent / 100;
  _.each(currentMin, function(value, key){
    threshold[key] = (currentMax[key] - currentMin[key])*factor;
  });
  this.process("filterByDarkest", function(rgba){
    if (rgba.r > currentMin.r + threshold.r || 
        rgba.g > currentMin.g + threshold.g || 
        rgba.b > currentMin.b + threshold.b){
      rgba.r = 240;
      rgba.g = 240;
      rgba.b = 240;
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
      this.findMinMax(currentMin, currentMax);
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
        this.filterByMaxMin(currentMin, currentMax, 40);

        this.render(function(){
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