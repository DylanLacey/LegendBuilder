import {IncomingMessage, ServerResponse} from 'http';
var url = require('url');
var Lru = require('lru-cache');

import {Server, getPathname, HostResponse} from './server';

import {settings} from '../../config/settings';

let server = new Server(settings.staticServer.host, settings.staticServer.port);

let baseUrl = server.config.protocol + 'global' + server.config.hostname + '/api/lol';

server.run((request: IncomingMessage, response: ServerResponse) => {
  let pathname = getPathname(request.url);
  server.sendRequest(baseUrl + request.url, pathname[2], (res: HostResponse) => {
    response.writeHead(res.status, server.headers);
    if (res.success) {
      response.write(res.data);
      server.setCache(request.url, res.data);
    } else {
      response.write(res.data + '\n');
    }
    response.end();
  });
});
