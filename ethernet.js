import { Buffer } from 'node:buffer';

// Ressource très utile (IEEE Standard for Ethernet) : https://www.my-wire.de/schnittstellenbeschreibung/ethernet.pdf

const preambleSize = 7 // Pour savoir qu'il s'agit d'un message éthernet
const SFDSize = 1
const MACAddressSize = 6
const lengthTypeSize = 2
// const macClientDataSize = 1500 // Vraie donnée qu'on veut envoyer
// const padSize = ??
const frameCheckSequenceSize = 4


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
    const lengthTypeField = Buffer.alloc(lengthTypeSize)
    lengthTypeField.writeInt16BE(macClientData.length)

    const messageEthernetDataFrame = Buffer.alloc(preambleSize + SFDSize + MACAddressSize + MACAddressSize + macClientData.length + frameCheckSequenceSize)

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

    // Length/Type field
    if (lengthTypeField.length !==2) {
        throw new Error("La valeur Length/Type Field n'a pas la bonne taille : ", lengthTypeField.length)
    }
    lengthTypeField.copy(messageEthernetDataFrame, preambleSize + SFDSize + 2*MACAddressSize)

    return messageEthernetDataFrame
}

/**
 * 
 * @param {Buffer} messageEthernetDataFrame
 * @param {Buffer} myMACAddress
 * @returns {Buffer}
 */
export function unwrapEthernet(messageEthernetDataFrame, myMACAddress) {
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

    if (!estMACAdress(myMACAddress)) {
        throw new Error("Votre MAC adresse n'a pas le bon format.", myMACAddress)
    }

    console.log("destinationAddressReceived", destinationAddressReceived)
    if (myMACAddress.compare(destinationAddressReceived) !== 0 && broadcastAddress.compare(destinationAddressReceived) !==0) {
        throw new Error("Ce message ne vous est pas adressé. On l'ignore.")
    }

    console.log("sourceAddressReceived", sourceAddressReceived)

    const lengthTypeFieldReceived = messageEthernetDataFrame.subarray(preambleSize+SFDSize+2*MACAddressSize, preambleSize+SFDSize+2*MACAddressSize+lengthTypeSize)


    console.log("lengthTypeFieldReceived", lengthTypeFieldReceived)
    const numberLengthTypeFieldReceived = lengthTypeFieldReceived.readInt16BE()
    if (numberLengthTypeFieldReceived>1500 && numberLengthTypeFieldReceived<1536 ) {
        throw new RangeError("Le Length/Type Field reçu ne peut pas être interprété.", numberLengthTypeFieldReceived)
    }

    if (numberLengthTypeFieldReceived>=1536) {
        throw new Error("Type Interpretation not implemented.")
    }

    //TODO : récupérer le macclientdata grâce au nombre d'octet de lgength

    return messageEthernetDataFrame
    }
