var exec = require('child_process').exec;
var assert = require('assert');
var client = require('../build/index');
var rpc = require('micro-node-json-rpc');

const children = [];

// helper functions
function server(cb){

  children.push(exec('npm run micro'));
  setTimeout(cb, 3000);
}

process.on('exit', function(){

  children.forEach(function(child){

    child.kill();
  })
})


describe('Client Tests', function(){
  
  this.timeout(10000);

  before(server);

  it('should return defintion', function(){

    var fibonacciClient = client('127.0.0.1', 'fib');

    assert(fibonacciClient.$definition.fast.type, rpc.FUNCTIONTYPE);
    assert(fibonacciClient.$definition.deep.slow.type, rpc.FUNCTIONTYPE);
    assert(fibonacciClient.$definition.deep.pi.type, rpc.VALUETYPE);
  })

  it('should proxy the methods', function(done){


    var fibonacciClient = client('127.0.0.1', 'fib');


    fibonacciClient.fast(40, function(err, res){

      assert(res, 102334155);
      done();
    })
  })

  it('should proxy deep methods', function(done){


    var fibonacciClient = client('127.0.0.1', 'fib');


    fibonacciClient.deep.slow(40, function(err, res){

      assert(res, 102334155);
      done();
    })
  })


  it('should deep constant values', function(done){


    var fibonacciClient = client('127.0.0.1', 'fib');

    assert(fibonacciClient.deep.pi, Math.PI);
    done();
  })

})
