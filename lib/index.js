import deasync from 'deasync';
import uuid from 'node-uuid';
import * as amqp from 'micro-node-amqp';

const JSONRPC = '2.0';
const clients = Object.create(null);

class Client {

  constructor(addr){

    this.$client =  amqp.client(addr);
    this.$syncClient = deasync(this.$client);

    this.$definition = this.$syncClient(request('$definition'));

    Object.keys(this.$definition.methods).forEach((method)=> {

      if(method !== '$definition'){

        this[method] = rpc(this.$client, method);
      }
    });
  }
}

// export a syngleton instance of the client
module.exports = function(addr){

  clients[addr] = clients[addr] || new Client(addr);

  return clients[addr];
};


// hlper rpc client
function rpc(client, method){

  return function(...args){

    let cb = args.pop();

    return client(request(method, args), cb);
  };
}

// request builder helper
function request(method, params = []){

  return {jsonrpc: JSONRPC, method, params,id: uuid.v4()};
}



