'use strict';

var values     = require('./values.js');
var promise    = require('bluebird');
var fs         = require('fs');
var tesseract  = require('node-tesseract');
var Caman      = require('caman').Caman;
var _          = require('lodash');
var path       = require('path');


var fsReaddir = promise.promisify(fs.readdir);
var fsWriteFile = promise.promisify(fs.writeFile);
var tesseractProcess = promise.promisify(tesseract.process);

runTests();

function runTests(){

  var results = {},
      basePath = path.resolve(__dirname, './../images/lotto'),
      testsToRun;

  testsToRun = [
    { 
      testName: 'percent50',
      percent: 50
    }
    // ,
    // {
    //   testName: 'percent10',
    //   percent: 10
    // }
  ];

  fsReaddir(basePath)
  .then(function(files){
    var promArray;
    promArray = _.map(_.filter(files, filterImgFiles), processFiles);

    return promise.all(promArray);
  })
  .then(function(){
    addCorrectValues();
    console.log('Results: ', JSON.stringify(results, null, 4));
  });

  //Helper Functions

  function processFiles(fileName){
    console.log('Starting - No Filter');
    return runTesseract(basePath+'/'+fileName, fileName)
    .then(function(){

      var promArray;
  
      promArray = _.map(testsToRun, function(testParams){
        console.log('Starting - ', testParams.testName, fileName);
        return runCamanFilter(basePath+'/'+fileName, fileName, testParams);
      });

      return promise.all(promArray);
    });
  }

  function runTesseract(filePath, fileName, filterName){

    filterName = filterName || 'original';

    return tesseractProcess(filePath)
      .then(function(text){
        recordResults(fileName, filterName, text);
        return text;
      });
  }

  function recordResults(fileName, filterName, text){
    var numberRegex,
        numbersMatched,
        result;

    numberRegex = /[0-9]/g;
    numbersMatched = text.match(numberRegex);

    if (numbersMatched && numbersMatched.length > 0){
      result = numbersMatched.join('');
    } else {
      result = '';
    }

    if (results[fileName] === undefined){
      results[fileName] = {};
    }
    results[fileName][filterName] = result;
  }

  function filterImgFiles(fileName){
    var parsed,
        suffix;

    parsed = fileName.split('.');
    if (parsed.length !== 2){
      return false;
    } else {
      suffix = parsed[1];
    }

    return (suffix === 'jpg' || suffix === 'png' || suffix === 'bmp');
  }

  function runCamanFilter(filePath, fileName, testParams) {
    var filteredImgPath,
        filteredImgFolderPath,
        percent;

    filteredImgFolderPath = basePath + '/' + testParams.testName;
    filteredImgPath = filteredImgFolderPath + '/' + fileName;

    percent = testParams.percent || 50;

    return makeFolder(filteredImgFolderPath)
      .then(function(){
        return new promise(promiseCallback);
      });

    function promiseCallback(resolve, reject){
      
      Caman(filePath, function(){

        var currentMin = {};
        var currentMax = {};
        var bhash = {};
        this.findMinMax(currentMin, currentMax, true, true);

        this.render(function(){
          this.filterByMaxMin(currentMin, currentMax, percent, bhash);
          this.render(function(){
            fsWriteFile(filteredImgPath, this.canvas.toBuffer())
            .then(function(){
               resolve(runTesseract(filteredImgPath, fileName, testParams.testName));
            });
          });
        });
      });
    }

    function makeFolder(folderPath){

      return new promise(function(resolve, reject){
        fs.exists(folderPath, function(exists){
          if (exists){
            resolve();
          } else {
            fs.mkdir(folderPath, function(){
              resolve();
            });
          }
        });
      });
    }
  }

  function addCorrectValues(){
    _.each(results, function(item, index){
      results[index].correct = values.values[index];
    });
  }

}