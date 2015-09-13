var mongoose = require('mongoose');
var blue = require('bluebird');
mongoose.Promise = blue;

var winningNumber = require('./winningNumber').winningNumber;

var winningPeriodSchema = mongoose.Schema({
    periodName:  {type: String, required: true, index: {unique: true}},
    tickets:     [winningNumber], //order by amount
});

var WinningPeriod = mongoose.model('WinningPeriod', winningPeriodSchema);

WinningPeriod.promFindOne = blue.promisify(WinningPeriod.findOne);

WinningPeriod.checkForWinning = function(period, receipt) {
    var that = this;

    return this.promFindOne({
        periodName: req.body.period,
    }).then(function(winningPeriod){
        var retObj;

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
            
            return {
                code: 400,
                body: 'Error: period already exist'
            };
        } else {
            console.log('adding new winning period');
            return new WinningPeriod({
                periodName: data.periodName,
                tickets: data.tickets
            }).save(function (err, data) {
                console.log('saved');
                if (data){
                    return {
                        code: 200,
                        body: data
                    };
                }
                return {
                    code: 401,
                    body: 'mongo error saving data'
                };
            });
        }
    });
};

exports.WinningPeriod = WinningPeriod;
