// Jasypt 암호화/복호화 테스트 스크립트
const CryptoJS = require('crypto-js');

console.log('=== Jasypt 암호화/복호화 테스트 ===\n');

// 현재 구현 (문제가 있는 버전)
function jasyptEncryptOld(text, password) {
  const salt = CryptoJS.lib.WordArray.random(8);
  const key = CryptoJS.MD5(password + salt.toString());
  const iv = CryptoJS.MD5(key.toString() + password + salt.toString());

  const encrypted = CryptoJS.AES.encrypt(text, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const combined = salt.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
}

function jasyptDecryptOld(encryptedText, password) {
  try {
    const combined = CryptoJS.enc.Base64.parse(encryptedText);
    const salt = CryptoJS.lib.WordArray.create(combined.words.slice(0, 2));
    const ciphertext = CryptoJS.lib.WordArray.create(
      combined.words.slice(2),
      combined.sigBytes - 8
    );

    const key = CryptoJS.MD5(password + salt.toString());
    const iv = CryptoJS.MD5(key.toString() + password + salt.toString());

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    throw new Error('복호화 실패: ' + e.message);
  }
}

// OpenSSL EVP_BytesToKey 방식 (올바른 구현)
function evpBytesToKey(password, salt, keySize, ivSize) {
  const saltWordArray = CryptoJS.enc.Hex.parse(salt);
  const passwordWordArray = CryptoJS.enc.Utf8.parse(password);

  let key = CryptoJS.lib.WordArray.create();
  let block = CryptoJS.lib.WordArray.create();

  while (key.sigBytes < (keySize + ivSize) * 4) {
    if (block.sigBytes > 0) {
      block = CryptoJS.MD5(block.concat(passwordWordArray).concat(saltWordArray));
    } else {
      block = CryptoJS.MD5(passwordWordArray.concat(saltWordArray));
    }
    key = key.concat(block);
  }

  return {
    key: CryptoJS.lib.WordArray.create(key.words.slice(0, keySize)),
    iv: CryptoJS.lib.WordArray.create(key.words.slice(keySize, keySize + ivSize))
  };
}

// 새로운 구현 (OpenSSL EVP_BytesToKey 방식)
function jasyptEncryptNew(text, password) {
  const salt = CryptoJS.lib.WordArray.random(8);
  const saltHex = CryptoJS.enc.Hex.stringify(salt);

  // AES-256 requires 32 bytes (8 words) for key, 16 bytes (4 words) for IV
  const derived = evpBytesToKey(password, saltHex, 8, 4);

  const encrypted = CryptoJS.AES.encrypt(text, derived.key, {
    iv: derived.iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  // Prepend "Salted__" + salt + ciphertext (OpenSSL format)
  const saltedPrefix = CryptoJS.enc.Utf8.parse('Salted__');
  const combined = saltedPrefix.concat(salt).concat(encrypted.ciphertext);

  return CryptoJS.enc.Base64.stringify(combined);
}

function jasyptDecryptNew(encryptedText, password) {
  try {
    const combined = CryptoJS.enc.Base64.parse(encryptedText);

    // Extract "Salted__" prefix (8 bytes)
    const saltedPrefix = CryptoJS.lib.WordArray.create(combined.words.slice(0, 2));
    const saltedPrefixStr = CryptoJS.enc.Utf8.stringify(saltedPrefix);

    if (saltedPrefixStr !== 'Salted__') {
      throw new Error('Invalid encrypted format');
    }

    // Extract salt (8 bytes after "Salted__")
    const salt = CryptoJS.lib.WordArray.create(combined.words.slice(2, 4));
    const saltHex = CryptoJS.enc.Hex.stringify(salt);

    // Extract ciphertext (remaining bytes)
    const ciphertext = CryptoJS.lib.WordArray.create(
      combined.words.slice(4),
      combined.sigBytes - 16 // 8 bytes prefix + 8 bytes salt
    );

    // Derive key and IV
    const derived = evpBytesToKey(password, saltHex, 8, 4);

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      derived.key,
      {
        iv: derived.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    throw new Error('복호화 실패: ' + e.message);
  }
}

// 테스트
const testText = 'Hello, Jasypt!';
const testPassword = 'mySecretKey123';

console.log('원본 텍스트:', testText);
console.log('비밀키:', testPassword);
console.log('\n--- 이전 구현 테스트 ---');

try {
  const encryptedOld = jasyptEncryptOld(testText, testPassword);
  console.log('암호화 결과:', encryptedOld);

  const decryptedOld = jasyptDecryptOld(encryptedOld, testPassword);
  console.log('복호화 결과:', decryptedOld);
  console.log('복호화 성공:', decryptedOld === testText);
} catch (e) {
  console.log('에러 발생:', e.message);
}

console.log('\n--- 새로운 구현 테스트 (OpenSSL 호환) ---');

try {
  const encryptedNew = jasyptEncryptNew(testText, testPassword);
  console.log('암호화 결과:', encryptedNew);

  const decryptedNew = jasyptDecryptNew(encryptedNew, testPassword);
  console.log('복호화 결과:', decryptedNew);
  console.log('복호화 성공:', decryptedNew === testText);
} catch (e) {
  console.log('에러 발생:', e.message);
}

console.log('\n--- 여러 번 테스트 (같은 입력, 다른 salt) ---');
for (let i = 0; i < 3; i++) {
  const enc = jasyptEncryptNew(testText, testPassword);
  const dec = jasyptDecryptNew(enc, testPassword);
  console.log(`테스트 ${i + 1}:`, dec === testText ? '✅ 성공' : '❌ 실패');
}
