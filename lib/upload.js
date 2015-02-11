var formidable = require('formidable');
var util       = require('util');
var fs         = require('fs-extra');
var tesseract  = require('node-tesseract');
var Caman      = require('caman').Caman;


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
      this.exposure(15);
      this.vibrance(20);
      this.contrast(99);
      this.saturation(-99);
      this.gamma(0.50);
      this.render(function () {
        var newName = 'filtered.png';
        console.log(__dirname+'/../' + new_location + newName);
        this.save(__dirname+'/../' + new_location + newName);
        console.log('saved');

        tesseract.process(temp_path,function(err, text) {
          if(err) {
            console.error(err);
          } else {
            console.log("success!");
            console.log(text);
          }
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