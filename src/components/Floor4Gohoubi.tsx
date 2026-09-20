import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Soup, PlusCircle } from 'lucide-react';
import { TowerParameters, GlobalState } from '../types';
import { sound } from '../utils/sound';
import tonkotsuImg from '../assets/images/tonkotsu_soup_1789481881451.jpg';
import gohobiImg from '../assets/images/gohobi.png';

interface Floor4GohoubiProps {
  onComplete: (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => void;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

export const Floor4Gohoubi: React.FC<Floor4GohoubiProps> = ({ onComplete, setGlobalState }) => {
  const [phase, setPhase] = useState<'soup_game' | 'cleared'>('soup_game');
  const [soupIngredients, setSoupIngredients] = useState<string[]>([]);
  const [gohoubiMessage, setGohoubiMessage] = useState<string>(
    '「おっ！今日は特別に拙者の風呂上がりの出汁を……豚骨仕立てだゾ♡ 鍋に具材を入れるんだゾ！」'
  );

  const availableIngredients = [
    { emoji: '🥩', name: '肉' },
    { emoji: '🦴', name: '骨' },
    { emoji: '🧂', name: '塩' },
    { emoji: '💧', name: '水' },
    { emoji: '🌿', name: '香味野菜' },
    { emoji: '🐷', name: '豚骨' },
    { emoji: '💦', name: '拙者の汗', hidden: true },
  ];

  const handleAddIngredient = (emoji: string, name: string, isHidden: boolean) => {
    sound.playClick(600);
    const nextIngredients = [...soupIngredients, emoji];
    setSoupIngredients(nextIngredients);

    if (isHidden) {
      sound.playSweetFe();
      setGohoubiMessage('🐷「ブヒィィッ！ 拙者の男気エキス、風呂上がりの汗だゾ〜〜♡」');
    } else {
      setGohoubiMessage(`🐷「${name}を入れたゾ！ グツグツ煮立ってきたゾ♡」`);
    }

    if (nextIngredients.length >= 4) {
      sound.playSuccess();
      setPhase('cleared');
      setGohoubiMessage('🐷「完成だゾ！『ご褒美特製・豚骨出汁』だゾ！ 持っていくがいいゾ！」');
      setGlobalState((prev) => ({ ...prev, hasSoup: true }));
    }
  };

  const handleNextFloor = () => {
    sound.playElevator();
    const hasSweatIngredient = soupIngredients.includes('💦');
    
    // 変なもの（拙者の汗など）を入れていない場合は燃料・混沌を上げすぎない
    const deltas: Partial<TowerParameters> = hasSweatIngredient
      ? { chaos: 35, acting: 20, fuel: 35, flow: 15 }
      : { structure: 15, fuel: 10, flow: 15, chaos: 5 };

    onComplete(
      deltas,
      [],
      {
        floor: '4F',
        action: `【ご褒美】具材(${soupIngredients.join('')})を入れて${hasSweatIngredient ? '怪しい濃厚出汁' : '王道の豚骨出汁'}を完成させた`,
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-xl mx-auto px-4 py-6 text-slate-200 relative z-10">
      <div className="flex items-center justify-between border-b border-amber-900/40 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold">4F</span>
          <h2 className="text-lg font-bold text-white tracking-wide">ご褒美の出汁工房</h2>
        </div>
        <div className="text-xs font-mono text-amber-300">RESIDENT: 🐷 栄城 縫</div>
      </div>

      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 mb-6 backdrop-blur shadow-[0_0_25px_rgba(245,158,11,0.15)] flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center shrink-0 shadow-lg overflow-hidden relative">
          <img
            src={gohobiImg}
            alt="ご褒美"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-300">栄城 縫（ご褒美）</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400">INFP / IEI (4w3)</span>
          </div>
          <p className="text-sm sm:text-base text-amber-100 font-medium leading-relaxed italic">{gohoubiMessage}</p>
        </div>
      </div>

      {phase === 'soup_game' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
            {availableIngredients.map((item) => (
              <button
                key={item.name}
                onClick={() => handleAddIngredient(item.emoji, item.name, item.hidden || false)}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 transition-all active:scale-90 ${item.hidden ? 'bg-amber-950/30 border-amber-800 hover:bg-amber-900 text-amber-200' : 'bg-slate-900 border-slate-700 hover:bg-slate-800 text-slate-300'}`}
              >
                <span className="text-2xl">{item.emoji}</span>
                <span className="text-[10px] font-bold">{item.name}</span>
                <PlusCircle className="w-3 h-3 opacity-50 mt-1" />
              </button>
            ))}
          </div>

          <div className="relative h-48 bg-gradient-to-b from-slate-900 to-amber-950/50 border-2 border-amber-900/50 rounded-[3rem] overflow-hidden flex flex-col items-center justify-end p-6 shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-2 p-8 opacity-50 text-4xl">
              {soupIngredients.map((emoji, i) => (
                <motion.span key={i} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1, rotate: Math.random() * 360 }} transition={{ type: 'spring' }}>
                  {emoji}
                </motion.span>
              ))}
            </div>
            
            <div className="relative z-10 w-full py-4 bg-amber-600/80 rounded-full border-t-4 border-amber-400/50 text-center flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(217,119,6,0.8)] backdrop-blur-sm">
              <Soup className="w-6 h-6 text-amber-100 animate-pulse" />
              <span className="font-bold text-amber-50">グツグツの巨大鍋</span>
            </div>
            
            {soupIngredients.length > 0 && (
              <div className="absolute top-4 w-full text-center space-y-1">
                <div className="text-xs font-bold text-amber-300 animate-pulse">
                  🔥 煮込み中... ({soupIngredients.length}/4)
                </div>
                <button
                  onClick={() => {
                    sound.playClick(350);
                    setSoupIngredients((prev) => prev.slice(0, -1));
                  }}
                  className="inline-block text-[11px] px-2 py-0.5 rounded bg-slate-900/80 border border-slate-700 text-slate-400 hover:text-amber-300 cursor-pointer"
                >
                  ↺ 最後の具材を取り消す
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === 'cleared' && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-2 space-y-6">
          <div className="relative h-48 flex items-center justify-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-[radial-gradient(circle,rgba(251,191,36,0.3)_0%,transparent_70%)] blur-xl" 
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
              className="relative z-10 flex flex-col items-center"
            >
              <img src={tonkotsuImg} alt="特製豚骨出汁" className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-full border-4 border-amber-500 shadow-[0_0_30px_rgba(251,191,36,0.6)]" referrerPolicy="no-referrer" />
              <div className="mt-4 font-black text-2xl text-amber-400 tracking-widest drop-shadow-md">特製豚骨出汁</div>
            </motion.div>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>4F CLEAR ── 出汁を獲得</span>
          </div>
          <div>
            <button onClick={handleNextFloor} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer">
              <span>5F（💪 えいじの部屋）へ登る</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2">
            <button
              onClick={() => {
                sound.playClick(350);
                setPhase('soup_game');
                setSoupIngredients([]);
                setGohoubiMessage('「もう一度煮直すのか！？ 好きな具材を鍋に入れるんだゾ！」');
              }}
              className="text-xs text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
            >
              ← 具材を選び直す
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
