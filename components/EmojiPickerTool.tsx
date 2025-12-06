'use client'

import { useState } from 'react'
import ToolCard from './ToolCard'

const EMOJI_CATEGORIES = {
  'Smileys': ['😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳'],
  'Gestures': ['👍', '👎', '👌', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '👇', '☝️', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💪', '🦾', '🦿', '🦵', '🦶'],
  'Hearts': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗'],
  'Food': ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅'],
  'Objects': ['💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '💾', '💿', '📱', '☎️', '📞', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳'],
  'Symbols': ['❤️', '💯', '✨', '⭐', '🌟', '💫', '🔥', '💥', '💢', '💦', '💨', '🕳️', '💬', '🗨️', '🗯️', '💭', '💤', '🚀', '⚡', '☀️', '🌙', '⭐', '🌈', '☁️', '⛅'],
}

export default function EmojiPickerTool() {
  const [selected, setSelected] = useState('')
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState(false)

  const copyEmoji = (emoji: string) => {
    navigator.clipboard.writeText(emoji)
    setSelected(emoji)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getUnicode = (emoji: string) => {
    return Array.from(emoji)
      .map(char => 'U+' + char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, '0'))
      .join(' ')
  }

  return (
    <ToolCard
      title="Emoji Picker"
      description="이모지를 선택하고 복사하세요"
    >
      <div className="space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="이모지 검색..."
        />

        {selected && (
          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg text-center">
            <div className="text-7xl mb-3">{selected}</div>
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Unicode: {getUnicode(selected)}
            </div>
            {copied && (
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ 클립보드에 복사되었습니다!
              </div>
            )}
          </div>
        )}

        <div className="space-y-6">
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">{category}</h3>
              <div className="grid grid-cols-8 md:grid-cols-12 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => copyEmoji(emoji)}
                    className="text-3xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    title={`Copy ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolCard>
  )
}
