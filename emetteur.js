import dgram from 'node:dgram';
import { wrapEthernet, broadcastAddress } from './ethernet.js';
import os from 'node:os'

const client = dgram.createSocket('udp4');

// Adresse mac de ma machine
const addressSource = os.networkInterfaces()['en0'][0].mac

const bufferParsedAddressSource = Buffer.from(addressSource.split(':').map((hexaString) => parseInt(hexaString, 16)))

const bufferMessagePourEnvoi = Buffer.from('Coucou')
const lengthTypeField = Buffer.from([0x05,0xdc]) // représentation hexa de 1500

const message = wrapEthernet(bufferMessagePourEnvoi, broadcastAddress, bufferParsedAddressSource, lengthTypeField)
console.log("Voilà ce qu'on a envoyé (message) : ", message)
client.send(message, 41234, '0.0.0.0', (err) => { // '0.0.0.0' -> on envoie à tout le monde
  client.close();
});