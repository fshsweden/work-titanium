/*
 * REQUIRE this module to keep global variables!!!
 */

var _globals = {};

var setKey = function(key, value)
{
    _globals[key] = value;
}

var getKey = function(key)
{
    return _globals[key];
}

exports.set = setKey;
exports.get = getKey;
