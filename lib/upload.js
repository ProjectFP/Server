var formidable = require('formidable');
var util       = require('util');
var fs         = require('fs-extra');
var tesseract  = require('node-tesseract');
var Caman      = require('caman').Caman;



var string = "";

// customized filter
Caman.Filter.register("threshold", function(adjusted){
  var threshold = 255 * adjusted /100;

  this.process("threshold", function(rgba){
    string += rgba.r+", "+rgba.g+", "+rgba.b+"\n";

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

    Caman(temp_path, function () {
      // this.contrast(80);
      // this.saturation(-60);
      // this.gamma(0.40);
      this.threshold(40);
      // this.filterThreshold(50);
      this.test(40);


      this.render(function () {
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