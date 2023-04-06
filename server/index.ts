import * as http from 'http';
import * as mqtt from 'mqtt';
import {IncomingMessage, ServerResponse} from "http";

const client = mqtt.connect('mqtt://test.mosquitto.org/', { clean: true });

client.on('connect', () => {
    console.log('MQTT Connected');

    client.subscribe('vm-test-message');
})

client.on('message', (subscribeName, message) => {
    console.log('message', subscribeName, message.toString());
})


const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {

    if (request.method === "GET" && request.url.match('/send')) {

        const params: string = request.url.split('?')[1];
        const getParams: string[] = params.split('&');
        const messageParam: string = getParams.filter((param) => param.match('message='))[0];
        const message = messageParam.split('=')[1];

        client.publish('vm-test-message', message);

        response.setHeader('Content-Type', 'text/plain');
        response.write('changed');
        response.end();

    } else {
        response.setHeader('Content-Type', 'text/plain');
        response.write('no changed');
        response.end();
    }
});

server.listen(3000, () => {
    console.log('Server running on 3000 port');
})
