'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface FavoritesContextType {
  favorites: string[]
  recentTools: string[]
  toggleFavorite: (path: string) => void
  addToRecent: (path: string) => void
  isFavorite: (path: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const FAVORITES_KEY = 'dev-tools-favorites'
const RECENT_KEY = 'dev-tools-recent'
const MAX_RECENT = 5

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [recentTools, setRecentTools] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_KEY)
      const savedRecent = localStorage.getItem(RECENT_KEY)

      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
      if (savedRecent) {
        setRecentTools(JSON.parse(savedRecent))
      }
    } catch (error) {
      console.error('Failed to load favorites/recent from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save favorites to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Failed to save favorites to localStorage:', error)
      }
    }
  }, [favorites, isLoaded])

  // Save recent tools to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(recentTools))
      } catch (error) {
        console.error('Failed to save recent tools to localStorage:', error)
      }
    }
  }, [recentTools, isLoaded])

  const toggleFavorite = useCallback((path: string) => {
    setFavorites(prev => {
      if (prev.includes(path)) {
        return prev.filter(p => p !== path)
      } else {
        return [...prev, path]
      }
    })
  }, [])

  const addToRecent = useCallback((path: string) => {
    setRecentTools(prev => {
      // Remove if already exists
      const filtered = prev.filter(p => p !== path)
      // Add to front and limit to MAX_RECENT
      return [path, ...filtered].slice(0, MAX_RECENT)
    })
  }, [])

  const isFavorite = useCallback((path: string) => favorites.includes(path), [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, recentTools, toggleFavorite, addToRecent, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
