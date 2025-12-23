import dgram from 'node:dgram';
import { Buffer } from 'node:buffer';


const preambleSize = 7 // Pour savoir qu'il s'agit d'un message éthernet
const SFDSize = 1
const destinationAddressSize = 6
const sourceAddressSize = 6
const lengthTypeSize = 2
const macClientDataSize = 1500 // Vraie donnée qu'on veut envoyer
// const padSize = ??
const frameCheckSequenceSize = 4
const messageEthernetDataFrameSize = preambleSize + SFDSize + destinationAddressSize + sourceAddressSize + lengthTypeSize + macClientDataSize + frameCheckSequenceSize


const preambleOctet = 0b10101010  // cf page 75

// Créer le message à envoyer
// https://www.my-wire.de/schnittstellenbeschreibung/ethernet.pdf page 107 du pdf

/**
 * Envoie le message encapsulé dans une frame éthernet
 * @param {Buffer} macClientData
 * @returns {Buffer}
 */
export function wrapEthernet(macClientData) {
    const messageEthernetDataFrame = Buffer.alloc(messageEthernetDataFrameSize)
    for (let i=0; i < preambleSize; i++) {
        messageEthernetDataFrame[i] = preambleOctet;
    }
    return messageEthernetDataFrame
}

/**
 * 
 * @param {Buffer} messageEthernetDataFrame
 * @returns {Buffer}
 */
export function unwrapEthernet(messageEthernetDataFrame) {
    for (let i=0; i < preambleSize; i++) {
    if (messageEthernetDataFrame[i] != preambleOctet) {
        throw new Error(`L'octet n°${i} du préambule n'a pas la bonne valeur.`)
    }
    return messageEthernetDataFrame
  }
}