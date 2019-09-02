module.exports = function(filename)
{
    var fs = require('fs');
    var json = JSON.parse(fs.readFileSync('./src/server/api/' + filename + '.json', 'utf8'));
    return json;
};
