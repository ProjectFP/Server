
var getConfig = function() {
    return {
        MONGO_CREDENTIALS: process.env.MONGO_CREDENTIALS || 'mongodb://localhost/FP',
        SUPER_SECRET: process.env.SUPER_SECRET || 'abcd'
    };
};

exports.getConfig = getConfig;
