var exec = require('child_process').exec;
var assert = require('assert');
var client = require('../build/index');

const children = [];

// helper functions
function server(cb){

  children.push(exec('npm run micro'));
  cb();
}

process.on('exit', function(){

  children.forEach(function(child){

    child.kill();
  })
})


describe('Client Tests', function(){

  before(server);

  it('should return defintion', function(){

    var definition = {
      "methods": {
        "$definition": {
          "name": "$definition",
          "params": [
            "cb"
          ]
        },
        "fast": {
          "name": "fast",
          "params": [
            "n",
            "callback"
          ]
        },
        "slow": {
          "name": "slow",
          "params": [
            "n",
            "callback"
          ]
        }
      },
      "type": "multi-method"
    };

    var fibonacciClient = client('127.0.0.1');

    assert(fibonacciClient.$definition, definition);
  })

  it('should proxy the methods', function(done){


    var fibonacciClient = client('127.0.0.1');


    fibonacciClient.fast(40, function(err, res){

      assert(res, 102334155);
      done();
    })
  })

  it('should proxy the methods', function(done){


    var fibonacciClient = client('127.0.0.1');


    fibonacciClient.slow(40, function(err, res){

      assert(res, 102334155);
      done();
    })
  })

})