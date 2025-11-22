'use client'

import { useMemo, useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

type LanguageId = 'node' | 'python' | 'go' | 'java'

type Snippet = {
  key: string
  titleKey: string
  descKey: string
  languages: {
    id: LanguageId
    labelKey: string
    code: string
  }[]
}

const snippets: Snippet[] = [
  {
    key: 'base64',
    titleKey: 'snippets.base64.title',
    descKey: 'snippets.base64.desc',
    languages: [
      {
        id: 'node',
        labelKey: 'snippets.lang.node',
        code: `// Node.js: Buffer 기반 Base64 인코딩/디코딩
const text = 'hello world'
const encoded = Buffer.from(text, 'utf8').toString('base64')
const decoded = Buffer.from(encoded, 'base64').toString('utf8')

console.log({ encoded, decoded })`,
      },
      {
        id: 'python',
        labelKey: 'snippets.lang.python',
        code: `# Python: base64 모듈로 인코딩/디코딩
import base64

text = 'hello world'
encoded = base64.b64encode(text.encode('utf-8')).decode('utf-8')
decoded = base64.b64decode(encoded).decode('utf-8')

print({'encoded': encoded, 'decoded': decoded})`,
      },
      {
        id: 'go',
        labelKey: 'snippets.lang.go',
        code: `// Go: 표준 라이브러리 encoding/base64 사용
package main

import (
  "encoding/base64"
  "fmt"
)

func main() {
  text := "hello world"
  encoded := base64.StdEncoding.EncodeToString([]byte(text))
  decodedBytes, _ := base64.StdEncoding.DecodeString(encoded)
  fmt.Println(encoded, string(decodedBytes))
}`,
      },
    ],
  },
  {
    key: 'jwt',
    titleKey: 'snippets.jwt.title',
    descKey: 'snippets.jwt.desc',
    languages: [
      {
        id: 'node',
        labelKey: 'snippets.lang.node',
        code: `// Node.js: 필수 클레임 검증 + HS256 서명
import jwt from 'jsonwebtoken'

const token = jwt.sign(
  { sub: 'user-123', iss: 'dev-tools', aud: 'dev-tools', exp: Math.floor(Date.now() / 1000) + 300 },
  process.env.JWT_SECRET!,
  { algorithm: 'HS256', keyid: 'v1' }
)

jwt.verify(token, process.env.JWT_SECRET!, {
  issuer: 'dev-tools',
  audience: 'dev-tools',
})`,
      },
      {
        id: 'java',
        labelKey: 'snippets.lang.java',
        code: `// Java(Spring): jjwt로 검증 예제
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

String secret = System.getenv("JWT_SECRET");
String token = Jwts.builder()
    .setSubject("user-123")
    .setIssuer("dev-tools")
    .setAudience("dev-tools")
    .setExpiration(new Date(System.currentTimeMillis() + 5 * 60 * 1000))
    .signWith(SignatureAlgorithm.HS256, secret.getBytes())
    .compact();

Jwts.parser()
    .setSigningKey(secret.getBytes())
    .requireIssuer("dev-tools")
    .requireAudience("dev-tools")
    .parseClaimsJws(token);`,
      },
      {
        id: 'go',
        labelKey: 'snippets.lang.go',
        code: `// Go: golang-jwt로 서명/검증
package main

import (
  "fmt"
  "time"

  "github.com/golang-jwt/jwt/v5"
)

func main() {
  secret := []byte("change-me")
  token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
    "sub": "user-123",
    "iss": "dev-tools",
    "aud": "dev-tools",
    "exp": time.Now().Add(5 * time.Minute).Unix(),
  })
  signed, _ := token.SignedString(secret)

  parsed, err := jwt.Parse(signed, func(t *jwt.Token) (interface{}, error) { return secret, nil })
  fmt.Println("token", signed, "err", err, "claims", parsed.Claims)
}`,
      },
    ],
  },
  {
    key: 'csv',
    titleKey: 'snippets.csv.title',
    descKey: 'snippets.csv.desc',
    languages: [
      {
        id: 'python',
        labelKey: 'snippets.lang.python',
        code: `# Python: BOM 제거 + 헤더 검증 + JSON 변환
import csv, json

def convert(path):
    with open(path, 'r', encoding='utf-8-sig', newline='') as f:
        reader = csv.DictReader(f)
        if not reader.fieldnames:
            raise ValueError('Missing header row')
        rows = [row for row in reader]
        return json.dumps(rows, ensure_ascii=False, indent=2)

print(convert('data.csv'))`,
      },
      {
        id: 'node',
        labelKey: 'snippets.lang.node',
        code: `// Node.js: csv-parse로 BOM 제거 후 JSON 변환
import { parse } from 'csv-parse/sync'
import fs from 'node:fs'

const raw = fs.readFileSync('data.csv')
const cleaned = raw[0] === 0xef ? raw.slice(3) : raw
const records = parse(cleaned, { columns: true, skip_empty_lines: true })
console.log(JSON.stringify(records, null, 2))`,
      },
      {
        id: 'go',
        labelKey: 'snippets.lang.go',
        code: `// Go: encoding/csv로 헤더 검증 후 JSON 변환
package main

import (
  "encoding/csv"
  "encoding/json"
  "fmt"
  "os"
)

func main() {
  f, _ := os.Open("data.csv")
  defer f.Close()

  r := csv.NewReader(f)
  header, _ := r.Read()
  if len(header) == 0 {
    panic("missing header")
  }
  var rows []map[string]string
  for {
    record, err := r.Read()
    if err != nil {
      break
    }
    row := map[string]string{}
    for i, h := range header {
      row[h] = record[i]
    }
    rows = append(rows, row)
  }
  out, _ := json.MarshalIndent(rows, "", "  ")
  fmt.Println(string(out))
}`,
      },
    ],
  },
  {
    key: 'regex',
    titleKey: 'snippets.regex.title',
    descKey: 'snippets.regex.desc',
    languages: [
      {
        id: 'node',
        labelKey: 'snippets.lang.node',
        code: `// JavaScript: URL 유효성 검사 + 길이 제한으로 ReDoS 방지
const urlPattern = /^(https?:\\/\\/)([\\w.-]+)(:[0-9]+)?(\\/.*)?$/i

function isSafeUrl(value) {
  if (value.length > 2048) return false
  return urlPattern.test(value)
}

console.log(isSafeUrl('https://example.com'))`,
      },
      {
        id: 'python',
        labelKey: 'snippets.lang.python',
        code: `# Python: 정규식 timeout과 길이 제한으로 ReDoS 방지
import re, signal

url_pattern = re.compile(r'^(https?://)([\\w.-]+)(:[0-9]+)?(/.*)?$', re.IGNORECASE)

def is_safe_url(value: str) -> bool:
    if len(value) > 2048:
        return False
    return bool(url_pattern.match(value))

print(is_safe_url('https://example.com'))`,
      },
    ],
  },
  {
    key: 'hash',
    titleKey: 'snippets.hash.title',
    descKey: 'snippets.hash.desc',
    languages: [
      {
        id: 'node',
        labelKey: 'snippets.lang.node',
        code: `// Node.js: crypto로 SHA-256 해시 생성 (hex)
import crypto from 'node:crypto'

function sha256(value) {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex')
}

console.log(sha256('secret'))`,
      },
      {
        id: 'python',
        labelKey: 'snippets.lang.python',
        code: `# Python: hashlib로 SHA-256 해시 생성
import hashlib

def sha256(value: str) -> str:
    return hashlib.sha256(value.encode('utf-8')).hexdigest()

print(sha256('secret'))`,
      },
      {
        id: 'go',
        labelKey: 'snippets.lang.go',
        code: `// Go: crypto/sha256 + hex 인코딩
package main

import (
  "crypto/sha256"
  "encoding/hex"
  "fmt"
)

func sha256sum(value string) string {
  h := sha256.Sum256([]byte(value))
  return hex.EncodeToString(h[:])
}

func main() {
  fmt.Println(sha256sum("secret"))
}`,
      },
    ],
  },
  {
    key: 'timestamp',
    titleKey: 'snippets.timestamp.title',
    descKey: 'snippets.timestamp.desc',
    languages: [
      {
        id: 'node',
        labelKey: 'snippets.lang.node',
        code: `// Node.js: Unix 타임 ↔ ISO 변환 (UTC 기준)
const now = Date.now()
const seconds = Math.floor(now / 1000)
const iso = new Date(seconds * 1000).toISOString()
console.log({ seconds, iso })`,
      },
      {
        id: 'python',
        labelKey: 'snippets.lang.python',
        code: `# Python: datetime으로 타임스탬프 변환 (UTC)
from datetime import datetime, timezone

seconds = int(datetime.now(tz=timezone.utc).timestamp())
iso = datetime.fromtimestamp(seconds, tz=timezone.utc).isoformat()
print({'seconds': seconds, 'iso': iso})`,
      },
    ],
  },
  {
    key: 'sql',
    titleKey: 'snippets.sql.title',
    descKey: 'snippets.sql.desc',
    languages: [
      {
        id: 'node',
        labelKey: 'snippets.lang.node',
        code: `// Node.js: pg로 파라미터 바인딩 (SQL 인젝션 방지)
import { Pool } from 'pg'
const pool = new Pool()

async function findUser(email) {
  const { rows } = await pool.query('SELECT id, email FROM users WHERE email = $1', [email])
  return rows
}
findUser('test@example.com').then(console.log)`,
      },
      {
        id: 'java',
        labelKey: 'snippets.lang.java',
        code: `// Java(Spring): JdbcTemplate로 prepared statement
@Autowired
private JdbcTemplate jdbc;

public List<User> findUser(String email) {
    return jdbc.query(
        "SELECT id, email FROM users WHERE email = ?",
        (rs, rowNum) -> new User(rs.getLong("id"), rs.getString("email")),
        email
    );
}`,
      },
      {
        id: 'python',
        labelKey: 'snippets.lang.python',
        code: `# Python: psycopg2로 파라미터 바인딩
import psycopg2

conn = psycopg2.connect("")
with conn, conn.cursor() as cur:
    cur.execute("SELECT id, email FROM users WHERE email = %s", ('test@example.com',))
    print(cur.fetchall())`,
      },
    ],
  },
]

export default function SnippetsContent() {
  const { t } = useLanguage()
  const [selectedLanguage, setSelectedLanguage] = useState<Record<string, LanguageId>>({})

  const getLanguage = (snippet: Snippet): LanguageId => {
    return selectedLanguage[snippet.key] || snippet.languages[0].id
  }

  const onChangeLanguage = (snippetKey: string, id: LanguageId) => {
    setSelectedLanguage((prev) => ({ ...prev, [snippetKey]: id }))
  }

  const selectedSnippets = useMemo(() => {
    return snippets.map((snippet) => {
      const lang = getLanguage(snippet)
      const selected = snippet.languages.find((l) => l.id === lang) ?? snippet.languages[0]
      return { snippet, selected }
    })
  }, [selectedLanguage])

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-8">
        <p className="inline-flex items-center text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-2">
          {t('nav.snippets')}
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {t('snippets.title')}
        </h1>
        <p className="text-gray-700 dark:text-gray-300">
          {t('snippets.subtitle')}
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        {selectedSnippets.map(({ snippet, selected }) => (
          <article
            key={snippet.key}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t(snippet.titleKey)}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t(snippet.descKey)}
                </p>
              </div>
              <label className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span>{t('snippets.language.label')}</span>
                <select
                  value={selected.id}
                  onChange={(e) => onChangeLanguage(snippet.key, e.target.value as LanguageId)}
                  className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm px-2 py-1"
                >
                  {snippet.languages.map((language) => (
                    <option key={language.id} value={language.id}>
                      {t(language.labelKey)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <pre className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-3 text-xs md:text-sm text-gray-800 dark:text-gray-200 overflow-auto">
              <code>{selected.code}</code>
            </pre>
          </article>
        ))}
      </section>
    </div>
  )
}
