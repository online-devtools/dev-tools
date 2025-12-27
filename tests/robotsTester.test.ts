import { describe, expect, it } from 'vitest'
import { RobotsTxtError, testRobotsTxt } from '@/utils/robotsTester'

// Robots.txt tester should follow longest match rules per user-agent.
describe('robotsTester utils', () => {
  it('matches specific user-agent groups and respects allow/disallow', () => {
    const robots = [
      'User-agent: *',
      'Disallow: /admin',
      'Allow: /admin/help',
      '',
      'User-agent: Googlebot',
      'Disallow: /private',
    ].join('\n')

    const googleResult = testRobotsTxt(robots, 'Googlebot', '/private/data')
    const publicResult = testRobotsTxt(robots, 'Googlebot', '/public')
    const allowResult = testRobotsTxt(robots, 'Bingbot', '/admin/help')
    const disallowResult = testRobotsTxt(robots, 'Bingbot', 'https://example.com/admin')

    expect(googleResult.allowed).toBe(false)
    expect(publicResult.allowed).toBe(true)
    expect(allowResult.allowed).toBe(true)
    expect(disallowResult.allowed).toBe(false)
  })

  it('returns allowed when no rules match', () => {
    const robots = ['User-agent: *', 'Disallow: /tmp'].join('\n')
    const result = testRobotsTxt(robots, '*', '/public')

    expect(result.allowed).toBe(true)
    expect(result.reason).toBe('noMatch')
  })

  it('throws on empty input', () => {
    expect(() => testRobotsTxt('', '*', '/')).toThrow(RobotsTxtError)
  })
})
