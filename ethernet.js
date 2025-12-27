import { Buffer } from 'node:buffer';

// Ressource très utile (IEEE Standard for Ethernet) : https://www.my-wire.de/schnittstellenbeschreibung/ethernet.pdf


const preambleSize = 7 // Pour savoir qu'il s'agit d'un message éthernet
const SFDSize = 1
const MACAddressSize = 6
const sourceAddressSize = 6
const lengthTypeSize = 2
const macClientDataSize = 1500 // Vraie donnée qu'on veut envoyer
// const padSize = ??
const frameCheckSequenceSize = 4
const messageEthernetDataFrameSize = preambleSize + SFDSize + MACAddressSize + sourceAddressSize + lengthTypeSize + macClientDataSize + frameCheckSequenceSize


const preambleOctet = 0b10101010  // cf page 129 du PDF


/**
 * @typedef {Buffer} MACAddress
 */

/**
 * @param {any} x
 * @returns {x is MACAddress}
 */
function estMACAdress(x) {
    if (!Buffer.isBuffer(x)) {
        return false
    }
    if (x.size !== MACAddressSize) {
        return false
    }
    return true;
}

// Créer le message à envoyer
// page 107 du pdf
/**
 * Envoie le message encapsulé dans une frame éthernet
 * @param {Buffer} macClientData
 * @param {MACAddress} destinationAddress // doit faire 6 octets p109
 * @returns {Buffer}
 */
export function wrapEthernet(macClientData, destinationAddress) {
    const messageEthernetDataFrame = Buffer.alloc(messageEthernetDataFrameSize)

    // Préambule
    for (let i=0; i < preambleSize; i++) {
        messageEthernetDataFrame[i] = preambleOctet;
    }

    // SFD
    messageEthernetDataFrame[preambleSize] = 0b10101011

    // Destination address
    if (!estMACAdress(destinationAddress)) {
        throw new Error(`Le format de l'adresse de destination est incorrect : ${destinationAddress}`)
    }
    destinationAddress.copy(messageEthernetDataFrame, preambleSize + SFDSize)

    
    

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