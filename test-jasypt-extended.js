// Jasypt 확장 테스트 - 다양한 케이스
const CryptoJS = require('crypto-js');

// 현재 구현
function jasyptEncrypt(text, password) {
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

function jasyptDecrypt(encryptedText, password) {
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

// 테스트 케이스들
const testCases = [
  { name: '영문 텍스트', text: 'Hello World', password: 'test123' },
  { name: '한글 텍스트', text: '안녕하세요', password: 'password' },
  { name: '특수문자', text: '!@#$%^&*()_+-=[]{}|;:",.<>?/', password: 'secret' },
  { name: '혼합 텍스트', text: 'Hello 안녕 123 !@#', password: 'mykey' },
  { name: '긴 텍스트', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10), password: 'longpass' },
  { name: '빈 비밀번호', text: 'test', password: '' },
  { name: '이모지', text: '😀😁😂🤣', password: 'emoji' },
  { name: 'JSON 형식', text: '{"name":"test","value":123}', password: 'json' }
];

console.log('=== Jasypt 확장 테스트 ===\n');

let successCount = 0;
let failCount = 0;

testCases.forEach((testCase, index) => {
  console.log(`[${index + 1}] ${testCase.name}`);
  console.log(`  원본: "${testCase.text.substring(0, 50)}${testCase.text.length > 50 ? '...' : ''}"`);
  console.log(`  비밀키: "${testCase.password}"`);

  try {
    const encrypted = jasyptEncrypt(testCase.text, testCase.password);
    console.log(`  암호화: ${encrypted.substring(0, 40)}...`);

    const decrypted = jasyptDecrypt(encrypted, testCase.password);
    const success = decrypted === testCase.text;

    if (success) {
      console.log(`  복호화: ✅ 성공`);
      successCount++;
    } else {
      console.log(`  복호화: ❌ 실패`);
      console.log(`  예상: "${testCase.text}"`);
      console.log(`  실제: "${decrypted}"`);
      failCount++;
    }
  } catch (e) {
    console.log(`  ❌ 에러: ${e.message}`);
    failCount++;
  }

  console.log('');
});

console.log('=== 테스트 결과 ===');
console.log(`총 ${testCases.length}개 중 성공: ${successCount}, 실패: ${failCount}`);

// 잘못된 비밀키로 복호화 시도
console.log('\n=== 잘못된 비밀키 테스트 ===');
try {
  const encrypted = jasyptEncrypt('test message', 'correctPassword');
  console.log('암호화 완료:', encrypted);

  console.log('\n잘못된 비밀키로 복호화 시도...');
  const decrypted = jasyptDecrypt(encrypted, 'wrongPassword');
  console.log('복호화 결과:', decrypted);

  if (decrypted === 'test message') {
    console.log('❌ 문제: 잘못된 비밀키로 복호화 성공 (보안 취약점!)');
  } else if (decrypted === '') {
    console.log('⚠️  빈 문자열 반환 (에러를 감지하지 못함)');
  } else {
    console.log('⚠️  잘못된 결과 반환:', decrypted);
  }
} catch (e) {
  console.log('✅ 올바르게 에러 발생:', e.message);
}
