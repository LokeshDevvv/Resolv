// const CryptoJS = require("crypto-js");
import CryptoJS from "crypto-js";
async function getIpLocation() {
    const response = await fetch('https://apis.webxspark.com/v2.0/ip/geolocate')
    return await response.json();
}

function stringToBytes32(input) {
    // Convert the string to a UTF-8 encoded word array
    let wordArray = CryptoJS.enc.Utf8.parse(input);

    // Hash the word array to ensure it fits within 32 bytes
    let hash = CryptoJS.SHA256(wordArray);

    // Convert the hash to a hex string (64 characters = 32 bytes)
    let bytes32 = hash.toString(CryptoJS.enc.Hex);

    // Return the final bytes32 value
    return `0x${bytes32}`;
}


export {getIpLocation, stringToBytes32};