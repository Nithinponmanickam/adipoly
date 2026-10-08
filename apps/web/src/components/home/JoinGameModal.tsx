import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore.js';
import { X, LogIn, KeyRound, User } from 'lucide-react';
import { motion } from 'framer-motion';

export const JoinGameModal: React.FC = () => {
  const { setActiveModal, joinRoom, isLoading } = useGameStore();
  const [roomCode, setRoomCode] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Force uppercase and limit to 5 chars
    const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    setRoomCode(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomCode.trim() || !displayName.trim()) return;

    await joinRoom(roomCode.trim(), displayName.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.95, rotate: 2 }}
        className="neo-brutal bg-surface w-full max-w-md overflow-hidden relative"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-border bg-primary">
          <div className="flex items-center gap-4">
            <LogIn className="w-8 h-8 stroke-[3] text-black" />
            <div>
              <h2 className="text-3xl font-display font-black text-black tracking-widest uppercase">Join Room</h2>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="neo-brutal bg-white p-2 hover:bg-danger hover:text-white transition-colors"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-background">
          {/* Room Code */}
          <div>
            <label className="block text-sm font-black uppercase tracking-widest text-text mb-2 flex items-center gap-2">
              <KeyRound className="w-5 h-5 stroke-[3] text-accent" />
              Room Code
            </label>
            <input
              type="text"
              required
              autoFocus
              maxLength={5}
              placeholder="e.g. A7K9Q"
              value={roomCode}
              onChange={handleRoomCodeChange}
              className="neo-brutal w-full bg-white px-6 py-4 font-display font-black text-4xl tracking-[0.25em] text-center uppercase placeholder:text-gray-300 focus:outline-none focus:ring-4 focus:ring-accent transition"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-sm font-black uppercase tracking-widest text-text mb-2 flex items-center gap-2">
              <User className="w-5 h-5 stroke-[3] text-success" />
              Display Name
            </label>
            <input
              type="text"
              required
              maxLength={20}
              placeholder="e.g. Arun, Priya, Alex"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="neo-brutal w-full bg-white px-6 py-4 font-bold text-xl text-text placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-success transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || roomCode.length < 5 || !displayName.trim()}
            className="neo-brutal w-full py-5 px-6 mt-4 font-black text-2xl text-black bg-primary hover:bg-yellow-400 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(17,24,39,1)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 uppercase"
          >
            {isLoading ? 'Connecting...' : 'ENTER LOBBY'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};
