import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, BookOpen, Send } from 'lucide-react';
import { TowerParameters, GlobalState } from '../types';
import { sound } from '../utils/sound';

interface Floor7TsukushiProps {
  onComplete: (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => void;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

export const Floor7Tsukushi: React.FC<Floor7TsukushiProps> = ({ onComplete, setGlobalState }) => {
  const [phase, setPhase] = useState<'concepts' | 'naming' | 'cleared'>('concepts');
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [towerName, setTowerName] = useState<string>('');
  const [tsukushiMessage, setTsukushiMessage] = useState<string>(
    '「……時計が逆回転し、雨が横に降り、影だけが動いている。説明のない空間。この状況を構成する『概念』を選んで。」'
  );

  const concepts = ['時間', '記憶', '未来', '過去', '変化', '自分', '世界', '虚無', '真実', '法則', '幻覚', '混沌'];

  const handleToggleConcept = (c: string) => {
    sound.playClick(400);
    if (selectedConcepts.includes(c)) {
      setSelectedConcepts(selectedConcepts.filter(x => x !== c));
    } else {
      if (selectedConcepts.length < 3) {
        setSelectedConcepts([...selectedConcepts, c]);
      } else {
        sound.playBuzzer();
        setTsukushiMessage('🌱「……概念は3つまで。それ以上は構造が崩壊する。」');
      }
    }
  };

  const handleSubmitConcepts = () => {
    if (selectedConcepts.length !== 3) {
      sound.playBuzzer();
      setTsukushiMessage('🌱「……不完全。世界を安定させるには、基点となる概念が【3つ】必要。」');
      return;
    }
    sound.playSuccess();
    setPhase('naming');
    
    // 組み合わせによる特殊メッセージ
    let msg = '🌱「……その要素の結びつき。理解したよ。最後に、この構造全体に『名前』をつけて。」';
    if (selectedConcepts.includes('時間') && selectedConcepts.includes('過去') && selectedConcepts.includes('未来')) {
      msg = '🌱「……時系列の完全制覇。古典的だけど、非常に強固な構造だね。名前をつけて。」';
    } else if (selectedConcepts.includes('虚無') && selectedConcepts.includes('幻覚') && selectedConcepts.includes('混沌')) {
      msg = '🌱「……完全に形而上学的な崩壊状態。これも一つの真理。名前をどうぞ。」';
    } else if (selectedConcepts.includes('自分')) {
      msg = '🌱「……『自分』を中心に据えるんだ。自己言及的な美しいパラドックスだね。名前を。」';
    }
    setTsukushiMessage(msg);
  };

  const handleSubmitName = () => {
    const name = towerName.trim() || '名もなき塔';
    sound.playClick(700);
    setGlobalState(prev => ({ ...prev, customTowerName: name }));
    setTsukushiMessage(`🌱「……『${name}』。いい名前。世界が再構築されたよ。」`);
    setPhase('cleared');
  };

  const handleNextFloor = () => {
    sound.playElevator();
    
    // 選択概念に基づくパラメータ計算
    let s = 30; let a = 5; let f = 10; let c = 10;
    if (selectedConcepts.includes('法則')) s += 20;
    if (selectedConcepts.includes('真実')) s += 20;
    if (selectedConcepts.includes('虚無')) c += 30;
    if (selectedConcepts.includes('混沌')) c += 30;
    if (selectedConcepts.includes('自分')) a += 20;
    if (selectedConcepts.includes('変化')) f += 20;

    onComplete(
      { structure: s, acting: a, flow: f, chaos: c },
      ['redefine_world'],
      { floor: '7F', action: `【つくし】概念(${selectedConcepts.join(',')})を抽出し、状況を「${towerName || '名もなき塔'}」と命名した` }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-xl mx-auto px-4 py-6 text-slate-200 relative z-10">
      <div className="flex items-center justify-between border-b border-teal-900/40 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-teal-950/80 border border-teal-500/40 text-teal-400 font-mono text-xs font-bold">7F</span>
          <h2 className="text-lg font-bold text-white tracking-wide">名前のない部屋</h2>
        </div>
        <div className="text-xs font-mono text-teal-300">RESIDENT: 🌱 つくし</div>
      </div>

      <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-5 mb-6 backdrop-blur flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl bg-teal-950/60 border border-teal-500/50 flex items-center justify-center text-3xl shrink-0 shadow-lg">🌱</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-teal-300">つくし</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-950 border border-teal-800 text-teal-400">INTJ / LII (5w4)</span>
          </div>
          <p className="text-sm sm:text-base text-teal-100 font-medium leading-relaxed italic">{tsukushiMessage}</p>
        </div>
      </div>

      {phase === 'concepts' && (
        <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-mono text-teal-400">【1】関連する概念を選択して線を結ぶ</div>
          <div className="flex flex-wrap gap-2">
            {concepts.map(c => (
              <button
                key={c}
                onClick={() => handleToggleConcept(c)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${selectedConcepts.includes(c) ? 'bg-teal-900/80 border-teal-400 text-white shadow-[0_0_10px_rgba(45,212,191,0.5)]' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'}`}
              >
                {c}
              </button>
            ))}
          </div>
          
          <div className="min-h-[40px] text-sm text-teal-200 bg-slate-900/50 p-3 rounded-lg border border-teal-900/50 font-mono">
            {selectedConcepts.length > 0 ? selectedConcepts.join(' → ') : '（概念が選択されていません）'}
          </div>

          <button
            onClick={handleSubmitConcepts}
            disabled={selectedConcepts.length === 0}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 font-bold text-white shadow-lg flex justify-center items-center gap-2"
          >
            構造を確定する
          </button>
        </div>
      )}

      {phase === 'naming' && (
        <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-mono text-teal-400">【2】状況に名前をつける</div>
          <input
            type="text"
            value={towerName}
            onChange={(e) => setTowerName(e.target.value)}
            placeholder="例：時間の迷子"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold focus:outline-none focus:border-teal-500"
          />
          <button
            onClick={handleSubmitName}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 font-bold text-white shadow-lg flex justify-center items-center gap-2"
          >
            <Send className="w-4 h-4" /> 命名する
          </button>
        </div>
      )}

      {phase === 'cleared' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/70 border border-teal-500/40 text-teal-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>7F CLEAR ── 概念定義完了</span>
          </div>
          <div>
            <button onClick={handleNextFloor} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer">
              <span>8F（🐛 LSI芋虫の部屋）へ登る</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
