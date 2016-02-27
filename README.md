[![Build Status](https://travis-ci.org/micro-node/client.svg)](http://travis-ci.org/micro-node/client)
[![Dependency Status](https://david-dm.org/micro-node/client.svg)](https://david-dm.org/micro-node/client)
[![devDependency Status](https://david-dm.org/micro-node/client/dev-status.svg)](https://david-dm.org/micro-node/client#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/github/micro-node/client/badge.svg?branch=master)](https://coveralls.io/github/micro-node/client?branch=master)
# AMQP RPC Client

This is an implementation of an AMQP RPC client using JSON-RPC 2.0.
This client connects to AMQP Servers preferably launched with [micro-node-launcher](https://github.com/micro-node/launcher).

## Usage

```
var client = require('micro-node-client')('127.0.0.1', 'rpc_queue')
```

With this code snippet the client will connect to a server listening on '127.0.0.1' using the queue named `rpc_queue`.
The client will imitate the server service as much as possible. That means if the server was created with an module of this shape
```

module.exports = {
    
    foo: function(cb){...}
       
    value: 'value',
    
    deep: {
    
        bar: function(cb){...}
    
    }
}

```

the client will have exactly the same shape with the only difference that the method are now remotely executed wich is totally invisible to the user. 

```
client.deep.bar(function(err, result){

    console.log(result);
}};
```

In addition to that static values are directly accessible without the need of a request.

```
assert(client.value, 'value'); // this is true
```

## How it works

Upon initialisation the client will trigger a single sync request to the server for the internal method `rpc.definition` to get the shape and definition on the service. This information is then used to create this intelligent client.

## Requirements

- NodeJS
- RabbitMQ

## License

MIT © [Haithem Bel Haj](https://github.com/haithembelhaj)