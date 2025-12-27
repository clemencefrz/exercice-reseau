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
const SFDOctet = 0b10101011

export const broadcastAddress = Buffer.from([0xff, 0xff, 0xff, 0xff, 0xff, 0xff])

/**
 * @typedef {Buffer} MACAddress
 */

/**
 * @param {any} x
 * @returns {x is MACAddress}
 */
function estMACAdress(x) {
    if (!Buffer.isBuffer(x)) {
        console.log(`pas un buffer`)
        return false
    }
    if (x.length !== MACAddressSize) {
        console.log(`pas la bonne taille: ${x.length}`)
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
 * @param {MACAddress} sourceAddress
 * @returns {Buffer}
 */
export function wrapEthernet(macClientData, destinationAddress, sourceAddress) {
    const messageEthernetDataFrame = Buffer.alloc(messageEthernetDataFrameSize)

    // Préambule
    for (let i=0; i < preambleSize; i++) {
        messageEthernetDataFrame[i] = preambleOctet;
    }

    // SFD
    messageEthernetDataFrame[preambleSize] = SFDOctet

    // Destination address
    if (!estMACAdress(destinationAddress)) {
        throw new Error(`Le format de l'adresse de destination est incorrect : ${destinationAddress}`)
    }
    destinationAddress.copy(messageEthernetDataFrame, preambleSize + SFDSize)
    // Source address
    if (!estMACAdress(sourceAddress)) {
        throw new Error(`Le format de l'adresse source est incorrect : ${sourceAddress}`)
    }
    sourceAddress.copy(messageEthernetDataFrame, preambleSize + SFDSize + MACAddressSize)

    

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
    }
    
    if (messageEthernetDataFrame[preambleSize] !== SFDOctet) {
        throw new Error(`L'octet du SFD n'a pas la bonne valeur.`)
    }

    const destinationAddressReceived = messageEthernetDataFrame.subarray(preambleSize+SFDSize, preambleSize+SFDSize+MACAddressSize)

    const sourceAddressReceived = messageEthernetDataFrame.subarray(preambleSize+SFDSize+MACAddressSize, preambleSize+SFDSize+2*MACAddressSize)

    console.log("destinationAddressReceived", destinationAddressReceived)

    console.log("sourceAddressReceived", sourceAddressReceived)

    return messageEthernetDataFrame
    }
