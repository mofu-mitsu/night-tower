import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Network } from 'lucide-react';
import confetti from 'canvas-confetti';
import { TowerParameters } from '../types';
import { sound } from '../utils/sound';

interface Floor8LSIProps {
  onComplete: (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => void;
}

export const Floor8LSI: React.FC<Floor8LSIProps> = ({ onComplete }) => {
  const [connections, setConnections] = useState<number>(0);
  const [isEvolving, setIsEvolving] = useState<boolean>(false);
  const [evolutionType, setEvolutionType] = useState<'perfect' | 'mid' | 'low' | 'none'>('none');
  const [lsiMessage, setLsiMessage] = useState<string>(
    '「……7Fで定義された概念を構造化する。論理ノードを接続せよ。」'
  );
  
  const [moves, setMoves] = useState<number>(0);
  const [nodes, setNodes] = useState<string[]>([]);

  const handleConnect = (type: string, quality: number, name: string) => {
    if (moves >= 3) return;
    
    sound.playClick(600);
    setConnections(c => c + quality);
    setMoves(m => m + 1);
    setNodes(n => [...n, name]);
    
    const newTotal = connections + quality;
    if (moves === 2) {
      if (newTotal >= 50) {
        setLsiMessage('🐛✨✨「……完璧な論理回路。蛹の中で細胞が再構成されている。」');
      } else if (newTotal >= 30) {
        setLsiMessage('🐛✨「なるほど。十分な整合性だね。」');
      } else {
        setLsiMessage('🐛「……論理の破綻を検知。このままでは……」');
      }
    } else {
      setLsiMessage(`🐛「${name}を接続。残り手順は${2 - moves}回。」`);
    }
  };

  const handleFinishStructure = () => {
    setIsEvolving(true);
    sound.playPowerDown();
    
    let type: 'perfect' | 'mid' | 'low' = 'low';
    if (connections >= 50) type = 'perfect';
    else if (connections >= 30) type = 'mid';

    setTimeout(() => {
      sound.playMetamorphosis();
      confetti({ particleCount: 150, spread: 100, colors: ['#00ffff', '#3b82f6', '#ec4899', '#ffffff'] });
      setIsEvolving(false);
      setEvolutionType(type);
      
      if (type === 'perfect') {
        setLsiMessage('🦋「ﾊﾟｷ……羽化完了。世界は完璧に調和された数理の織物です。」');
      } else if (type === 'mid') {
        setLsiMessage('🦋「……不完全ながら羽化しました。一部の論理は妥協します。」');
      } else {
        setLsiMessage('🐛「……羽化失敗。論理が崩壊した。このまま芋虫として生きていく。」');
      }
    }, 2000);
  };

  const handleNextFloor = () => {
    sound.playElevator();
    onComplete(
      { structure: evolutionType === 'perfect' ? 60 : 30 },
      evolutionType === 'perfect' ? ['morpho_emergence'] : [],
      { floor: '8F', action: `【LSI】論理を${connections}繋ぎ、${evolutionType === 'perfect' ? '完全体(🦋)' : evolutionType === 'mid' ? '羽化しかけ(🦋)' : '芋虫(🐛)'}へ羽化させた` }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-xl mx-auto px-4 py-6 text-slate-200 relative z-10">
      <div className="flex items-center justify-between border-b border-blue-900/40 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-blue-950/80 border border-blue-500/40 text-blue-400 font-mono text-xs font-bold">8F</span>
          <h2 className="text-lg font-bold text-white tracking-wide">構造と論理の繭室</h2>
        </div>
        <div className="text-xs font-mono text-blue-300">RESIDENT: LSI</div>
      </div>

      <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 mb-6 backdrop-blur flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl bg-blue-950/60 border border-blue-500/50 flex items-center justify-center text-3xl shrink-0 shadow-lg">
          {evolutionType === 'perfect' || evolutionType === 'mid' ? '🦋' : '🐛'}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-300">
              {evolutionType === 'perfect' ? '完全体LSI' : evolutionType === 'mid' ? '羽化しかけLSI' : 'LSI芋虫'}
            </span>
          </div>
          <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed italic">{lsiMessage}</p>
        </div>
      </div>

      <AnimatePresence>
        {isEvolving && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center">
            <motion.div animate={{ scale: [1, 1.2, 0.9, 1.3], rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-6xl mb-4">🥚</motion.div>
            <div className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse mb-2">METAMORPHOSIS IN PROGRESS...</div>
            <p className="text-xs text-slate-400 font-mono">ﾊﾟｷ…… ﾊﾟｷﾊﾟｷ……</p>
          </motion.div>
        )}
      </AnimatePresence>

      {evolutionType === 'none' && !isEvolving && (
        <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 text-center">
          <Network className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-xs text-slate-400 mb-4">論理のパーツを組み合わせて構造を完成させてください。(残り{3 - moves}手)</div>
          
          <div className="min-h-[40px] text-sm text-blue-200 bg-slate-900/50 p-3 rounded-lg border border-blue-900/50 font-mono mb-4 flex items-center justify-center">
            {nodes.length > 0 ? nodes.join(' ➔ ') : '（ノードが接続されていません）'}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button disabled={moves >= 3} onClick={() => handleConnect('causality', 20, '因果律')} className="p-3 bg-slate-900 border border-slate-700 hover:border-blue-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-all">因果律ノード (+20)</button>
            <button disabled={moves >= 3} onClick={() => handleConnect('timeline', 15, '時系列')} className="p-3 bg-slate-900 border border-slate-700 hover:border-blue-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-all">時系列ノード (+15)</button>
            <button disabled={moves >= 3} onClick={() => handleConnect('paradox', -10, 'パラドックス')} className="p-3 bg-slate-900 border border-slate-700 hover:border-red-500 disabled:opacity-50 rounded-xl text-xs font-bold text-red-300 transition-all">矛盾ノード (-10)</button>
            <button disabled={moves >= 3} onClick={() => handleConnect('random', 5, '不確実性')} className="p-3 bg-slate-900 border border-slate-700 hover:border-blue-500 disabled:opacity-50 rounded-xl text-xs font-bold text-white transition-all">不確実性ノード (+5)</button>
          </div>
          <div className="pt-4">
            <button disabled={moves < 3} onClick={handleFinishStructure} className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.5)] transition-all">
              構造を確定し、羽化を促す
            </button>
          </div>
        </div>
      )}

      {evolutionType !== 'none' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>8F COMPLETE ── {evolutionType === 'perfect' ? '完全覚醒' : '観測終了'}</span>
          </div>
          <div>
            <button onClick={handleNextFloor} className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-slate-900 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 transition-all shadow-[0_0_25px_rgba(251,191,36,0.5)] cursor-pointer text-base">
              <span>最上階（ROOFTOP SKY LOUNGE）へ</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
