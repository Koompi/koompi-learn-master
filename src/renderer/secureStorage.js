/*
  eslint-disable
*/

import SecureLs from 'secure-ls';

const secret =
  process.env.NODE_ENV !== 'production' ?
    'NaN45*(~+' : process.env.SECURE_STORAGE_SECRET;

const secureStorage = new SecureLs({
  encodingType: 'aes',
  encryptionSecret: secret,
});

export default secureStorage;
