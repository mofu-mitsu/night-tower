import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Sparkles, ArrowRight, Droplets, Flame } from 'lucide-react';
import { TowerParameters, GlobalState } from '../types';
import { sound } from '../utils/sound';
import sweatOilImg from '../assets/images/sweat_oil_fantasy_1789481898075.jpg';
import eijiImg from '../assets/images/eiji.png';

interface Floor5EijiProps {
  onComplete: (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => void;
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

export const Floor5Eiji: React.FC<Floor5EijiProps> = ({ onComplete, globalState, setGlobalState }) => {
  const [pumpCount, setPumpCount] = useState<number>(0);
  const [phase, setPhase] = useState<'pump' | 'harvest' | 'cleared'>('pump');
  const [eijiMessage, setEijiMessage] = useState<string>(
    '「おっす！オラえいじ！まずはパンプアップだ！連打しろ！！」'
  );
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const pumpStartTimeRef = useRef<number | null>(null);
  const pumpSpeedTypeRef = useRef<'blazing' | 'normal' | 'steady'>('normal');

  const handlePump = () => {
    sound.playMuscle();
    if (pumpStartTimeRef.current === null) {
      pumpStartTimeRef.current = Date.now();
    }

    const next = pumpCount + 5;
    setPumpCount(next);

    if (next >= 100 && phase === 'pump') {
      sound.playSuccess();
      setPhase('harvest');

      const elapsed = Math.max(0.5, (Date.now() - (pumpStartTimeRef.current || Date.now())) / 1000);
      if (elapsed < 3.2) {
        pumpSpeedTypeRef.current = 'blazing';
        setEijiMessage(`💪「ウオオオッ！ ${elapsed.toFixed(1)}秒の超高速連打ァァ！！ 筋肉が混沌の火花を散らしてるぜ！！ 採取しろ！！」`);
      } else if (elapsed < 6.0) {
        pumpSpeedTypeRef.current = 'normal';
        setEijiMessage(`💪「いいパンプアップのリズムだぜ（${elapsed.toFixed(1)}秒）！ 汗が噴き出してきたぞ！！ 採取しろ！！」`);
      } else {
        pumpSpeedTypeRef.current = 'steady';
        setEijiMessage(`💪「丁寧で美しいフォームだぜ（${elapsed.toFixed(1)}秒）！ じっくり効かせる筋力構造だな！ 汗を採取しろ！！」`);
      }
    }
  };

  const handleHarvestSweat = () => {
    sound.playClick(600);
    setGlobalState((prev) => ({ ...prev, hasSweat: true }));
    setEijiMessage('「おっす！ オラの男気の結晶、天然ミネラル100%配合だぜ！！」');
    setPhase('cleared');
  };

  const [showMixAnimation, setShowMixAnimation] = useState(false);

  const handleMix = () => {
    sound.playMetamorphosis();
    setShowMixAnimation(true);
    setTimeout(() => {
      setShowMixAnimation(false);
      setUnlockedAchievements((prev) => [...prev, 'sweat_oil_fantasy']);
      setEijiMessage('💪「おおおおお！！ 筋肉サイコー！！！ 豚骨出汁とオラの汗で【汗と油のファンタジー】完成だァァ！！」');
      setPhase('cleared');
    }, 3000);
  };

  const handleNextFloor = () => {
    sound.playElevator();
    const isFantasy = unlockedAchievements.includes('sweat_oil_fantasy');
    
    // 連打速度による基本パラメータ
    let baseDeltas: Partial<TowerParameters> = { fuel: 15, structure: 15, chaos: 10, flow: 10 };
    if (pumpSpeedTypeRef.current === 'blazing') {
      // 爆速連打: 混沌と燃料が跳ね上がる
      baseDeltas = { fuel: 30, chaos: 30, acting: 10, structure: 5 };
    } else if (pumpSpeedTypeRef.current === 'steady') {
      // 丁寧なフォーム: 構造と流動が高まる
      baseDeltas = { structure: 25, fuel: 10, flow: 20, chaos: 0 };
    }

    // 汗と油のファンタジーを混ぜた場合のみ、特大ボーナス
    if (isFantasy) {
      baseDeltas.fuel = (baseDeltas.fuel || 0) + 25;
      baseDeltas.chaos = (baseDeltas.chaos || 0) + 25;
    }

    onComplete(
      baseDeltas,
      unlockedAchievements,
      {
        floor: '5F',
        action: `【えいじ】${
          pumpSpeedTypeRef.current === 'blazing'
            ? '超高速連打'
            : pumpSpeedTypeRef.current === 'steady'
            ? '丁寧なフォーム連打'
            : 'リズム連打'
        }で汗を採取した${isFantasy ? '。さらに出汁と汗を混ぜて「汗と油のファンタジー」を完成させた' : ''}`,
      }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-xl mx-auto px-4 py-6 text-slate-200 relative z-10">
      <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">5F</span>
          <h2 className="text-lg font-bold text-white tracking-wide">筋肉と情熱のスカイジム</h2>
        </div>
        <div className="text-xs font-mono text-emerald-300">RESIDENT: 💪 筋永 明日雅</div>
      </div>

      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 mb-6 backdrop-blur flex items-start gap-3">
        <motion.div 
          animate={{ scale: 1 + (pumpCount / 200) }} 
          className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center shrink-0 shadow-lg overflow-hidden relative"
        >
          <img
            src={eijiImg}
            alt="えいじ"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-300">えいじ</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">ESTP / SEE (8w7)</span>
          </div>
          <p className="text-sm sm:text-base text-emerald-100 font-medium leading-relaxed italic">{eijiMessage}</p>
        </div>
      </div>

      {showMixAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              initial={{ x: -200, rotate: 0 }}
              animate={{ x: 0, rotate: 360, scale: 2 }}
              transition={{ duration: 1, type: "spring" }}
              className="absolute text-8xl z-10 drop-shadow-[0_0_20px_rgba(245,158,11,1)]"
            >
              🍲
            </motion.div>
            <motion.div
              initial={{ x: 200, rotate: 0 }}
              animate={{ x: 0, rotate: -360, scale: 2 }}
              transition={{ duration: 1, type: "spring" }}
              className="absolute text-8xl z-10 drop-shadow-[0_0_20px_rgba(6,182,212,1)]"
            >
              💦
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, type: 'spring', bounce: 0.4, duration: 1 }}
              className="absolute z-40 drop-shadow-[0_0_50px_rgba(255,255,255,0.8)]"
            >
              <img src={sweatOilImg} alt="汗と油のファンタジー" className="w-64 h-64 object-cover rounded-3xl border-4 border-cyan-400" referrerPolicy="no-referrer" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute inset-0 bg-white z-30 mix-blend-overlay"
            />
          </div>
        </div>
      )}

      {phase === 'pump' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-6">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">🔥 筋肉パンプ度</span>
            <span className="text-emerald-400 font-bold">{pumpCount}%</span>
          </div>
          <div className="w-full h-6 bg-slate-900 rounded-full border border-slate-800 overflow-hidden p-1">
            <motion.div className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full" animate={{ width: `${pumpCount}%` }} transition={{ type: 'spring' }} />
          </div>
          <button onClick={handlePump} className="w-full py-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-black text-white text-xl shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-90 flex items-center justify-center gap-3">
            <Dumbbell className="w-8 h-8 animate-bounce" />
            <span>連打でパンプアップ！！</span>
          </button>
        </div>
      )}

      {phase === 'harvest' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <div className="text-4xl animate-bounce pb-2">💦💦💦</div>
          <button onClick={handleHarvestSweat} className="w-full py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] flex items-center justify-center gap-2 text-lg">
            <Droplets className="w-5 h-5" />
            <span>えいじの汗を採取する</span>
          </button>
        </div>
      )}

      {phase === 'cleared' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-6 space-y-4">
          
          {/* 合成イベント (出汁と汗を持っている場合) */}
          {globalState.hasSoup && globalState.hasSweat && !unlockedAchievements.includes('sweat_oil_fantasy') && (
            <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-2xl space-y-3 mb-6">
              <div className="text-amber-400 font-bold text-sm flex items-center justify-center gap-2">
                <Flame className="w-4 h-4" />
                <span>⚠️ 禁断の合成が可能 ⚠️</span>
              </div>
              <p className="text-xs text-amber-200">インベントリに「豚骨出汁」と「えいじの汗」があります。</p>
              <button onClick={handleMix} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 font-bold text-white shadow-[0_0_20px_rgba(245,158,11,0.6)]">
                出汁と汗を混ぜる（汗と油のファンタジー）
              </button>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>5F CLEAR ── 筋力限界突破</span>
          </div>
          <div>
            <button onClick={handleNextFloor} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer">
              <span>6F（🦗 キリギリスの部屋）へ登る</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
