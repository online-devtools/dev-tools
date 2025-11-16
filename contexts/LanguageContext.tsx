'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'ko' | 'en'

type TranslationReplacements = Record<string, string | number>

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, replacements?: TranslationReplacements) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation strings are grouped by language so UI text lives in one place.
const translations: Record<Language, Record<string, string>> = {
  ko: {
    // 공통
    'common.copy': '복사',
    'common.clear': '초기화',
    'common.copied': '복사됨!',

    // 사이트 제목 및 설명
    'site.title': 'Developer Tools - 개발자를 위한 필수 도구 모음',
    'site.description': '개발자를 위한 20가지 이상의 무료 온라인 도구. Base64, JSON, JWT, 정규식, QR 코드 등 필수 개발 도구를 한 곳에서',

    // Navigation
    'nav.home': '홈',
    'nav.about': '소개',
    'nav.contact': '문의',
    'nav.privacy': '개인정보 처리방침',
    'nav.terms': '이용약관',

    // Home Page
    'home.title': '개발자를 위한 필수 도구 모음',
    'home.subtitle': '개발하면서 자주 사용하는 유틸리티 도구들을 한 곳에서',
    'home.toolCount': '✨ 23개의 전문 개발 도구 제공',
    'home.aboutTitle': 'Developer Tools란?',
    'home.aboutText1': 'Developer Tools는 웹 개발자, 백엔드 개발자, 프론트엔드 개발자, 풀스택 개발자 등 모든 개발자들이 일상적으로 필요로 하는 다양한 온라인 유틸리티 도구를 한 곳에서 제공하는 무료 웹 서비스입니다. Base64 인코딩/디코딩, JSON 포맷팅, JWT 토큰 디코딩, 정규식 테스트, QR 코드 생성 등 개발 과정에서 자주 사용되는 18가지 이상의 전문 도구를 별도의 설치나 회원가입 없이 바로 사용할 수 있습니다.',
    'home.aboutText2': '모든 도구는 클라이언트 사이드에서만 작동하여 사용자의 데이터가 서버로 전송되지 않으므로 완벽한 프라이버시를 보장합니다. 또한 반응형 디자인으로 제작되어 데스크톱, 태블릿, 모바일 등 모든 기기에서 최적화된 사용 경험을 제공합니다. 다크 모드를 자동으로 지원하여 장시간 개발 작업 시에도 눈의 피로를 최소화할 수 있습니다.',
    'home.whyTitle': '왜 Developer Tools를 선택해야 할까요?',
    'home.feature1.title': '완전 무료',
    'home.feature1.desc': '모든 도구를 무료로 제한 없이 사용할 수 있습니다. 숨겨진 비용이나 프리미엄 플랜이 없습니다.',
    'home.feature2.title': '프라이버시 우선',
    'home.feature2.desc': '모든 처리는 브라우저에서만 이루어지며, 입력 데이터가 서버로 전송되지 않아 안전합니다.',
    'home.feature3.title': '빠른 성능',
    'home.feature3.desc': '서버 통신 없이 즉시 결과를 확인할 수 있어 빠르고 효율적입니다.',
    'home.feature4.title': '모든 기기 지원',
    'home.feature4.desc': 'PC, 태블릿, 스마트폰 등 어떤 기기에서도 최적화된 경험을 제공합니다.',
    'home.feature5.title': '회원가입 불필요',
    'home.feature5.desc': '복잡한 가입 절차 없이 바로 접속해서 사용할 수 있습니다.',
    'home.feature6.title': '지속적인 업데이트',
    'home.feature6.desc': '개발자 커뮤니티의 피드백을 반영하여 새로운 도구를 지속적으로 추가합니다.',

    // Tool Categories
    'category.encoding': 'Encoding & Decoding',
    'category.security': 'Security & Encryption',
    'category.dataFormat': 'Data Format',
    'category.generators': 'Generators',
    'category.converters': 'Converters',
    'category.tools': 'Tools',
    'category.linux': 'Linux & System',
    'category.network': 'Network & DevOps',

    // Tool Names
    'tool.base64': 'Base64',
    'tool.url': 'URL Encode',
    'tool.jasypt': 'Jasypt',
    'tool.json': 'JSON',
    'tool.jwt': 'JWT',
    'tool.jwtSigner': 'JWT Signer',
    'tool.jwtSigner': 'JWT 서명기',
    'tool.sql': 'SQL',
    'tool.mybatis': 'MyBatis',
    'tool.csv': 'CSV/JSON',
    'tool.cron': 'Cron',
    'tool.timestamp': 'Timestamp',
    'tool.uuid': 'UUID',
    'tool.hash': 'Hash',
    'tool.regex': 'Regex',
    'tool.color': 'Color',
    'tool.diff': 'Diff',
    'tool.qrcode': 'QR Code',
    'tool.case': 'Case Convert',
    'tool.html': 'HTML/XML',
    'tool.lorem': 'Lorem Ipsum',
    'tool.chmod': 'chmod',
    'tool.ipcalc': 'IP Calc',
    'tool.baseconv': 'Base Conv',
    'tool.password': 'Password',

    // Tool Descriptions
    'tool.base64.desc': 'Base64 인코딩 및 디코딩',
    'tool.url.desc': 'URL 인코딩 및 디코딩',
    'tool.jasypt.desc': 'AES 암호화 및 복호화',
    'tool.json.desc': 'JSON 포맷팅 및 검증',
    'tool.jwt.desc': 'JWT 토큰 디코딩 및 검증',
    'tool.jwtSigner.desc': 'JWT 토큰 생성 및 서명',
    'tool.sql.desc': 'SQL 쿼리 포맷팅',
    'tool.mybatis.desc': 'MyBatis 쿼리를 실행 가능한 SQL로 변환',
    'tool.csv.desc': 'CSV ↔ JSON 변환',
    'tool.cron.desc': 'Cron 표현식 해석',
    'tool.timestamp.desc': '타임스탬프 변환',
    'tool.uuid.desc': 'UUID 생성',
    'tool.hash.desc': 'MD5, SHA 해시 생성',
    'tool.regex.desc': '정규식 테스트',
    'tool.color.desc': 'HEX/RGB/HSL 변환',
    'tool.diff.desc': '텍스트 비교',
    'tool.qrcode.desc': 'QR 코드 생성',
    'tool.case.desc': '문자열 케이스 변환',
    'tool.html.desc': 'HTML/XML 포맷팅',
    'tool.lorem.desc': '더미 텍스트 생성',
    'tool.chmod.desc': 'Unix 파일 권한 계산기',
    'tool.ipcalc.desc': 'IP/CIDR 서브넷 계산기',
    'tool.baseconv.desc': '2/8/10/16진수 변환',
    'tool.password.desc': '안전한 비밀번호 생성',

    // Base64 Tool
    'base64.title': 'Base64 인코더/디코더',
    'base64.description': '텍스트를 Base64로 인코딩하거나 디코딩합니다',
    'base64.input.label': '입력',
    'base64.input.placeholder': '변환할 텍스트를 입력하세요...',
    'base64.output.label': '결과',
    'base64.output.placeholder': '결과가 여기에 표시됩니다...',
    'base64.actions.encode': '인코딩',
    'base64.actions.decode': '디코딩',
    'base64.actions.clear': '초기화',
    'base64.error.encode': '인코딩 실패: 올바른 텍스트를 입력해주세요.',
    'base64.error.decode': '디코딩 실패: 올바른 Base64 문자열을 입력해주세요.',

    // Regex Tool
    'regex.title': '정규식 테스터',
    'regex.description': '정규식 패턴을 테스트하고 매칭 결과를 확인합니다',
    'regex.pattern.label': '정규식 패턴',
    'regex.pattern.placeholder': '예: [a-z]+',
    'regex.flags.label': '플래그',
    'regex.flags.placeholder': 'g, i, m',
    'regex.commonPatterns.label': '자주 사용하는 패턴',
    'regex.commonPatterns.email': '이메일',
    'regex.commonPatterns.url': 'URL',
    'regex.commonPatterns.phone': '전화번호',
    'regex.commonPatterns.ip': 'IP 주소',
    'regex.commonPatterns.hex': '16진수 컬러',
    'regex.testString.label': '테스트 문자열',
    'regex.testString.placeholder': '테스트할 문자열을 입력하세요...',
    'regex.actions.test': '테스트',
    'regex.actions.clear': '초기화',
    'regex.results.label': '매칭 결과 ({{count}}개)',
    'regex.results.match': 'Match {{index}}',
    'regex.error.required': '정규식 패턴을 입력해주세요.',
    'regex.error.noMatch': '매칭되는 문자열이 없습니다.',
    'regex.error.syntax': '정규식 오류: {{message}}',

    // Password Generator
    'password.title': 'Password Generator',
    'password.description': '안전한 비밀번호 생성기',
    'password.length.label': '길이: {{length}}자',
    'password.options.uppercase': '대문자 (A-Z)',
    'password.options.lowercase': '소문자 (a-z)',
    'password.options.numbers': '숫자 (0-9)',
    'password.options.symbols': '특수문자 (!@#$...)',
    'password.actions.generate': '비밀번호 생성',
    'password.result.label': '생성된 비밀번호',
    'password.strength.title': '강도:',
    'password.strength.weak': '약함',
    'password.strength.medium': '보통',
    'password.strength.strong': '강함',
    'password.tips.title': '🛡️ 안전한 비밀번호 팁',
    'password.tips.1': '• 최소 12자 이상 사용하세요',
    'password.tips.2': '• 대소문자, 숫자, 특수문자를 모두 포함하세요',
    'password.tips.3': '• 여러 사이트에서 같은 비밀번호를 사용하지 마세요',
    'password.tips.4': '• 개인정보(생일, 이름 등)를 사용하지 마세요',

    // JWT Signer
    'jwtSigner.title': 'JWT Signer',
    'jwtSigner.description': '시크릿으로 서명된 JWT 토큰을 생성합니다',
    'jwtSigner.header.label': '헤더 (JSON)',
    'jwtSigner.payload.label': '페이로드 (JSON)',
    'jwtSigner.payload.placeholder': '{ "sub": "user", "exp": 1719820800 }',
    'jwtSigner.secret.label': '비밀 키',
    'jwtSigner.secret.placeholder': '서명에 사용할 비밀 키를 입력하세요...',
    'jwtSigner.algorithm.label': '알고리즘',
    'jwtSigner.algorithm.hs256': 'HS256 (HMAC SHA-256)',
    'jwtSigner.algorithm.hs384': 'HS384 (HMAC SHA-384)',
    'jwtSigner.algorithm.hs512': 'HS512 (HMAC SHA-512)',

    // Jasypt 페이지
    'jasypt.title': 'Jasypt 암호화/복호화',
    'jasypt.description': 'Jasypt 스타일의 온라인 암호화 및 복호화 도구',
    'jasypt.encryption.title': '🔐 Jasypt Encryption',
    'jasypt.encryption.description': '평문을 암호화합니다',
    'jasypt.decryption.title': '🔓 Jasypt Decryption',
    'jasypt.decryption.description': '암호화된 텍스트를 복호화하거나 비밀번호를 검증합니다',
    'jasypt.plaintext': '평문 입력',
    'jasypt.plaintext.placeholder': '암호화할 텍스트를 입력하세요...',
    'jasypt.encryptionType': '암호화 타입 선택',
    'jasypt.oneWay': 'One Way Encryption (Without Secret Text)',
    'jasypt.twoWay': 'Two Way Encryption (With Secret Text)',
    'jasypt.secretKey': '암호화 키 입력',
    'jasypt.secretKey.placeholder': '암호화 키를 입력하세요...',
    'jasypt.encrypt': 'Encrypt',
    'jasypt.result': 'Jasypt Encrypted String',
    'jasypt.encryptedText': '암호화된 텍스트 입력',
    'jasypt.encryptedText.placeholder': '암호화된 텍스트를 입력하세요...',
    'jasypt.actionType': 'Action Type 선택',
    'jasypt.match': 'Match Password',
    'jasypt.decrypt': 'Decrypt Password',
    'jasypt.plainMatch': '비교할 평문 입력',
    'jasypt.plainMatch.placeholder': '비교할 평문을 입력하세요...',
    'jasypt.decryptKey': '복호화 키',
    'jasypt.decryptKey.placeholder': '복호화 키를 입력하세요...',
    'jasypt.resultLabel': 'Result:',
    'jasypt.info.title': '💡 사용 방법:',
    'jasypt.info.oneWay': 'One Way Encryption: MD5 해시를 사용한 일방향 암호화 (복호화 불가능)',
    'jasypt.info.twoWay': 'Two Way Encryption: AES를 사용한 양방향 암호화 (복호화 가능)',
    'jasypt.info.match': 'Match Password: 입력한 평문이 암호화된 값과 일치하는지 확인',
    'jasypt.info.decrypt': 'Decrypt Password: 암호화된 텍스트를 원본으로 복호화',

    // Error messages
    'jasypt.error.plaintext': '암호화할 텍스트를 입력해주세요.',
    'jasypt.error.secretkey': '암호화 키를 입력해주세요.',
    'jasypt.error.encrypt': '암호화 실패',
    'jasypt.error.generic': '오류가 발생했습니다.',
    'jasypt.error.encryptedtext': '암호화된 텍스트를 입력해주세요.',
    'jasypt.error.plainmatch': '비교할 평문을 입력해주세요.',
    'jasypt.error.decryptkey': '복호화 키를 입력해주세요.',
    'jasypt.error.decrypt': '복호화 실패: 올바른 암호문과 키를 확인해주세요.',
    'jasypt.error.process': '처리 실패',

    // Match results
    'jasypt.match.success': 'Match! 비밀번호가 일치합니다.',
    'jasypt.match.fail': 'Not Match! 비밀번호가 일치하지 않습니다.',

    // SEO Content
    'jasypt.seo.moreInfo': '더 자세한 정보',
    'jasypt.seo.intro': '무료 온라인 Jasypt 암호화 및 복호화 도구입니다. Jasypt 스타일 알고리즘을 사용하여 텍스트를 암호화하고 복호화하는 간단한 방법을 제공합니다. 비밀번호 암호화, 데이터 보안 및 설정 관리 작업을 하는 개발자에게 완벽합니다.',
    'jasypt.seo.features': '주요 기능',
    'jasypt.seo.feature1': 'One-Way Encryption: 비밀번호 저장을 위한 MD5 해시 기반 암호화 (복호화 불가능)',
    'jasypt.seo.feature2': 'Two-Way Encryption: 나중에 복호화가 필요한 데이터를 위한 AES 암호화',
    'jasypt.seo.feature3': 'Password Matching: 평문 비밀번호가 암호화된 해시와 일치하는지 확인',
    'jasypt.seo.feature4': 'Password Decryption: 올바른 키로 AES 암호화된 비밀번호 복호화',
    'jasypt.seo.feature5': 'Client-Side Processing: 모든 암호화는 브라우저에서 수행되며 서버로 데이터를 전송하지 않음',
    'jasypt.seo.feature6': 'Free & Unlimited: 완전 무료로 무제한 사용',
    'jasypt.seo.howToUse': '사용 방법',
    'jasypt.seo.step1': '입력 필드에 평문 입력',
    'jasypt.seo.step2': '일방향 또는 양방향 암호화 선택',
    'jasypt.seo.step3': '양방향 암호화의 경우 비밀 키 입력',
    'jasypt.seo.step4': '"Encrypt" 버튼을 클릭하여 암호화된 문자열 생성',
    'jasypt.seo.step5': '복호화 섹션을 사용하여 비밀번호 복호화 또는 매칭',
    'jasypt.seo.whyUse': '왜 이 도구를 사용해야 할까요?',
    'jasypt.seo.whyUseDesc': '다른 온라인 암호화 도구와 달리, 우리의 Jasypt 암호화 도구는 브라우저에서 모든 것을 처리하여 민감한 데이터가 컴퓨터를 떠나지 않도록 보장합니다. 다음과 같은 경우에 완벽합니다:',
    'jasypt.seo.useCase1': 'Spring Boot 애플리케이션 설정',
    'jasypt.seo.useCase2': '비밀번호 암호화 및 검증',
    'jasypt.seo.useCase3': '안전한 데이터 저장',
    'jasypt.seo.useCase4': '암호화 알고리즘 테스트',
    'jasypt.seo.useCase5': '데이터베이스 비밀번호 관리',
  },
  en: {
    // Common
    'common.copy': 'Copy',
    'common.clear': 'Clear',
    'common.copied': 'Copied!',

    // Site title and description
    'site.title': 'Developer Tools - Essential Online Tools for Developers',
    'site.description': '20+ free online developer tools. Base64, JSON, JWT, Regex, QR Code and more essential dev tools in one place',

    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.privacy': 'Privacy Policy',
    'nav.terms': 'Terms of Service',

    // Home Page
    'home.title': 'Essential Tools for Developers',
    'home.subtitle': 'Utility tools frequently used in development, all in one place',
    'home.toolCount': '✨ 23 Professional Development Tools',
    'home.aboutTitle': 'About Developer Tools',
    'home.aboutText1': 'Developer Tools is a free web service that provides a variety of online utility tools that all developers need on a daily basis, including web developers, backend developers, frontend developers, and full-stack developers, in one place. You can use more than 18 professional tools frequently used in the development process, such as Base64 encoding/decoding, JSON formatting, JWT token decoding, regular expression testing, and QR code generation, without installation or registration.',
    'home.aboutText2': 'All tools work only on the client side, so your data is never sent to the server, ensuring complete privacy. It is also designed responsively to provide an optimized user experience on all devices, including desktops, tablets, and mobile devices. It automatically supports dark mode to minimize eye strain during long development sessions.',
    'home.whyTitle': 'Why Choose Developer Tools?',
    'home.feature1.title': 'Completely Free',
    'home.feature1.desc': 'Use all tools for free without any restrictions. No hidden costs or premium plans.',
    'home.feature2.title': 'Privacy First',
    'home.feature2.desc': 'All processing is done in your browser, and your data is never sent to servers.',
    'home.feature3.title': 'Fast Performance',
    'home.feature3.desc': 'Get instant results without server communication, fast and efficient.',
    'home.feature4.title': 'All Device Support',
    'home.feature4.desc': 'Optimized experience on any device including PC, tablet, and smartphone.',
    'home.feature5.title': 'No Registration Required',
    'home.feature5.desc': 'Start using immediately without complex registration process.',
    'home.feature6.title': 'Continuous Updates',
    'home.feature6.desc': 'New tools are continuously added based on developer community feedback.',

    // Tool Categories
    'category.encoding': 'Encoding & Decoding',
    'category.security': 'Security & Encryption',
    'category.dataFormat': 'Data Format',
    'category.generators': 'Generators',
    'category.converters': 'Converters',
    'category.tools': 'Tools',
    'category.linux': 'Linux & System',
    'category.network': 'Network & DevOps',

    // Tool Names
    'tool.base64': 'Base64',
    'tool.url': 'URL Encode',
    'tool.jasypt': 'Jasypt',
    'tool.json': 'JSON',
    'tool.jwt': 'JWT',
    'tool.sql': 'SQL',
    'tool.mybatis': 'MyBatis',
    'tool.csv': 'CSV/JSON',
    'tool.cron': 'Cron',
    'tool.timestamp': 'Timestamp',
    'tool.uuid': 'UUID',
    'tool.hash': 'Hash',
    'tool.regex': 'Regex',
    'tool.color': 'Color',
    'tool.diff': 'Diff',
    'tool.qrcode': 'QR Code',
    'tool.case': 'Case Convert',
    'tool.html': 'HTML/XML',
    'tool.lorem': 'Lorem Ipsum',
    'tool.chmod': 'chmod',
    'tool.ipcalc': 'IP Calc',
    'tool.baseconv': 'Base Conv',
    'tool.password': 'Password',

    // Tool Descriptions
    'tool.base64.desc': 'Base64 encoding and decoding',
    'tool.url.desc': 'URL encoding and decoding',
    'tool.jasypt.desc': 'AES encryption and decryption',
    'tool.json.desc': 'JSON formatting and validation',
    'tool.jwt.desc': 'JWT token decoding and validation',
    'tool.jwtSigner.desc': 'Generate and sign JWT tokens',
    'tool.sql.desc': 'SQL query formatting',
    'tool.mybatis.desc': 'Convert MyBatis query to executable SQL',
    'tool.csv.desc': 'CSV ↔ JSON conversion',
    'tool.cron.desc': 'Cron expression parser',
    'tool.timestamp.desc': 'Timestamp conversion',
    'tool.uuid.desc': 'UUID generation',
    'tool.hash.desc': 'MD5, SHA hash generation',
    'tool.regex.desc': 'Regular expression testing',
    'tool.color.desc': 'HEX/RGB/HSL conversion',
    'tool.diff.desc': 'Text comparison',
    'tool.qrcode.desc': 'QR code generation',
    'tool.case.desc': 'String case conversion',
    'tool.html.desc': 'HTML/XML formatting',
    'tool.lorem.desc': 'Dummy text generation',
    'tool.chmod.desc': 'Unix file permission calculator',
    'tool.ipcalc.desc': 'IP/CIDR subnet calculator',
    'tool.baseconv.desc': '2/8/10/16 base converter',
    'tool.password.desc': 'Secure password generator',

    // Base64 Tool
    'base64.title': 'Base64 Encoder/Decoder',
    'base64.description': 'Encode plain text or decode Base64 strings',
    'base64.input.label': 'Input',
    'base64.input.placeholder': 'Type text to convert...',
    'base64.output.label': 'Output',
    'base64.output.placeholder': 'Results will appear here...',
    'base64.actions.encode': 'Encode',
    'base64.actions.decode': 'Decode',
    'base64.actions.clear': 'Clear',
    'base64.error.encode': 'Encoding failed: please provide valid text.',
    'base64.error.decode': 'Decoding failed: please provide a valid Base64 string.',

    // Regex Tool
    'regex.title': 'Regex Tester',
    'regex.description': 'Test regular expressions and inspect matches',
    'regex.pattern.label': 'Regex Pattern',
    'regex.pattern.placeholder': 'e.g. [a-z]+',
    'regex.flags.label': 'Flags',
    'regex.flags.placeholder': 'g, i, m',
    'regex.commonPatterns.label': 'Common Patterns',
    'regex.commonPatterns.email': 'Email',
    'regex.commonPatterns.url': 'URL',
    'regex.commonPatterns.phone': 'Phone Number',
    'regex.commonPatterns.ip': 'IP Address',
    'regex.commonPatterns.hex': 'Hex Color',
    'regex.testString.label': 'Test String',
    'regex.testString.placeholder': 'Paste the string you want to test...',
    'regex.actions.test': 'Test',
    'regex.actions.clear': 'Clear',
    'regex.results.label': 'Matches ({{count}})',
    'regex.results.match': 'Match {{index}}',
    'regex.error.required': 'Please provide a regex pattern.',
    'regex.error.noMatch': 'No matches found.',
    'regex.error.syntax': 'Regex error: {{message}}',

    // Password Generator
    'password.title': 'Password Generator',
    'password.description': 'Generate secure passwords instantly',
    'password.length.label': 'Length: {{length}} chars',
    'password.options.uppercase': 'Uppercase (A-Z)',
    'password.options.lowercase': 'Lowercase (a-z)',
    'password.options.numbers': 'Numbers (0-9)',
    'password.options.symbols': 'Symbols (!@#$...)',
    'password.actions.generate': 'Generate Password',
    'password.result.label': 'Generated Password',
    'password.strength.title': 'Strength:',
    'password.strength.weak': 'Weak',
    'password.strength.medium': 'Medium',
    'password.strength.strong': 'Strong',
    'password.tips.title': '🛡️ Password Safety Tips',
    'password.tips.1': '• Aim for at least 12 characters.',
    'password.tips.2': '• Mix uppercase, lowercase, numbers, and symbols.',
    'password.tips.3': '• Avoid reusing passwords across services.',
    'password.tips.4': '• Never include personal information.',

    // JWT Signer
    'jwtSigner.title': 'JWT Signer',
    'jwtSigner.description': 'Generate signed JWT tokens with your secret',
    'jwtSigner.header.label': 'Header (JSON)',
    'jwtSigner.payload.label': 'Payload (JSON)',
    'jwtSigner.payload.placeholder': '{ \"sub\": \"user\", \"exp\": 1719820800 }',
    'jwtSigner.secret.label': 'Secret',
    'jwtSigner.secret.placeholder': 'Enter the secret used for signing...',
    'jwtSigner.algorithm.label': 'Algorithm',
    'jwtSigner.algorithm.hs256': 'HS256 (HMAC SHA-256)',
    'jwtSigner.algorithm.hs384': 'HS384 (HMAC SHA-384)',
    'jwtSigner.algorithm.hs512': 'HS512 (HMAC SHA-512)',
    'jwtSigner.actions.generate': '토큰 생성',
    'jwtSigner.actions.clear': '초기화',
    'jwtSigner.result.label': '생성된 JWT',
    'jwtSigner.result.signingInput': 'Signing Input',
    'jwtSigner.result.note': '토큰을 안전하게 보관하고 주기적으로 키를 교체하세요.',
    'jwtSigner.error.invalidHeader': '헤더 JSON을 확인해주세요.',
    'jwtSigner.error.invalidPayload': '페이로드 JSON을 확인해주세요.',
    'jwtSigner.error.secretRequired': '비밀 키를 입력해주세요.',
    'jwtSigner.hint': 'exp, iss 등의 클레임을 추가하여 토큰을 완성하세요.',
    'jwtSigner.actions.generate': 'Generate Token',
    'jwtSigner.actions.clear': 'Clear',
    'jwtSigner.result.label': 'Generated JWT',
    'jwtSigner.result.signingInput': 'Signing Input',
    'jwtSigner.result.note': 'Keep your tokens safe and rotate secrets periodically.',
    'jwtSigner.error.invalidHeader': 'Please provide a valid JSON header.',
    'jwtSigner.error.invalidPayload': 'Please provide a valid JSON payload.',
    'jwtSigner.error.secretRequired': 'Secret is required to sign a token.',
    'jwtSigner.hint': 'Add claims such as exp, iss, aud to complete the payload.',

    // Jasypt page
    'jasypt.title': 'Jasypt Encryption and Decryption',
    'jasypt.description': 'Online Jasypt-style encryption and decryption tool',
    'jasypt.encryption.title': '🔐 Jasypt Encryption',
    'jasypt.encryption.description': 'Encrypt plain text',
    'jasypt.decryption.title': '🔓 Jasypt Decryption',
    'jasypt.decryption.description': 'Decrypt encrypted text or verify password',
    'jasypt.plaintext': 'Enter Plain Text to Encrypt',
    'jasypt.plaintext.placeholder': 'Enter text to encrypt...',
    'jasypt.encryptionType': 'Select Type of Encryption',
    'jasypt.oneWay': 'One Way Encryption (Without Secret Text)',
    'jasypt.twoWay': 'Two Way Encryption (With Secret Text)',
    'jasypt.secretKey': 'Enter Secret Key',
    'jasypt.secretKey.placeholder': 'Enter encryption key...',
    'jasypt.encrypt': 'Encrypt',
    'jasypt.result': 'Jasypt Encrypted String',
    'jasypt.encryptedText': 'Enter Jasypt Encrypted Text',
    'jasypt.encryptedText.placeholder': 'Enter encrypted text...',
    'jasypt.actionType': 'Select Action Type',
    'jasypt.match': 'Match Password',
    'jasypt.decrypt': 'Decrypt Password',
    'jasypt.plainMatch': 'Enter the Plain Text to Match',
    'jasypt.plainMatch.placeholder': 'Enter plain text to match...',
    'jasypt.decryptKey': 'Secret Key Used during Encryption',
    'jasypt.decryptKey.placeholder': 'Enter decryption key...',
    'jasypt.resultLabel': 'Result:',
    'jasypt.info.title': '💡 How to Use:',
    'jasypt.info.oneWay': 'One Way Encryption: MD5 hash-based one-way encryption (cannot be decrypted)',
    'jasypt.info.twoWay': 'Two Way Encryption: AES-based two-way encryption (can be decrypted)',
    'jasypt.info.match': 'Match Password: Check if the plain text matches the encrypted value',
    'jasypt.info.decrypt': 'Decrypt Password: Decrypt encrypted text to original',

    // Error messages
    'jasypt.error.plaintext': 'Please enter text to encrypt.',
    'jasypt.error.secretkey': 'Please enter an encryption key.',
    'jasypt.error.encrypt': 'Encryption failed',
    'jasypt.error.generic': 'An error occurred.',
    'jasypt.error.encryptedtext': 'Please enter encrypted text.',
    'jasypt.error.plainmatch': 'Please enter plain text to match.',
    'jasypt.error.decryptkey': 'Please enter a decryption key.',
    'jasypt.error.decrypt': 'Decryption failed: Please check the encrypted text and key.',
    'jasypt.error.process': 'Processing failed',

    // Match results
    'jasypt.match.success': 'Match! Passwords match.',
    'jasypt.match.fail': 'Not Match! Passwords do not match.',

    // SEO Content
    'jasypt.seo.moreInfo': 'More Information',
    'jasypt.seo.intro': 'Welcome to our free online Jasypt encryption and decryption tool. This tool provides a simple way to encrypt and decrypt text using Jasypt-style algorithms. Perfect for developers working with password encryption, data security, and configuration management.',
    'jasypt.seo.features': 'Features',
    'jasypt.seo.feature1': 'One-Way Encryption: MD5 hash-based encryption for password storage (cannot be decrypted)',
    'jasypt.seo.feature2': 'Two-Way Encryption: AES encryption for data that needs to be decrypted later',
    'jasypt.seo.feature3': 'Password Matching: Verify if a plain text password matches an encrypted hash',
    'jasypt.seo.feature4': 'Password Decryption: Decrypt AES-encrypted passwords with the correct key',
    'jasypt.seo.feature5': 'Client-Side Processing: All encryption happens in your browser - no data sent to servers',
    'jasypt.seo.feature6': 'Free & Unlimited: Use as much as you need, completely free',
    'jasypt.seo.howToUse': 'How to Use',
    'jasypt.seo.step1': 'Enter your plain text in the input field',
    'jasypt.seo.step2': 'Choose between one-way or two-way encryption',
    'jasypt.seo.step3': 'For two-way encryption, enter a secret key',
    'jasypt.seo.step4': 'Click "Encrypt" to generate the encrypted string',
    'jasypt.seo.step5': 'Use the decryption section to decrypt or match passwords',
    'jasypt.seo.whyUse': 'Why Use Our Jasypt Tool?',
    'jasypt.seo.whyUseDesc': 'Unlike other online encryption tools, our Jasypt encryption tool processes everything in your browser, ensuring your sensitive data never leaves your computer. It\'s perfect for:',
    'jasypt.seo.useCase1': 'Spring Boot application configuration',
    'jasypt.seo.useCase2': 'Password encryption and verification',
    'jasypt.seo.useCase3': 'Secure data storage',
    'jasypt.seo.useCase4': 'Testing encryption algorithms',
    'jasypt.seo.useCase5': 'Database password management',
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko')

  useEffect(() => {
    // Prefer a persisted language, otherwise detect from the browser locale once on mount.
    const browserLang = navigator.language.toLowerCase()
    const savedLang = localStorage.getItem('language') as Language

    if (savedLang) {
      setLanguageState(savedLang)
    } else if (browserLang.startsWith('ko')) {
      setLanguageState('ko')
    } else {
      setLanguageState('en')
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  // t() centralizes lookup + interpolation so every component consumes strings consistently.
  const t = (key: string, replacements?: TranslationReplacements): string => {
    const template = translations[language][key] || key
    if (!replacements) {
      return template
    }

    return Object.entries(replacements).reduce((acc, [token, value]) => {
      const pattern = new RegExp(`{{\\s*${token}\\s*}}`, 'g')
      return acc.replace(pattern, String(value))
    }, template)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
