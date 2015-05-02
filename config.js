
var getConfig = function() {
    return {
        MONGO_CREDENTIALS: process.env.MONGO_CREDENTIALS || 'mongodb://localhost/FP'
    };
};

exports.getConfig = getConfig;
