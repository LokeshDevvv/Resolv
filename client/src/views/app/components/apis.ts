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

const base64ToFile = (base64: string, filename: string) => {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

export {getIpLocation, stringToBytes32, base64ToFile};