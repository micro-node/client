[![Build Status](https://travis-ci.org/micro-node/client.svg)](http://travis-ci.org/micro-node/client)
# AMQP RPC Client

This is an implementation of an AMQP RPC client using JSON-RPC 2.0.
This client connects to AMQP Servers launched with [micro-node-launcher](https://github.com/micro-node/launcher).
The queue parameter is important and must be unique.

The Client will imitate the server service as much as possible. That means if the server was created with an module of this shape
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

## Requirements

- NodeJS
- RabbitMQ

## Usage

```

var client = require('micro-node-client')('127.0.0.1', 'ampq_queue')

// the amqp server exports the doStuff method 
client.doStuff(function(err, result){

    console.log(result);
}};

```

