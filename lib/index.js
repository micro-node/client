import deasync from 'deasync';
import uuid from 'node-uuid';
import * as amqp from 'micro-node-amqp';

const JSONRPC = '2.0';
const clients = Object.create(null);

class Client {

  constructor(addr, queue){

    this.$client =  amqp.client(addr, queue);
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
module.exports = function(addr, queue){

  const hash = generateHash(addr, queue);

  clients[hash] = clients[hash] || new Client(addr, queue);

  return clients[hash];
};


// helper to generate hash
function generateHash(addr, queue){

  return `${addr}/${queue}`;
}

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



