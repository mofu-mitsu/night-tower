import React from 'react';
import { motion } from 'motion/react';
import { TowerControl as Building2, Compass, Play, Sparkles, Volume2, VolumeX, Eye } from 'lucide-react';
import { sound } from '../utils/sound';

interface EntranceProps {
  onStart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Entrance: React.FC<EntranceProps> = ({ onStart, isMuted, onToggleMute }) => {
  const handleStart = () => {
    sound.playElevator();
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto text-center px-4 py-8 relative z-10"
    >
      {/* サウンドトグル */}
      <div className="flex justify-end mb-6">
        <button
          id="sound-toggle-btn"
          onClick={() => {
            sound.playClick();
            onToggleMute();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all cursor-pointer backdrop-blur"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          <span>{isMuted ? 'SOUND: OFF' : 'SOUND: ON'}</span>
        </button>
      </div>

      {/* ネオンロゴバッジ */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
      >
        <Building2 className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span>CYBERPUNK CHARACTER ATTRACTION</span>
      </motion.div>

      {/* メインタイトル */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-3"
      >
        NIGHT TOWER
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-base sm:text-lg text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 font-medium mb-8"
      >
        ──あなたは何階で、何者になる？──
      </motion.p>

      {/* 説明カード */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur-md mb-8 text-left text-slate-300 space-y-4 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl" />

        <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider">
          <Compass className="w-4 h-4" />
          <span>TOWER BRIEFING</span>
        </div>

        <p className="text-sm sm:text-base leading-relaxed text-slate-200">
          真夜中の街に忽然とそびえ立つ、8階建ての超高層タワー。
          問題に正解する必要はありません。各階で待ち受ける変な住人たちが仕掛ける
          <span className="text-pink-400 font-semibold">「理不尽ミニゲーム」</span>
          をどう攻略し、どう振る舞ったか──その軌跡によって、最上階であなたの正体と
          <span className="text-cyan-400 font-semibold">「あなたの塔」</span>
          が判定されます。
        </p>

        {/* 階層チラ見せグリッド */}
        <div className="grid grid-cols-4 gap-2 pt-2 text-center text-xs font-mono">
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-slate-400">
            <div className="text-slate-200">1F 📦</div>
            <div className="text-[10px] text-slate-400 truncate">決断</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-pink-400">
            <div>2F 🥺</div>
            <div className="text-[10px] truncate">承認</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-cyan-400">
            <div>3F 🐦</div>
            <div className="text-[10px] truncate">理不尽</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-amber-400">
            <div>4F 🐷</div>
            <div className="text-[10px] truncate">防衛</div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-emerald-400">
            <div>5F 💪</div>
            <div className="text-[10px] truncate">エネルギー</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-purple-400">
            <div>6F 🦗</div>
            <div className="text-[10px] truncate">リズム</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-teal-400">
            <div>7F 🌱</div>
            <div className="text-[10px] truncate">概念再構築</div>
          </div>
          <div className="bg-slate-950/60 p-2 rounded border border-slate-800 text-blue-400">
            <div>8F 🐛</div>
            <div className="text-[10px] truncate">論理の羽化</div>
          </div>
        </div>
      </motion.div>

      {/* スタートボタン */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <button
          id="enter-tower-button"
          onClick={handleStart}
          className="group relative inline-flex items-center gap-3 px-8 py-5 rounded-2xl font-black text-amber-950 bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-500 hover:from-yellow-100 hover:via-amber-300 hover:to-yellow-400 transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] border border-amber-200/50 cursor-pointer text-lg active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <Play className="w-5 h-5 fill-amber-950 text-amber-950 group-hover:translate-x-0.5 transition-transform relative z-10" />
          <span className="relative z-10 tracking-widest drop-shadow-sm">エレベーターに搭乗する</span>
          <Sparkles className="w-5 h-5 text-amber-700 animate-spin relative z-10" style={{ animationDuration: '6s' }} />
        </button>
        <div className="mt-4 text-xs font-mono text-slate-400 flex items-center justify-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          <span>全8フロア ＋ 屋上判定 / 所要時間 約3〜5分</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
