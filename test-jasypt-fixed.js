// 수정된 Jasypt 암호화/복호화 테스트
const CryptoJS = require('crypto-js');

// OpenSSL EVP_BytesToKey algorithm
function evpBytesToKey(password, salt, keySize, ivSize) {
  const passwordWordArray = CryptoJS.enc.Utf8.parse(password);
  let derivedKey = CryptoJS.lib.WordArray.create();
  let block = CryptoJS.lib.WordArray.create();

  while (derivedKey.sigBytes < (keySize + ivSize) * 4) {
    if (block.sigBytes > 0) {
      block = CryptoJS.MD5(block.concat(passwordWordArray).concat(salt));
    } else {
      block = CryptoJS.MD5(passwordWordArray.concat(salt));
    }
    derivedKey = derivedKey.concat(block);
  }

  return {
    key: CryptoJS.lib.WordArray.create(derivedKey.words.slice(0, keySize)),
    iv: CryptoJS.lib.WordArray.create(derivedKey.words.slice(keySize, keySize + ivSize))
  };
}

// 수정된 암호화 함수
function jasyptEncrypt(text, password) {
  const salt = CryptoJS.lib.WordArray.random(8);
  const derived = evpBytesToKey(password, salt, 8, 4);

  const encrypted = CryptoJS.AES.encrypt(text, derived.key, {
    iv: derived.iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });

  const saltedPrefix = CryptoJS.enc.Utf8.parse('Salted__');
  const combined = saltedPrefix.concat(salt).concat(encrypted.ciphertext);

  return CryptoJS.enc.Base64.stringify(combined);
}

// 수정된 복호화 함수
function jasyptDecrypt(encryptedText, password) {
  try {
    const combined = CryptoJS.enc.Base64.parse(encryptedText);

    // Check for "Salted__" prefix
    const saltedPrefix = CryptoJS.lib.WordArray.create(combined.words.slice(0, 2));
    const saltedPrefixStr = CryptoJS.enc.Utf8.stringify(saltedPrefix);

    if (saltedPrefixStr !== 'Salted__') {
      throw new Error('잘못된 암호화 형식입니다');
    }

    // Extract salt
    const salt = CryptoJS.lib.WordArray.create(combined.words.slice(2, 4));

    // Extract ciphertext
    const ciphertext = CryptoJS.lib.WordArray.create(
      combined.words.slice(4),
      combined.sigBytes - 16
    );

    // Derive key and IV
    const derived = evpBytesToKey(password, salt, 8, 4);

    // Decrypt
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: ciphertext },
      derived.key,
      {
        iv: derived.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );

    const result = decrypted.toString(CryptoJS.enc.Utf8);

    // Validate result
    if (!result || result.length === 0) {
      throw new Error('잘못된 비밀키이거나 암호화 텍스트가 손상되었습니다');
    }

    return result;
  } catch (e) {
    if (e instanceof Error) {
      throw new Error(`복호화 실패: ${e.message}`);
    }
    throw new Error('복호화 실패: 잘못된 암호화 텍스트 또는 비밀키');
  }
}

console.log('=== 수정된 Jasypt 암호화/복호화 테스트 ===\n');

// 테스트 케이스
const testCases = [
  { name: '영문', text: 'Hello World', password: 'test123' },
  { name: '한글', text: '안녕하세요', password: 'password' },
  { name: '특수문자', text: '!@#$%^&*()', password: 'secret' },
  { name: '혼합', text: 'Hello 안녕 123 !@#', password: 'mykey' },
  { name: '긴 텍스트', text: 'Lorem ipsum '.repeat(20), password: 'longpass' },
  { name: '이모지', text: '😀😁😂🤣', password: 'emoji' },
];

let success = 0;
let fail = 0;

console.log('📋 기본 암호화/복호화 테스트:\n');

testCases.forEach((tc, idx) => {
  try {
    const encrypted = jasyptEncrypt(tc.text, tc.password);
    const decrypted = jasyptDecrypt(encrypted, tc.password);
    const ok = decrypted === tc.text;

    console.log(`[${idx + 1}] ${tc.name}: ${ok ? '✅' : '❌'}`);
    if (ok) success++;
    else {
      fail++;
      console.log(`   예상: "${tc.text}"`);
      console.log(`   실제: "${decrypted}"`);
    }
  } catch (e) {
    fail++;
    console.log(`[${idx + 1}] ${tc.name}: ❌ 에러 - ${e.message}`);
  }
});

console.log(`\n결과: ${success}/${testCases.length} 성공\n`);

// 잘못된 비밀키 테스트
console.log('🔐 잘못된 비밀키 테스트:\n');

try {
  const encrypted = jasyptEncrypt('비밀 메시지', 'correctPassword');
  console.log('암호화 성공:', encrypted);
  console.log('\n잘못된 비밀키로 복호화 시도...');

  const decrypted = jasyptDecrypt(encrypted, 'wrongPassword');
  console.log('❌ 문제: 잘못된 비밀키로 복호화 성공함');
  console.log('   결과:', decrypted);
} catch (e) {
  console.log('✅ 올바르게 에러 발생:');
  console.log('   ', e.message);
}

// 손상된 데이터 테스트
console.log('\n🔧 손상된 암호화 텍스트 테스트:\n');

try {
  jasyptDecrypt('invalid-base64-data!!!', 'password');
  console.log('❌ 문제: 손상된 데이터 복호화 성공');
} catch (e) {
  console.log('✅ 올바르게 에러 발생:');
  console.log('   ', e.message);
}

// OpenSSL 명령어와 호환성 테스트 정보
console.log('\n💡 OpenSSL 호환성 참고:\n');
console.log('이 구현은 OpenSSL EVP_BytesToKey 알고리즘을 사용합니다.');
console.log('OpenSSL 명령어로 테스트 가능:');
console.log('');
console.log('  # 암호화 (OpenSSL)');
console.log('  echo "Hello World" | openssl enc -aes-256-cbc -md md5 -a -pbkdf2 -pass pass:mypassword');
console.log('');
console.log('  # 복호화 (OpenSSL)');
console.log('  echo "U2FsdGVkX1..." | openssl enc -aes-256-cbc -md md5 -a -d -pbkdf2 -pass pass:mypassword');
console.log('');
