import GitHooksTool from '@/components/GitHooksTool'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Git Hooks Generator - Pre-commit, Pre-push Scripts',
  description: 'Generate Git hook scripts for pre-commit, commit-msg, pre-push, and more. Enforce linting, testing, conventional commits, and branch protection.',
  keywords: ['git hooks', 'pre-commit', 'pre-push', 'commit-msg', 'husky', 'lint-staged', 'conventional commits'],
  openGraph: {
    title: 'Git Hooks Generator - Developer Tools',
    description: 'Generate Git hook scripts easily',
  },
}

export default function GitHooksPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <GitHooksTool />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Git Hooks Guide
        </h2>

        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              What are Git Hooks?
            </h3>
            <p className="leading-relaxed">
              Git hooks are scripts that Git executes before or after events such as commit, push, and merge.
              They allow you to automate tasks and enforce policies in your development workflow.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Hook Types
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-blue-600 mb-1">pre-commit</p>
                <p className="text-sm">Runs before commit. Use for linting, formatting, and validation.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-green-600 mb-1">commit-msg</p>
                <p className="text-sm">Validates commit message format (e.g., Conventional Commits).</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-purple-600 mb-1">pre-push</p>
                <p className="text-sm">Runs before push. Use for tests and branch protection.</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <p className="font-semibold text-orange-600 mb-1">post-merge</p>
                <p className="text-sm">Runs after merge. Use for auto npm install on package changes.</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Manual Installation
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-2">
              <p><span className="text-green-600"># Navigate to hooks directory</span></p>
              <p>cd .git/hooks</p>
              <p><span className="text-green-600"># Create hook file</span></p>
              <p>touch pre-commit</p>
              <p><span className="text-green-600"># Make executable</span></p>
              <p>chmod +x pre-commit</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Using Husky (Recommended)
            </h3>
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg font-mono text-sm space-y-2">
              <p><span className="text-green-600"># Install husky</span></p>
              <p>npm install husky --save-dev</p>
              <p><span className="text-green-600"># Initialize husky</span></p>
              <p>npx husky init</p>
              <p><span className="text-green-600"># Add pre-commit hook</span></p>
              <p>echo &quot;npm run lint&quot; &gt; .husky/pre-commit</p>
            </div>
          </section>

          <section className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Related Tools
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <a href="/commit-message" className="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                <p className="font-semibold text-blue-600 dark:text-blue-400 mb-1">Commit Message Generator</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Generate conventional commit messages</p>
              </a>
              <a href="/gitignore-generator" className="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                <p className="font-semibold text-green-600 dark:text-green-400 mb-1">.gitignore Generator</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">Generate .gitignore files</p>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
