import dgram from 'node:dgram';
import { unwrapEthernet } from './ethernet.js';

const server = dgram.createSocket('udp4');

const adresseMACRécepteur = '9e:56:2b:42:ae:24'
const bufferAdresseMACRécepteur = Buffer.from(adresseMACRécepteur.split(':').map((hexaString) => parseInt(hexaString, 16)))
console.log("L'adresse MAC du récepteur est ", bufferAdresseMACRécepteur)
server.on('error', (err) => {
  console.error(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  console.log(`server got:`, unwrapEthernet(msg, bufferAdresseMACRécepteur));
});

server.on('listening', () => {
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234); 
// écoute que sur le port 41234