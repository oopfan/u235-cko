var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var environment = process.argv[2];

var datasource = process.argv[3];   // 'db', 'json'
var filename = process.argv[4];     // json filename (eg 'db-mock')
var connection, view_g2v;

switch (datasource) {
    case 'json':
        connection = require('./api/json-connection')(filename);
        view_g2v = require('./api/json-g2v')(connection);
        break;
    default:
        console.log('Datasource not supported: ' + datasource);
        break;
}

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

var appRouter = express.Router();
app.use('/', appRouter);

var api_g2v = require('./api/api-g2v')(express, view_g2v);
app.use('/api/g2v', api_g2v);

app.use(function (req, res, next) {
    res.status(404).send("Sorry can't find that!");
});

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
});
