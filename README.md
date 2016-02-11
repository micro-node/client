[![Build Status](https://travis-ci.org/micro-node/client.svg)](http://travis-ci.org/micro-node/client)
# AMQP RPC Client

This is a slim implementation of RPC client AMQP and JSON-RPC 2.0.
This client connects to AMQP Servers launched with [micro-node-launcher](https://github.com/micro-node/launcher).
The queue parameter is really important. 

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

