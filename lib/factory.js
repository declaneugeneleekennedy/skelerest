
var models = {};

module.exports.get = function(name) {
    if(models[name]) {
        return new models[name];
    }

    throw 'Unknown model: ' + name;
};

module.exports.exists = function(name) {
    return !(typeof models[name] === 'undefined');
};
