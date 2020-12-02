'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');

var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var runner            = require('./test-runner');

var app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

let error;
app.get('/_api/get-tests', cors(), function(req, res, next){
  if(error || process.env.SKIP_TESTS) 
    return res.json({status: 'unavailable'});
  next();
},
function(req, res, next){
  if(!runner.report) return next();
  res.json(testFilter(runner.report, req.query.type, req.query.n));
},
function(req, res){
  runner.on('done', function(report){
    process.nextTick(() =>  res.json(testFilter(runner.report, req.query.type, req.query.n)));
  });
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(!process.env.SKIP_TESTS) {
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 1500);
  }
});

module.exports = app; //for testing

function testFilter(tests, type, n) {
  var out;
  switch (type) {
    case 'unit' :
      out = tests.filter(t => t.context.match('Unit Tests'));
      break;
    case 'functional':
      out = tests.filter(t => t.context.match('Functional Tests') && !t.title.match('#example'));
      break;
    default:
      out = tests;
  }
  if(n !== undefined) {
    return out[n] || out;
  }
  return out;
}
