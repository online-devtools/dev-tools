export const toolCategories = [
  {
    categoryKey: 'category.encoding',
    icon: '🔤',
    tools: [
      { nameKey: 'tool.base64', path: '/base64', icon: '🔤' },
      { nameKey: 'tool.url', path: '/url', icon: '🔗' },
      { nameKey: 'tool.htmlEntities', path: '/html-entities', icon: '&' },
      { nameKey: 'tool.base64File', path: '/base64-file', icon: '📁' },
      { nameKey: 'tool.imageBase64', path: '/image-base64', icon: '🖼️' },
      { nameKey: 'tool.dataUrl', path: '/data-url', icon: '🧾' },
    ]
  },
  {
    categoryKey: 'category.security',
    icon: '🔐',
    tools: [
      { nameKey: 'tool.jasypt', path: '/jasypt', icon: '🔐' },
      { nameKey: 'tool.jwtSigner', path: '/jwt-signer', icon: '🧾' },
      { nameKey: 'tool.jwtKeys', path: '/jwt-keys', icon: '🗝️' },
      { nameKey: 'tool.hash', path: '/hash', icon: '🔒' },
      { nameKey: 'tool.password', path: '/password', icon: '🔑' },
      { nameKey: 'tool.bcrypt', path: '/bcrypt', icon: '🔐' },
      { nameKey: 'tool.hmac', path: '/hmac', icon: '🔒' },
      { nameKey: 'tool.otp', path: '/otp', icon: '🔢' },
      { nameKey: 'tool.basicAuth', path: '/basic-auth', icon: '🔑' },
      { nameKey: 'tool.stringObfuscator', path: '/string-obfuscator', icon: '🎭' },
      { nameKey: 'tool.passwordStrength', path: '/password-strength', icon: '💪' },
      { nameKey: 'tool.bip39', path: '/bip39', icon: '🔐' },
      { nameKey: 'tool.cryptoBundle', path: '/crypto-bundle', icon: '🧰' },
      { nameKey: 'tool.regexSafety', path: '/regex-safety', icon: '🛡️' },
    ]
  },
  {
    categoryKey: 'category.dataFormat',
    icon: '📋',
    tools: [
      { nameKey: 'tool.json', path: '/json', icon: '📋' },
      { nameKey: 'tool.jsonl', path: '/jsonl', icon: '🧾' },
      // JSON flattening helps map nested payloads into key/value paths.
      { nameKey: 'tool.jsonFlatten', path: '/json-flatten', icon: '🧩' },
      { nameKey: 'tool.jwt', path: '/jwt', icon: '🎫' },
      { nameKey: 'tool.sql', path: '/sql', icon: '🗃️' },
      { nameKey: 'tool.mybatis', path: '/mybatis', icon: '🐦' },
      { nameKey: 'tool.csv', path: '/csv', icon: '📊' },
      { nameKey: 'tool.html', path: '/html', icon: '🏷️' },
      { nameKey: 'tool.yamlJson', path: '/yaml-json', icon: '🔄' },
      { nameKey: 'tool.yamlToml', path: '/yaml-toml', icon: '🔄' },
      { nameKey: 'tool.jsonToml', path: '/json-toml', icon: '🔄' },
      { nameKey: 'tool.xmlJson', path: '/xml-json', icon: '🔄' },
      { nameKey: 'tool.markdownHtml', path: '/markdown-html', icon: '📝' },
      { nameKey: 'tool.jsonMinify', path: '/json-minify', icon: '📦' },
      { nameKey: 'tool.jsonCsv', path: '/json-csv', icon: '📊' },
      { nameKey: 'tool.jsonDiff', path: '/json-diff', icon: '🔍' },
      { nameKey: 'tool.jsonSchema', path: '/json-schema', icon: '📐' },
      { nameKey: 'tool.openapi', path: '/openapi', icon: '📜' },
      { nameKey: 'tool.schemaMock', path: '/schema-mock', icon: '🧩' },
      { nameKey: 'tool.envManager', path: '/env-manager', icon: '⚙️' },
      // Env diff supports comparing environment files for deployment checks.
      { nameKey: 'tool.envDiff', path: '/env-diff', icon: '🧪' },
      { nameKey: 'tool.codeMinifier', path: '/code-minifier', icon: '📦' },
      { nameKey: 'tool.sqlBuilder', path: '/sql-builder', icon: '🗃️' },
    ]
  },
  {
    categoryKey: 'category.generators',
    icon: '🆔',
    tools: [
      { nameKey: 'tool.uuid', path: '/uuid', icon: '🆔' },
      { nameKey: 'tool.qrcode', path: '/qrcode', icon: '📱' },
      { nameKey: 'tool.lorem', path: '/lorem', icon: '✏️' },
      { nameKey: 'tool.tokenGenerator', path: '/token-generator', icon: '🎲' },
      { nameKey: 'tool.tokenCounter', path: '/token-counter', icon: '🤖' },
      { nameKey: 'tool.ulid', path: '/ulid', icon: '🆔' },
      { nameKey: 'tool.portGenerator', path: '/port-generator', icon: '🔌' },
      { nameKey: 'tool.emojiPicker', path: '/emoji-picker', icon: '😀' },
      { nameKey: 'tool.asciiArt', path: '/ascii-art', icon: '🎨' },
      { nameKey: 'tool.macAddress', path: '/mac-address', icon: '🖧' },
      { nameKey: 'tool.metaTags', path: '/meta-tags', icon: '🏷️' },
      { nameKey: 'tool.cssGradient', path: '/css-gradient', icon: '🎨' },
      { nameKey: 'tool.boxShadow', path: '/box-shadow', icon: '📦' },
      { nameKey: 'tool.mockData', path: '/mock-data', icon: '🎲' },
      { nameKey: 'tool.exif', path: '/exif', icon: '📷' },
    ]
  },
  {
    categoryKey: 'category.converters',
    icon: '🔄',
    tools: [
      { nameKey: 'tool.timestamp', path: '/timestamp', icon: '🕐' },
      { nameKey: 'tool.color', path: '/color', icon: '🎨' },
      { nameKey: 'tool.case', path: '/case', icon: '📝' },
      { nameKey: 'tool.baseconv', path: '/baseconv', icon: '🔢' },
      { nameKey: 'tool.romanNumeral', path: '/roman-numeral', icon: 'Ⅰ' },
      { nameKey: 'tool.tempConverter', path: '/temp-converter', icon: '🌡️' },
      { nameKey: 'tool.svgOptimizer', path: '/svg-optimizer', icon: '⚡' },
      { nameKey: 'tool.curlConverter', path: '/curl-converter', icon: '🔄' },
    ]
  },
  {
    categoryKey: 'category.text',
    icon: '📝',
    tools: [
      { nameKey: 'tool.slugify', path: '/slugify', icon: '🔗' },
      { nameKey: 'tool.natoAlphabet', path: '/nato-alphabet', icon: '📻' },
      { nameKey: 'tool.textBinary', path: '/text-binary', icon: '0' },
      { nameKey: 'tool.textUnicode', path: '/text-unicode', icon: 'U' },
      { nameKey: 'tool.textStats', path: '/text-stats', icon: '📊' },
      { nameKey: 'tool.numeronym', path: '/numeronym', icon: 'i18n' },
      { nameKey: 'tool.listConverter', path: '/list-converter', icon: '📃' },
      { nameKey: 'tool.emailNormalizer', path: '/email-normalizer', icon: '📧' },
      { nameKey: 'tool.sorter', path: '/sorter', icon: '↕️' },
      { nameKey: 'tool.markdownTable', path: '/markdown-table', icon: '📋' },
    ]
  },
  {
    categoryKey: 'category.calculators',
    icon: '🧮',
    tools: [
      { nameKey: 'tool.mathEval', path: '/math-eval', icon: '🧮' },
      { nameKey: 'tool.percentageCalc', path: '/percentage-calc', icon: '%' },
      { nameKey: 'tool.semver', path: '/semver', icon: '🔢' },
    ]
  },
  {
    categoryKey: 'category.info',
    icon: 'ℹ️',
    tools: [
      { nameKey: 'tool.httpStatus', path: '/http-status', icon: '🌐' },
      { nameKey: 'tool.mimeTypes', path: '/mime-types', icon: '📄' },
      { nameKey: 'tool.keycode', path: '/keycode', icon: '⌨️' },
      { nameKey: 'tool.deviceInfo', path: '/device-info', icon: '📱' },
      { nameKey: 'tool.userAgent', path: '/user-agent', icon: '🖥️' },
      { nameKey: 'tool.phoneParser', path: '/phone-parser', icon: '📞' },
      { nameKey: 'tool.ibanValidator', path: '/iban-validator', icon: '🏦' },
      { nameKey: 'tool.a11yCheck', path: '/a11y-check', icon: '♿' },
    ]
  },
  {
    categoryKey: 'category.linux',
    icon: '🐧',
    tools: [
      { nameKey: 'tool.chmod', path: '/chmod', icon: '🔐' },
      { nameKey: 'tool.regex', path: '/regex', icon: '🔍' },
      { nameKey: 'tool.cron', path: '/cron', icon: '⏰' },
      { nameKey: 'tool.gitignoreGenerator', path: '/gitignore-generator', icon: '📝' },
      { nameKey: 'tool.cronHuman', path: '/cron-human', icon: '🗓️' },
    ]
  },
  {
    categoryKey: 'category.network',
    icon: '🌐',
    tools: [
      { nameKey: 'tool.ipcalc', path: '/ipcalc', icon: '🌐' },
      { nameKey: 'tool.diff', path: '/diff', icon: '📄' },
      { nameKey: 'tool.urlParser', path: '/url-parser', icon: '🔍' },
      { nameKey: 'tool.ipv4Converter', path: '/ipv4-converter', icon: '🔢' },
      { nameKey: 'tool.httpHeaders', path: '/http-headers', icon: '📨' },
      // Cookie parser belongs with other HTTP helpers.
      { nameKey: 'tool.cookieParser', path: '/cookie-parser', icon: '🍪' },
      { nameKey: 'tool.httpBuilder', path: '/http-builder', icon: '🧪' },
      { nameKey: 'tool.websocket', path: '/websocket', icon: '🔌' },
      { nameKey: 'tool.sslCert', path: '/ssl-cert', icon: '🔐' },
      { nameKey: 'tool.dnsLookup', path: '/dns-lookup', icon: '🌐' },
    ]
  }
]
