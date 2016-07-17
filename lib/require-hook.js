const path = require('path');
const Module = require('module');
const pkgUp = require('pkg-up');
const client = require('./');

// save a ref to the original loader
const originalLoader = Module._load;

// load micro-node config from packag.json
const pkgPath = pkgUp.sync(path.dirname(module.parent.filename));
const pkg = require(pkgPath);
const config = pkg['micro-node'];

console.log(config);

// mokey path module loading
Module._load = (request, parent, isMain) => {

  if(!config || !config.services || !config.services[request])
    return originalLoader(request, parent, isMain);

  return client(config.services[request], request);
};