import deasync from 'deasync';
import uuid from 'node-uuid';
import * as amqp from 'micro-node-amqp';
import * as rpc from 'micro-node-json-rpc';

/**
 * a cache of all the clients
 * @type {null}
 */
const clients = Object.create(null);

// magic timeout number
const timeout = 7777;

/**
 * The Client class
 * Genrates a client that has the same shape as the remote service
 */
class Client {

  /**
   * constructor needs the rabbitmq address and queue
   * @param addr
   * @param queue
   */
  constructor(addr, queue){

    this.$client =  amqp.client(addr, queue);
    this.$syncClient = deasync(this.$client);

    this.$definition = this.$syncClient(request(rpc.DEFINITIONMETHOD), {timeout});

    extend(this);
  }
}


/**
 * export a syngleton instance of the client
 * @param addr
 * @param queue
 * @returns {*}
 */
module.exports = function(addr, queue){

  const hash = generateHash(addr, queue);

  clients[hash] = clients[hash] || new Client(addr, queue);

  return clients[hash];
};

/**
 * extend some root object with definition
 * @param root
 * @returns {*}
 */
function extend(root){

  let client = root.$client;
  let def = root.$definition;

  return Object.assign(root, mapDefinition(def, []));

  function mapDefinition(d, paths){

    // leaves are easy
    if(d.type === rpc.VALUETYPE)
      return d.value;

    if(d.type === rpc.FUNCTIONTYPE)
      return rpcClient(client, paths.join('.'));

    // children are recursive
    let children = Object.create(null);

    Object.keys(d).forEach((k) => children[k] = mapDefinition(d[k], paths.concat(k)));

    return children;
  }

}

/**
 * helper to generate hash
 * @param addr
 * @param queue
 * @returns {*}
 */
function generateHash(addr, queue){

  return `${addr}/${queue}`;
}

/**
 * helper rpc client
 * @param client
 * @param method
 * @returns {Function}
 */
function rpcClient(client, method){

  return function(...args){

    let cb = args.pop();

    if(cb === undefined)
      throw new Error('the callback is missing');

    return client(request(method, args), cb);
  };
}

/**
 * helper to generate a request
 *
 * @param method
 * @param params
 * @returns {{jsonrpc: *, method: *, params: Array, id: *}}
 */
function request(method, params = []){

  return {jsonrpc: rpc.JSONRPCVERSION, method, params, id: uuid.v4()};
}



