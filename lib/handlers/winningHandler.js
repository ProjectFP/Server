var mongoose       = require('mongoose');
var blue           = require('bluebird');
var _              = require('lodash');

var WinningPeriod  = require('../persistence/mongo/winningPeriod').WinningPeriod;
var User           = require('../persistence/mongo/user').User;


function WinningHandler(){
    //link to Mongo
}

WinningHandler.prototype.parseAndAddPeriod = function(req, res) {
    console.log('in parse and add');

    var data = _parseWinningDataV1(req);
    WinningPeriod.addWinningPeriod(data)
    .then(function(status){    
        res.send(status.code, status.body);
    })
    .done();
};

WinningHandler.prototype.processPeriodWinnings = function(req, res) {
    if (req.body && req.body.period) {
        console.log('start process period winnings')
        WinningPeriod.promFindOne({
            periodName: req.body.period
        }).then(function(winningModel){
            if(winningModel){
                console.log('found winning model: ' + JSON.stringify(winningModel));
                return User.searchAllUsers(winningModel);
            } else {
                return new blue (function(resolve, reject){
                    console.log('reject promise');
                    reject('Model does not exist for this period:' + req.body.period);
                });
            }
        }).then(function(status) {
            res.send(status.code, status.body);
        }).catch (function(err){
            res.send(400, err);
        });
    }
};

var _parseWinningDataV1 = function(req){
    // This function should be updated base on chnages to payour format
    // Expect format:{
    //      Period: YYYY-MM-MM
    //      SpeicalPrize: 12345678
    //      GrandPrize: 123456
    //      RegularPrize: [x, y, z]
    //      SixthPrize: [a, b, c]
    //      Prize Amount: [1,2,3,4,5,6,7]
    // }

    var tickets = [
    {
        prizeName: "Speical Prize",
        amount: 10000000,
        digits: 8
    },
    {
        prizeName: "Grand Prize",
        amount: 2000000,
        digits: 8
    },
    {
        prizeName: "Regular Prize",
        amount: 200000,
        digits: 8
    },
    {
        prizeName: "2nd Prize",
        amount: 40000,
        digits: 7        
    },
    {
        prizeName: "3rd Prize",
        amount: 10000,
        digits: 6        
    },
    {
        prizeName: "4th Prize",
        amount: 4000,
        digits: 5        
    },
    {
        prizeName: "5th Prize",
        amount: 1000,
        digits: 4        
    },
    {
        prizeName: "6th Prize",
        amount: 200,
        digits: 3        
    }];

    for (var i=0; i< tickets.length; i++){
        var numbers;
        if (i === 0){
            numbers = [req.body.speicalPrize];
        } else if (i ===1){
            numbers = [req.body.grandPrize];
        } else {
            numbers = _.map(req.body.regularPrize, function(val) {
                return val.slice(-1*tickets[i].digits);
            });
            if (i === tickets.length -1 ){
                numbers = numbers.concat(req.body.sixthPrize);
            }

        }
        tickets[i].numbers = numbers;
    }

    return {
        periodName: req.body.period,
        tickets: tickets
    };

};

// WinningHandler.prototype.parseAndAddPeriod = function(req, res) {
//     console.log('in parse and add');

//     var data = _parseWinningDataV1(req);

//     console.log('parsed data:' + JSON.stringify(data));
//     WinningPeriod.promFindOne({
//         periodName: data.periodName
//     }).then(function(model){
//         if (model){
//             console.log('found model');
//             console.log(model);
            
//             res.send(400,{ 
//                 message: 'Error: period already exist'
//             });
//         } else {
//             console.log('adding new winning period');
//             return new WinningPeriod({
//                 periodName: data.periodName,
//                 tickets: data.tickets
//             }).save(function (err, data) {
//                 console.log('saved');
//                 if (data){
//                     res.send(
//                         200,
//                         data
//                     );
//                 }else {

//                     res.send(500,{ 
//                         message: 'Error: mongo error saving data'
//                     });
//                 }
//             });
//         }
//     })
//     .done();
// };

exports.WinningHandler = WinningHandler;

