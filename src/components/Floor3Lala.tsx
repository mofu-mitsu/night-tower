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
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [lalaMessage, setLalaMessage] = useState<string>(
    '「ララだよ。よろしくね。……で、そのルール、本当に守る必要あるの？」'
  );
  const [isHacked, setIsHacked] = useState<boolean>(false);
  const [isInstantClear, setIsInstantClear] = useState<boolean>(false);
  const [isInstantRefuse, setIsInstantRefuse] = useState<boolean>(false);
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
    setTotalAttempts((prev) => prev + 1);

    // 隠しルール00：黄色を1回だけ押すのが正解
    if (id === '3_yellow_circle' && pressedButtons.length === 0) {
      sound.playSuccess();
      const isFirstShot = mistakeCount === 0 && totalAttempts === 0;
      if (isFirstShot) {
        setLalaMessage('🐦「うわ、初手一発でRULE 00見つけたの！？ ズル賢すぎてゾクゾクするね！ 一手も無駄にしない本物のハッカーだ！」');
        setIsInstantClear(true);
      } else {
        setLalaMessage('🐦「あはは！ RULE 00 見つけたんだ！ ズル賢いね、最高！」');
      }
      setIsHacked(true);
      setCleared(true);
      return;
    }

    if (id === '2_red_square') {
      sound.playBuzzer();
      setPressedButtons([]);
      setMistakeCount((prev) => prev + 1);
      setLalaMessage('🐦「あはは！ RULE 02読んだ？ 赤いボタン押しちゃったね。やり直し！」');
      return;
    }

    if (pressedButtons.includes(id)) {
      sound.playBuzzer();
      setPressedButtons([]);
      setMistakeCount((prev) => prev + 1);
      setLalaMessage('🐦「同じボタンを2回押したね。やり直し〜！」');
      return;
    }

    const next = [...pressedButtons, id];
    
    // 判定ロジック強化
    if (next.length === 1 && next[0] !== '1_blue_circle') {
      sound.playBuzzer();
      setPressedButtons([]);
      setMistakeCount((prev) => prev + 1);
      setLalaMessage('🐦「あーあ。RULE 01と04読んでる？ 最初は一番左の1番（青の丸）からじゃないの？ やり直し！」');
      return;
    }

    if (next.length === 2 && next[1] !== '3_yellow_circle') {
      sound.playBuzzer();
      setPressedButtons([]);
      setMistakeCount((prev) => prev + 1);
      setLalaMessage('🐦「ちっちっち。RULE 05と07を守ってないね。青の次は黄色でしょ？ それに偶数はダメ！ やり直し！」');
      return;
    }

    if (next.length === 3 && next[2] !== '5_purple_circle') {
      sound.playBuzzer();
      setPressedButtons([]);
      setMistakeCount((prev) => prev + 1);
      setLalaMessage('🐦「最後が惜しい！ RULE 06（同じ形）を守ってないよ。やり直し！」');
      return;
    }

    setPressedButtons(next);

    // 正解ルート: 🔵 -> 🟡 -> 🟣 (1, 3, 5)
    if (next.length === 3) {
      sound.playSuccess();
      if (mistakeCount === 0) {
        setLalaMessage('🐦「……マジ？ 一度も間違えずに全12条を一発でノーミスクリアしたの！？ 完璧な構造把握と観察力だね。脱帽だよ。」');
        setIsInstantClear(true);
      } else {
        setLalaMessage('🐦「……へぇ、やり直して全部のルールを満たしたんだ。君、面白いね。」');
      }
      setCleared(true);
    }
  };

  const handleRefuse = () => {
    sound.playClick(400);
    setIsHacked(true);
    setCleared(true);

    if (mistakeCount === 0 && totalAttempts === 0) {
      // 一度もボタンを触らず、初手でゲーム拒否
      setIsInstantRefuse(true);
      setLalaMessage('🐦「えっ、1手も打たずに初手で放棄！？……あはは！ ルールという土俵自体をノータイムで蹴っ飛ばす一番の反則技じゃん！ 気に入った、君最高だよ。」');
    } else {
      setLalaMessage('🐦「えっ、散々触ったあげくゲームをやらない？……あはは！ それでもルールという土俵自体を蹴っ飛ばす反則技には変わりないね。面白いよ。」');
    }
  };

  const handleNextFloor = () => {
    sound.playElevator();

    let deviationGain = 20;
    let structureGain = 20;
    let chaosGain = 10;
    let logAction = '【ララ】ルール通りにクリアした';
    const newAchievements: string[] = [];

    if (isInstantRefuse) {
      // 初手でゲーム拒否（最大級の逸脱・破壊）
      deviationGain = 50;
      chaosGain = 35;
      structureGain = 10;
      newAchievements.push('rule_hacker');
      logAction = '【ララ】1手も打たずに初手でゲームを完全拒否した（神速の土俵破壊）';
    } else if (isInstantClear) {
      // 一発クリア（ノーミス）
      deviationGain = isHacked ? 45 : 35;
      structureGain = isHacked ? 35 : 45;
      chaosGain = 20;
      if (isHacked) newAchievements.push('rule_hacker');
      logAction = isHacked
        ? '【ララ】1手も間違えず初手一発でRULE 00を見破りクリアした'
        : '【ララ】一度のミスもなく全12条のルールを一発で完全制覇した';
    } else if (isHacked) {
      // 試行錯誤後のハック（黄色押しまたは後からの拒否）
      deviationGain = 30;
      chaosGain = 20;
      structureGain = 15;
      newAchievements.push('rule_hacker');
      logAction = '【ララ】試行錯誤の末にルールの穴を突いて突破した';
    } else {
      // 試行錯誤後の通常クリア
      deviationGain = 15;
      structureGain = 25;
      logAction = '【ララ】やり直しながら真面目に全ルールをクリアした';
    }

    onComplete(
      {
        deviation: deviationGain,
        structure: structureGain,
        chaos: chaosGain,
        acting: 10,
        fuel: 10,
      },
      newAchievements,
      { floor: '3F', action: logAction }
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
