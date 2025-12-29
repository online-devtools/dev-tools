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
      { nameKey: 'tool.csp', path: '/csp', icon: '🛡️' },
      { nameKey: 'tool.sri', path: '/sri', icon: '🔒' },
      // Secret scanner runs locally to detect token leaks before sharing logs.
      { nameKey: 'tool.secretScanner', path: '/secret-scanner', icon: '🕵️' },
      { nameKey: 'tool.envCrypto', path: '/env-crypto', icon: '🧾' },
      { nameKey: 'tool.sshKeys', path: '/ssh-keys', icon: '🗝️' },
      { nameKey: 'tool.saml', path: '/saml', icon: '🧩' },
      { nameKey: 'tool.oauth', path: '/oauth', icon: '🔑' },
      { nameKey: 'tool.webauthn', path: '/webauthn', icon: '🛡️' },
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
      { nameKey: 'tool.graphql', path: '/graphql', icon: '🔷' },
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
      { nameKey: 'tool.schemaToTs', path: '/schema-to-ts', icon: '🧬' },
      { nameKey: 'tool.openapi', path: '/openapi', icon: '📜' },
      { nameKey: 'tool.schemaMock', path: '/schema-mock', icon: '🧩' },
      { nameKey: 'tool.envManager', path: '/env-manager', icon: '⚙️' },
      // Env linter validates .env files for duplicates and missing values.
      { nameKey: 'tool.envLinter', path: '/env-linter', icon: '🧪' },
      // Env diff supports comparing environment files for deployment checks.
      { nameKey: 'tool.envDiff', path: '/env-diff', icon: '🧪' },
      { nameKey: 'tool.codeMinifier', path: '/code-minifier', icon: '📦' },
      { nameKey: 'tool.sqlBuilder', path: '/sql-builder', icon: '🗃️' },
      { nameKey: 'tool.jsonPath', path: '/json-path', icon: '🧭' },
      { nameKey: 'tool.schemaVisualizer', path: '/schema-visualizer', icon: '🗺️' },
      { nameKey: 'tool.sqlExplain', path: '/sql-explain', icon: '🧮' },
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
      { nameKey: 'tool.timezone', path: '/timezone', icon: '🕒' },
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
      // Log inspector helps filter and analyze local log files.
      { nameKey: 'tool.logInspector', path: '/log-inspector', icon: '🪵' },
      { nameKey: 'tool.logRedactor', path: '/log-redactor', icon: '🧹' },
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
      { nameKey: 'tool.securityHeaders', path: '/security-headers', icon: '🛡️' },
      { nameKey: 'tool.urlCleaner', path: '/url-cleaner', icon: '🧽' },
      // Cookie parser belongs with other HTTP helpers.
      { nameKey: 'tool.cookieParser', path: '/cookie-parser', icon: '🍪' },
      { nameKey: 'tool.httpBuilder', path: '/http-builder', icon: '🧪' },
      { nameKey: 'tool.websocket', path: '/websocket', icon: '🔌' },
      { nameKey: 'tool.sslCert', path: '/ssl-cert', icon: '🔐' },
      { nameKey: 'tool.dnsLookup', path: '/dns-lookup', icon: '🌐' },
      { nameKey: 'tool.dnsCompare', path: '/dns-compare', icon: '⚖️' },
      { nameKey: 'tool.sitemapAnalyzer', path: '/sitemap-analyzer', icon: '🗺️' },
      { nameKey: 'tool.certChain', path: '/cert-chain', icon: '🔐' },
      { nameKey: 'tool.robotsTester', path: '/robots-tester', icon: '🤖' },
      { nameKey: 'tool.cors', path: '/cors', icon: '🚦' },
      { nameKey: 'tool.latency', path: '/latency', icon: '📶' },
      { nameKey: 'tool.apiResponseTime', path: '/api-response-time', icon: '📈' },
      // HAR analyzer is offline-only and helps inspect captured network logs.
      { nameKey: 'tool.harAnalyzer', path: '/har-analyzer', icon: '📡' },
      { nameKey: 'tool.tlsDiagnostics', path: '/tls-diagnostics', icon: '🔐' },
      { nameKey: 'tool.grpcClient', path: '/grpc-client', icon: '📡' },
      { nameKey: 'tool.webhookTester', path: '/webhook-tester', icon: '🪝' },
      { nameKey: 'tool.networkPath', path: '/network-path', icon: '🛰️' },
      { nameKey: 'tool.paginationTester', path: '/pagination-tester', icon: '📄' },
    ]
  },
  {
    categoryKey: 'category.workflow',
    icon: '🧭',
    tools: [
      { nameKey: 'tool.commitMessage', path: '/commit-message', icon: '✅' },
      { nameKey: 'tool.dependencyChecker', path: '/dependency-checker', icon: '📦' },
      { nameKey: 'tool.regexDebugger', path: '/regex-debugger', icon: '🔍' },
      { nameKey: 'tool.patchViewer', path: '/patch-viewer', icon: '🩹' },
      { nameKey: 'tool.patchLinter', path: '/patch-linter', icon: '🧹' },
      { nameKey: 'tool.apiScenario', path: '/api-scenario', icon: '🧭' },
      { nameKey: 'tool.contractTester', path: '/contract-tester', icon: '📜' },
      { nameKey: 'tool.otelTrace', path: '/otel-trace', icon: '🧵' },
      { nameKey: 'tool.k8sValidator', path: '/k8s-validator', icon: '☸️' },
      { nameKey: 'tool.dockerfileLinter', path: '/dockerfile-linter', icon: '🐳' },
      { nameKey: 'tool.ghaLinter', path: '/github-actions-linter', icon: '🤖' },
      { nameKey: 'tool.terraformDiff', path: '/terraform-diff', icon: '🌍' },
      { nameKey: 'tool.changelogGenerator', path: '/changelog-generator', icon: '📝' },
      { nameKey: 'tool.gitConflict', path: '/git-conflict', icon: '⚔️' },
      { nameKey: 'tool.packageMerge', path: '/package-merge', icon: '📦' },
      { nameKey: 'tool.dockerCompose', path: '/docker-compose', icon: '🐳' },
      { nameKey: 'tool.terraformLinter', path: '/terraform-linter', icon: '🏗️' },
      { nameKey: 'tool.stackTrace', path: '/stack-trace', icon: '🔍' },
      { nameKey: 'tool.errorCode', path: '/error-code', icon: '❌' },
    ]
  },
  {
    categoryKey: 'category.files',
    icon: '🗂️',
    tools: [
      { nameKey: 'tool.exif', path: '/exif', icon: '📷' },
      { nameKey: 'tool.fileHash', path: '/file-hash', icon: '🔐' },
      { nameKey: 'tool.pdfMetadata', path: '/pdf-metadata', icon: '📄' },
      { nameKey: 'tool.favicon', path: '/favicon', icon: '🖼️' },
    ]
  },
  {
    categoryKey: 'category.frontend',
    icon: '🎨',
    tools: [
      { nameKey: 'tool.colorPalette', path: '/color-palette', icon: '🎨' },
      { nameKey: 'tool.layoutPlayground', path: '/layout-playground', icon: '📐' },
      { nameKey: 'tool.easing', path: '/easing', icon: '🧭' },
      { nameKey: 'tool.breakpointTester', path: '/breakpoint-tester', icon: '📱' },
      { nameKey: 'tool.lighthouseReport', path: '/lighthouse-report', icon: '🚦' },
      { nameKey: 'tool.visualDiff', path: '/visual-diff', icon: '🖼️' },
    ]
  }
]
