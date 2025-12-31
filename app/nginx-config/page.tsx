import NginxConfigTool from '@/components/NginxConfigTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nginx Config Generator - Server Configuration Tool',
  description: 'Generate Nginx server configuration files. Support for SSL, reverse proxy, gzip compression, static file caching, and CORS headers.',
  keywords: ['nginx', 'config', 'generator', 'server', 'reverse proxy', 'SSL', 'web server', 'configuration'],
  openGraph: {
    title: 'Nginx Config Generator - Developer Tools',
    description: 'Generate Nginx server configurations easily',
  },
}

export default function NginxConfigPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <NginxConfigTool />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Nginx Configuration Guide
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Configuration File Location
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-1">
              <p># Main config: /etc/nginx/nginx.conf</p>
              <p># Site configs: /etc/nginx/sites-available/</p>
              <p># Enabled sites: /etc/nginx/sites-enabled/</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Common Commands
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-2">
              <p><span className="text-green-600"># Test configuration</span></p>
              <p>sudo nginx -t</p>
              <p><span className="text-green-600"># Reload configuration</span></p>
              <p>sudo systemctl reload nginx</p>
              <p><span className="text-green-600"># Restart Nginx</span></p>
              <p>sudo systemctl restart nginx</p>
              <p><span className="text-green-600"># Enable site</span></p>
              <p>sudo ln -s /etc/nginx/sites-available/mysite /etc/nginx/sites-enabled/</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              SSL with Let&apos;s Encrypt
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-2">
              <p><span className="text-green-600"># Install Certbot</span></p>
              <p>sudo apt install certbot python3-certbot-nginx</p>
              <p><span className="text-green-600"># Obtain certificate</span></p>
              <p>sudo certbot --nginx -d example.com -d www.example.com</p>
              <p><span className="text-green-600"># Auto-renewal</span></p>
              <p>sudo certbot renew --dry-run</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Best Practices
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Always test configuration before reloading: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">nginx -t</code></li>
              <li>Use HTTPS with HTTP/2 for better performance</li>
              <li>Enable gzip compression for text-based content</li>
              <li>Set appropriate cache headers for static files</li>
              <li>Configure security headers (X-Frame-Options, CSP, etc.)</li>
              <li>Use separate log files for each virtual host</li>
            </ul>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Related Tools
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/systemd-generator" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Systemd Generator</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Generate systemd service files</p>
              </a>
              <a href="/ssl-cert" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">SSL Certificate Decoder</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Analyze SSL certificates</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
