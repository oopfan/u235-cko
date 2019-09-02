var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
console.log('PORT=' + port);

app.use(express.static('dist'));

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
