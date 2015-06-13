var formidable  = require('formidable');
var util        = require('util');
var fs          = require('fs-extra');
var filterModel = require('../models/filterModel');
var tesseract   = require('node-tesseract');
var Caman       = require('caman').Caman;


function UploadHandler(){
    // for initialize and testing
}

UploadHandler.prototype.filterImage = function(req, res){

    var form = new formidable.IncomingForm();
  
    form.parse(req, function(err, fields, files) {
        if (err){
            res.writeHead(500, {'content-type': 'text/plain'});
            res.write('upload error');
            res.end(util.inspect({fields: fields, files: files}));
        }
    });

    form.on('end', function(fields, files) {
        console.log('uploaded image');
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;

        filterModel.camanFilter(temp_path, function () {
            var currentMin = {};
            var currentMax = {};
            var bhash = {};

            this.findMinMax(currentMin, currentMax);

            this.render(function () {
                console.log(currentMin, currentMax);
                this.filterByMaxMin(currentMin, currentMax, 50, bhash);

                this.render(function(){
                    var newName = 'filtered.png';
                    console.log(__dirname+'/../../' + newName);
                    this.save(__dirname+'/../../' + newName);
                    console.log('saving');
                    // Caman js doesn't support asynch save needs use fs write and
                    // canvas.toBuffer() to support callback
                    fs.writeFile(temp_path, this.canvas.toBuffer(), function(err){
                        console.log('fs callback');
                        tesseract.process(temp_path,function(err, text) {
                            if(err) {
                                console.error(err);
                                // 500
                                return res.send(500, err);
                            } else {
                                console.log("success!");
                                console.log(text);
                                return res.send(200,{value: text.trim()});
                            }
                        });
                    }); 
                });
            });
        });
    });
};

exports.UploadHandler = UploadHandler;


