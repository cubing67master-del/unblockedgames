/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Search, Gamepad2, X, Maximize2, TrendingUp, Grid2X2, Info, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';

interface Game {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  iframeUrl: string;
}

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const categories = useMemo(() => {
    const cats = ['All', ...new Set(gamesData.map(g => g.category))];
    return cats;
  }, []);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleGameClick = (game: Game) => {
    setSelectedGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const closePlayer = () => {
    setSelectedGame(null);
    setIsFullscreen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gaming-dark/80 backdrop-blur-md border-b border-gaming-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setSelectedGame(null)}>
            <div className="p-2 bg-gaming-neon rounded-lg group-hover:rotate-12 transition-transform">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">NOVA<span className="text-gaming-neon">GAMES</span></span>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search unblocked games..."
              className="w-full bg-gaming-card border border-gaming-border rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-gaming-neon transition-colors text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-gaming-neon transition-colors">Popular</a>
            <a href="#" className="hover:text-gaming-neon transition-colors">New</a>
            <a href="#" className="hover:text-gaming-neon transition-colors">About</a>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="player"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={closePlayer}
                    className="p-2 hover:bg-gaming-card rounded-lg transition-colors border border-transparent hover:border-gaming-border"
                  >
                    <X className="w-6 h-6" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold">{selectedGame.title}</h1>
                    <p className="text-zinc-500 text-sm">{selectedGame.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="flex items-center gap-2 px-4 py-2 bg-gaming-card border border-gaming-border rounded-xl hover:border-gaming-neon transition-colors text-sm"
                  >
                    <Maximize2 className="w-4 h-4" />
                    Fullscreen
                  </button>
                </div>
              </div>

              <div className={`relative glass-panel aspect-video bg-black shadow-2xl ${isFullscreen ? 'fixed inset-0 z-[100] rounded-none' : ''}`}>
                {isFullscreen && (
                  <button 
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 z-[110] p-2 bg-black/50 hover:bg-black rounded-full text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  allowFullScreen
                  title={selectedGame.title}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Info className="w-5 h-5 text-gaming-neon" />
                      About {selectedGame.title}
                    </h2>
                    <p className="text-zinc-400 leading-relaxed">
                      Experience {selectedGame.title} unblocked on Nova Games. This {selectedGame.category.toLowerCase()} game is optimized for performance and works directly in your browser without any downloads. Perfect for quick gaming sessions during breaks.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="glass-panel p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-gaming-neon" />
                      Stats
                    </h2>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between border-b border-gaming-border pb-2">
                        <span className="text-zinc-500">Plays</span>
                        <span className="font-mono">1.2M+</span>
                      </div>
                      <div className="flex justify-between border-b border-gaming-border pb-2">
                        <span className="text-zinc-500">Rating</span>
                        <span className="font-mono text-gaming-neon">4.8/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Updated</span>
                        <span className="font-mono">2 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gaming-card to-gaming-dark border border-gaming-border p-8 md:p-12">
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gaming-neon/10 border border-gaming-neon/20 text-gaming-neon text-xs font-bold uppercase tracking-wider mb-6">
                    <TrendingUp className="w-3 h-3" />
                    Trending Now
                  </div>
                  <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 leading-tight">
                    UNBLOCKED GAMES <br />
                    <span className="text-gaming-neon">WITHOUT LIMITS.</span>
                  </h2>
                  <p className="text-zinc-400 text-lg mb-8 max-w-lg">
                    Access the best curated collection of unblocked web games. Fast, free, and always available.
                  </p>
                  <button 
                    onClick={() => handleGameClick(gamesData[0])}
                    className="px-8 py-4 bg-gaming-neon text-black font-bold rounded-xl hover:scale-105 transition-transform neon-glow"
                  >
                    Play Featured: {gamesData[0].title}
                  </button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-gaming-neon/5 to-transparent hidden md:block" />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                      selectedCategory === cat
                        ? 'bg-gaming-neon text-black border-gaming-neon'
                        : 'bg-gaming-card text-zinc-400 border-gaming-border hover:border-zinc-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Games Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {filteredGames.map((game, idx) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleGameClick(game)}
                    className="group cursor-pointer"
                  >
                    <div className="glass-panel aspect-[4/3] relative mb-3 neon-glow-hover transition-all">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <div className="flex items-center gap-2 text-gaming-neon text-xs font-bold uppercase">
                          <Gamepad2 className="w-4 h-4" />
                          Play Now
                        </div>
                      </div>
                    </div>
                    <h3 className="font-bold text-sm md:text-base group-hover:text-gaming-neon transition-colors truncate">
                      {game.title}
                    </h3>
                    <p className="text-zinc-500 text-xs">{game.category}</p>
                  </motion.div>
                ))}
              </div>

              {filteredGames.length === 0 && (
                <div className="text-center py-20">
                  <Grid2X2 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-zinc-500">No games found</h3>
                  <p className="text-zinc-600">Try adjusting your search or category filter</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-gaming-border mt-20 py-12 px-6 bg-gaming-card/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-gaming-neon rounded-md">
                <Gamepad2 className="w-4 h-4 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter">NOVA<span className="text-gaming-neon">GAMES</span></span>
            </div>
            <p className="text-zinc-500 text-sm">
              The ultimate destination for unblocked web games. Built for speed, privacy, and fun.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-zinc-400">Categories</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-gaming-neon transition-colors">Action</a></li>
              <li><a href="#" className="hover:text-gaming-neon transition-colors">Arcade</a></li>
              <li><a href="#" className="hover:text-gaming-neon transition-colors">Shooter</a></li>
              <li><a href="#" className="hover:text-gaming-neon transition-colors">Sports</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-zinc-400">Support</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><a href="#" className="hover:text-gaming-neon transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-gaming-neon transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-gaming-neon transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-gaming-neon transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-zinc-400">Connect</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gaming-card border border-gaming-border rounded-lg hover:border-gaming-neon transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-gaming-card border border-gaming-border rounded-lg hover:border-gaming-neon transition-colors">
                <Info className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gaming-border text-center text-zinc-600 text-xs">
          © 2024 Nova Games. All rights reserved. Games are property of their respective owners.
        </div>
      </footer>
    </div>
  );
}
