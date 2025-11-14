'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

export default function IPCalculatorTool() {
  const [ip, setIp] = useState('192.168.1.0')
  const [cidr, setCidr] = useState('24')
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const ipToInt = (ip: string): number => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet), 0) >>> 0
  }

  const intToIp = (int: number): string => {
    return [
      (int >>> 24) & 0xff,
      (int >>> 16) & 0xff,
      (int >>> 8) & 0xff,
      int & 0xff
    ].join('.')
  }

  const calculate = () => {
    try {
      setError('')

      // Validate IP
      const ipParts = ip.split('.')
      if (ipParts.length !== 4 || ipParts.some(p => isNaN(parseInt(p)) || parseInt(p) < 0 || parseInt(p) > 255)) {
        setError('올바른 IP 주소를 입력하세요 (예: 192.168.1.0)')
        return
      }

      // Validate CIDR
      const cidrNum = parseInt(cidr)
      if (isNaN(cidrNum) || cidrNum < 0 || cidrNum > 32) {
        setError('CIDR은 0-32 사이의 숫자여야 합니다')
        return
      }

      const ipInt = ipToInt(ip)
      const maskInt = (0xffffffff << (32 - cidrNum)) >>> 0
      const networkInt = (ipInt & maskInt) >>> 0
      const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0
      const firstHostInt = networkInt + 1
      const lastHostInt = broadcastInt - 1
      const totalHosts = Math.pow(2, 32 - cidrNum)
      const usableHosts = cidrNum === 31 ? 2 : (cidrNum === 32 ? 1 : totalHosts - 2)

      setResult({
        network: intToIp(networkInt),
        broadcast: intToIp(broadcastInt),
        firstHost: intToIp(firstHostInt),
        lastHost: intToIp(lastHostInt),
        subnetMask: intToIp(maskInt),
        wildcardMask: intToIp(~maskInt >>> 0),
        totalHosts,
        usableHosts,
        cidr: cidrNum,
        ipClass: getIpClass(ipParts[0])
      })
    } catch (e) {
      setError('계산 중 오류가 발생했습니다')
    }
  }

  const getIpClass = (firstOctet: string): string => {
    const num = parseInt(firstOctet)
    if (num >= 1 && num <= 126) return 'A'
    if (num >= 128 && num <= 191) return 'B'
    if (num >= 192 && num <= 223) return 'C'
    if (num >= 224 && num <= 239) return 'D (Multicast)'
    if (num >= 240 && num <= 255) return 'E (Reserved)'
    return 'Unknown'
  }

  return (
    <ToolCard
      title="🌐 IP/CIDR Calculator"
      description="IP 서브넷 계산기"
    >
      <div className="space-y-4">
        {/* Input */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              IP Address
            </label>
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="192.168.1.0"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200 font-mono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CIDR Prefix
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={cidr}
                onChange={(e) => setCidr(e.target.value)}
                min="0"
                max="32"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-gray-200 font-mono"
              />
              <button
                onClick={calculate}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
              >
                Calculate
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Network Address</div>
                <div className="text-lg font-mono font-bold text-gray-800 dark:text-white">
                  {result.network}/{result.cidr}
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Broadcast Address</div>
                <div className="text-lg font-mono font-bold text-gray-800 dark:text-white">
                  {result.broadcast}
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">First Usable Host</div>
                <div className="text-lg font-mono font-bold text-gray-800 dark:text-white">
                  {result.firstHost}
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Usable Host</div>
                <div className="text-lg font-mono font-bold text-gray-800 dark:text-white">
                  {result.lastHost}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Subnet Mask:</span>
                  <span className="ml-2 font-mono text-gray-800 dark:text-white">{result.subnetMask}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Wildcard Mask:</span>
                  <span className="ml-2 font-mono text-gray-800 dark:text-white">{result.wildcardMask}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Hosts:</span>
                  <span className="ml-2 font-mono text-gray-800 dark:text-white">{result.totalHosts.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Usable Hosts:</span>
                  <span className="ml-2 font-mono text-gray-800 dark:text-white">{result.usableHosts.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">IP Class:</span>
                  <span className="ml-2 font-mono text-gray-800 dark:text-white">Class {result.ipClass}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Common CIDR Reference */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-3">
            📖 자주 사용하는 CIDR
          </h3>
          <div className="grid md:grid-cols-3 gap-2 text-sm">
            <div className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">
              /24 = 255.255.255.0 (254 hosts)
            </div>
            <div className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">
              /16 = 255.255.0.0 (65,534 hosts)
            </div>
            <div className="font-mono bg-white dark:bg-gray-900 px-2 py-1 rounded">
              /8 = 255.0.0.0 (16M hosts)
            </div>
          </div>
        </div>
      </div>
    </ToolCard>
  )
}
