import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';

const message = Buffer.from('Some bytes');
const client = dgram.createSocket('udp4');
client.send(message, 41234, '0.0.0.0', (err) => { // '0.0.0.0' -> on envoie à tout le monde
  client.close();
});