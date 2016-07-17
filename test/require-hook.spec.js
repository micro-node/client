var exec = require('child_process').exec;
var assert = require('assert');

require('../build/require-hook');

const children = [];

// helper functions
function server(cb){

  children.push(exec('npm run micro'));
  setTimeout(cb, 3000);
}

function killAll(){

  children.forEach((child) => child.kill())
}

process.on('exit', killAll);


describe('require hook tests', function(){

  this.timeout(10000);

  before(server);

  it('should hook to require', (done)=>{

    const fib = require('fib');

    assert(fib.fast);
    assert(fib.deep.slow);
    assert(fib.deep.pi, Math.PI);

    fib.fast(40, function(err, res){

      assert(res, 102334155);
      done();
    })
  })
})
