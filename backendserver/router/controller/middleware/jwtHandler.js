function encodeToken(str) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let padding = '';

  for (let i = 0; i < str.length; i += 3) {
      let triple = (str.charCodeAt(i) << 16) | (str.charCodeAt(i + 1) << 8) | str.charCodeAt(i + 2);
      result += chars[(triple >> 18) & 0x3F];
      result += chars[(triple >> 12) & 0x3F];
      result += i + 1 < str.length ? chars[(triple >> 6) & 0x3F] : '=';
      result += i + 2 < str.length ? chars[triple & 0x3F] : '=';
  }

  return result;
}

function reverseTokenToKey(base64) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let result = '';
  let buffer = 0;
  let bits = 0;

  for (let i = 0; i < base64.length; i++) {
      if (base64[i] === '=') break;

      const value = chars.indexOf(base64[i]);
      buffer = (buffer << 6) | value;
      bits += 6;
      if (bits >= 8) {
          bits -= 8;
          result += String.fromCharCode((buffer >> bits) & 0xFF);
      }
  }

  return result;
}

function createToken(payload, secretKey) {
  const encodedPayload = encodeToken(JSON.stringify(payload));
  const token = `${encodedPayload}.${encodeToken(secretKey)}`;
  return token;
}

function decodeToken(token) {
  const [encodedPayload, encodedSecretKey] = token.split('.');
  const decodedPayload = JSON.parse(reverseTokenToKey(encodedPayload));
  const secretKey = reverseTokenToKey(encodedSecretKey);
  return { decodedPayload, secretKey };
}

module.exports = {
  encodeToken,
  reverseTokenToKey,
  createToken,
  decodeToken,
};
