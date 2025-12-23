import dgram from 'node:dgram';
import { wrapEthernet } from './ethernet.js';

const client = dgram.createSocket('udp4');

const message = wrapEthernet(Buffer.from('Coucou'))

client.send(message, 41234, '0.0.0.0', (err) => { // '0.0.0.0' -> on envoie à tout le monde
  client.close();
});