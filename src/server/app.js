var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var environment = process.argv[2];

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./dist/'));
        app.use('/*', express.static('./dist/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/'));
        app.use(express.static('./'));
        app.use('/*', express.static('./src/index.html'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
