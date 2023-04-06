"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var mqtt = require("mqtt");
var client = mqtt.connect('mqtt://test.mosquitto.org/', { clean: true });
client.on('connect', function () {
    console.log('connected');
    client.subscribe('vm-test-message');
});
client.on('message', function (topic, message) {
    console.log('message', topic, message);
});
var server = http.createServer(function (request, response) {
    console.log(request.url);
    if (request.method === "GET" && request.url.match('/send?message=')) {
        var message = request.url.split('/send?message=')[1];
        client.publish('vm-test-message', message);
        response.setHeader('Content-Type', 'text/plain');
        response.write('changed');
        response.end();
    }
    else {
        response.setHeader('Content-Type', 'text/plain');
        response.write('no changed');
        response.end();
    }
});
console.log('server start listen');
server.listen(3000, function () {
    console.log('server running on 3000 port');
});
