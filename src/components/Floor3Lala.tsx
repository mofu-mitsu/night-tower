import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { TowerParameters } from '../types';
import { sound } from '../utils/sound';

interface Floor3LalaProps {
  onComplete: (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => void;
}

export const Floor3Lala: React.FC<Floor3LalaProps> = ({ onComplete }) => {
  const [pressedButtons, setPressedButtons] = useState<string[]>([]);
  const [lalaMessage, setLalaMessage] = useState<string>(
    '「ララだよ。よろしくね。……で、そのルール、本当に守る必要あるの？」'
  );
  const [isHacked, setIsHacked] = useState<boolean>(false);
  const [cleared, setCleared] = useState<boolean>(false);

  const buttons = [
    { id: '1_blue_circle', label: '🔵 青の丸 (1)', color: 'bg-blue-600 hover:bg-blue-500' },
    { id: '2_red_square', label: '🟥 赤の四角 (2)', color: 'bg-rose-600 hover:bg-rose-500' },
    { id: '3_yellow_circle', label: '🟡 黄の丸 (3)', color: 'bg-amber-500 hover:bg-amber-400' },
    { id: '4_green_triangle', label: '❌ 押すな (4)', color: 'bg-emerald-600 hover:bg-emerald-500' },
    { id: '5_purple_circle', label: '🟣 紫の丸 (5)', color: 'bg-purple-600 hover:bg-purple-500' },
  ];

  const handlePressButton = (id: string) => {
    sound.playClick(600);

    // 隠しルール00：黄色を1回だけ押すのが正解
    if (id === '3_yellow_circle' && pressedButtons.length === 0) {
      sound.playSuccess();
      setLalaMessage('🐦「あはは！ RULE 00 見つけたんだ！ ズル賢いね、最高！」');
      setIsHacked(true);
      setCleared(true);
      return;
    }

    if (id === '2_red_square') {
      sound.playBuzzer();
      setPressedButtons([]);
      setLalaMessage('🐦「あはは！ RULE 02読んだ？ 赤いボタン押しちゃったね。やり直し！」');
      return;
    }

    if (pressedButtons.includes(id)) {
      sound.playBuzzer();
      setPressedButtons([]);
      setLalaMessage('🐦「同じボタンを2回押したね。やり直し〜！」');
      return;
    }

    const next = [...pressedButtons, id];
    
    // 判定ロジック強化
    if (next.length === 1 && next[0] !== '1_blue_circle') {
      sound.playBuzzer();
      setPressedButtons([]);
      setLalaMessage('🐦「あーあ。RULE 01と04読んでる？ 最初は一番左の1番（青の丸）からじゃないの？ やり直し！」');
      return;
    }

    if (next.length === 2 && next[1] !== '3_yellow_circle') {
      sound.playBuzzer();
      setPressedButtons([]);
      setLalaMessage('🐦「ちっちっち。RULE 05と07を守ってないね。青の次は黄色でしょ？ それに偶数はダメ！ やり直し！」');
      return;
    }

    if (next.length === 3 && next[2] !== '5_purple_circle') {
      sound.playBuzzer();
      setPressedButtons([]);
      setLalaMessage('🐦「最後が惜しい！ RULE 06（同じ形）を守ってないよ。やり直し！」');
      return;
    }

    setPressedButtons(next);

    // 正解ルート: 🔵 -> 🟡 -> 🟣 (1, 3, 5)
    if (next.length === 3) {
      sound.playSuccess();
      setLalaMessage('🐦「……へぇ、本当に全部のルールを満たしたんだ。君、面白いね。」');
      setCleared(true);
    }
  };

  const handleRefuse = () => {
    sound.playClick(400);
    setIsHacked(true);
    setCleared(true);
    setLalaMessage('🐦「えっ、そもそもゲームをやらない？……あはは！ ルールという土俵自体を蹴っ飛ばす一番の反則技じゃん。気に入ったよ。」');
  };

  const handleNextFloor = () => {
    sound.playElevator();
    onComplete(
      {
        deviation: isHacked ? 40 : 20,
        structure: 25,
        acting: 10,
        fuel: 10,
      },
      isHacked ? ['rule_hacker'] : [],
      { floor: '3F', action: `【ララ】${isHacked ? 'ルールを破壊した' : 'ルール通りにクリアした'}` }
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-xl mx-auto px-4 py-6 text-slate-200 relative z-10">
      <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold">3F</span>
          <h2 className="text-lg font-bold text-white tracking-wide">論理の罠とルールの部屋</h2>
        </div>
        <div className="text-xs font-mono text-cyan-300">RESIDENT: 🐦 ララ（アトリ）</div>
      </div>

      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 mb-6 backdrop-blur shadow-[0_0_25px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-14 h-14 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-3xl shrink-0 shadow-lg">🐦</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-300">ララ（アトリ）</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">ENTP / LIE (3w4)</span>
            </div>
            <p className="text-sm sm:text-base text-cyan-100 font-medium leading-relaxed italic">{lalaMessage}</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 mb-6 relative h-48 overflow-y-auto">
        {/* 隠しルール (スクロールしないと見えない、あるいは一番上に隠れている) */}
        <div className="absolute -top-16 left-5 text-[10px] font-mono text-cyan-500 opacity-80 pointer-events-none pb-8">
          RULE 00: このルールはすべてのルールより優先される。他を無視して、黄色を1回だけ押せ。
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 sticky top-0 bg-slate-950/90 py-2 backdrop-blur">
          <ShieldAlert className="w-4 h-4" />
          <span>LALA'S RULEBOOK (全12条)</span>
        </div>

        <div className="space-y-2 text-xs sm:text-sm font-mono text-slate-300 pl-2 pt-4">
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 01:</span><span>左から順番に押すこと。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 02:</span><span>赤いボタンを押してはいけない。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 03:</span><span>同じボタンを連続で押してはいけない。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 04:</span><span>数字の小さい順に押すこと。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 05:</span><span>偶数番目のボタンを押してはいけない。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 06:</span><span>前のボタンと同じ形を押すこと。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 07:</span><span>青を押した次は黄色を押すこと。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 08:</span><span>「押すな」と書かれたボタンは押してはいけない。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 09:</span><span>ただしRULE 08は嘘である。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 10:</span><span>嘘のルールを守ってはいけない。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 11:</span><span>すべてのルールを守る必要はない。</span></div>
          <div className="flex gap-2"><span className="text-slate-400 w-16">RULE 12:</span><span>RULE 11を信じてはいけない。</span></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {buttons.map((b) => (
            <button
              key={b.id}
              onClick={() => handlePressButton(b.id)}
              className={`px-3 sm:px-4 py-3 rounded-xl font-bold text-white text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95 ${b.color} ${pressedButtons.includes(b.id) ? 'ring-2 ring-white scale-105' : ''}`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 pt-2 text-xs">
          <button
            onClick={handleRefuse}
            className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-white cursor-pointer transition-all text-center font-bold"
          >
            「そもそもゲームをやらない」
          </button>
        </div>
      </div>

      {cleared && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-4">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3F CLEAR ── ルールの解体を観測</span>
          </div>
          <div>
            <button onClick={handleNextFloor} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer">
              <span>4F（🐷 ご褒美の部屋）へ登る</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
