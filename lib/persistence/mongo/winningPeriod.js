var mongoose = require('mongoose');
var blue = require('bluebird');
var _              = require('lodash');

var winningNumber = require('./winningNumber').winningNumber;

var winningPeriodSchema = mongoose.Schema({
    periodName:  {type: String, required: true, index: {unique: true}},
    tickets:     [winningNumber], //order by amount
});

var WinningPeriod = mongoose.model('WinningPeriod', winningPeriodSchema);

WinningPeriod.promFindOne = blue.promisify(WinningPeriod.findOne);

WinningPeriod.checkForWinningReceipt = function(period, receipt) {
    var that = this;

    return this.promFindOne({
        periodName: period,
    }).then(function(winningPeriod){
        var retObj;
        console.log('winning period found');

        if (winningPeriod && winningPeriod.tickets){
            for (var i=0; i< winningPeriod.tickets.length; i++){
                if (!retObj){                
                    var digits = winningPeriod.tickets[i].digits;
                    var userNumber = receipt.slice(-1*digits);
                    var winningNumber = receipt.slice(-1*digits);
                     if (_.contains(winningPeriod.tickets[i].numbers, userNumber)){
                        retObj = {
                            _id: winningPeriod.tickets[i]._id,
                            prizeName: winningPeriod.tickets[i].prizeName,
                            amount: winningPeriod.tickets[i].amount
                        };
                     }
                }
            }
        }
            
        return new blue (function(resolve, reject){
            console.log('return resolved winning obj:' + JSON.stringify(retObj));
            resolve(retObj);
        });
    });
};

WinningPeriod.addWinningPeriod = function(data) {

    return this.promFindOne({
        periodName: data.periodName
    }).then(function(model){

        if (model){
            console.log('found model');
            console.log(model);
            
            return new blue (function(resolve, reject){
                console.log('reject promise');
                reject('Model already exist for this period:' + data.periodName);
            });
        } else {
            console.log('adding new winning period');
            return new WinningPeriod({
                periodName: data.periodName,
                tickets: data.tickets
            }).save();
        }
    }).then(function(model){
        return {
            code:200,
            body: model
        };
    }).catch(function(err) {
        // might have to split up 400 error and 500 error
        return {
            code: 400,
            body: err
        };
    });
};

exports.WinningPeriod = WinningPeriod;
