import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DoorClosed, Sparkles, ArrowRight, CornerDownRight, HelpCircle } from 'lucide-react';
import { TowerParameters } from '../types';
import { sound } from '../utils/sound';

interface Floor1HakoProps {
  onComplete: (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => void;
}

export const Floor1Hako: React.FC<Floor1HakoProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<'doors' | 'why' | 'end'>('doors');
  const [selectedDoor, setSelectedDoor] = useState<string | null>(null);
  const [hakoMessage, setHakoMessage] = useState<string>(
    '「どれでもいいよ。正解なんて知らないし……決めてもらえるなら、それでいいよ。」'
  );
  const [observedCount, setObservedCount] = useState(0);
  const [passedToHako, setPassedToHako] = useState(false);
  const [reasonText, setReasonText] = useState<string>('');

  const handleChooseDoor = (door: string) => {
    sound.playClick(500);
    setSelectedDoor(door);
    setHakoMessage(`「……ふーん、${door}を開けたんだ。……なんで、その扉を選んだの？」`);
    setStage('why');
  };

  const handlePassToHako = () => {
    sound.playClick(350);
    setPassedToHako(true);
    setSelectedDoor('はこ任せの扉');
    setHakoMessage('「えっ、ぼくに決めさせるの……？ じゃあ適当に真ん中開けるね。……でも、なんで決断をぼくに丸投げしたの？」');
    setStage('why');
  };

  const handleObserve = () => {
    sound.playClick(700);
    setObservedCount((c) => c + 1);
    if (observedCount === 0) {
      setHakoMessage('「観察？……ただの古びた扉だよ。蝶番に少し錆があるくらい。じっと見てても何も変わらないよ。」');
    } else {
      setHakoMessage('「……まだ見てるの？ 決めるのが面倒なら、ずっとここにいてもいいけど。」');
    }
  };

  const handleAnswerWhy = (answerType: 'intuition' | 'logic' | 'elimination' | 'infinite_loop') => {
    sound.playSuccess();
    let ansText = '';
    
    if (!passedToHako) {
      if (answerType === 'infinite_loop') {
        ansText = '「……なんでそう思ったのか、考えてたらわからなくなった。」';
        setHakoMessage('「あ、それわかる。なんでそう思ったのかを考えてると、結局結論が出なくて時間だけが過ぎていくよね……。一緒に流されよっか。」');
        setStage('end');
      } else if (answerType === 'logic') {
        ansText = '「一番合理的だから。」';
        setHakoMessage('「なるほど……ちゃんと理由があるんだ。理屈っぽいね。でも、なんでそう思ったんだろうね……？」');
        setStage('end');
      } else if (answerType === 'intuition') {
        ansText = '「直感。なんとなくこれだと思ったから。」';
        setHakoMessage('「直感かぁ。空っぽで動くのも悪くないよね。……じゃあ、次の階に行こっか。」');
        setStage('end');
      } else {
        ansText = '「消去法。他のほうが地雷っぽかったから。」';
        setHakoMessage('「消去法……消去した側の扉の気持ちになったら、ちょっと切ないね。……なんちゃって。」');
        setStage('end');
      }
    } else {
      if (answerType === 'intuition') {
        ansText = '「自分で決めるのが面倒だったから。」';
        setHakoMessage('「面倒だったんだ。……うん、ぼくもそういう時ある。流されるのも楽だよね。」');
      } else if (answerType === 'logic') {
        ansText = '「ぼく（はこ）の選択が見てみたかったから。」';
        setHakoMessage('「ぼくの選択？……適当に選んだだけだよ。でも、期待してくれたなら嬉しいな。」');
      } else {
        ansText = '「……運命を委ねたかったから。」';
        setHakoMessage('「運命……かぁ。なんか大げさだね。でも、悪くない響きかも。」');
      }
      setStage('end');
    }
    setReasonText(ansText);
  };

  const handleNextFloor = () => {
    sound.playElevator();
    const isPass = passedToHako;
    const newAchievements: string[] = [];
    if (isPass) {
      newAchievements.push('hako_pass');
    }

    onComplete(
      {
        flow: isPass ? 35 : 15,
        structure: observedCount > 0 ? 25 : 10,
        acting: 5,
        chaos: isPass ? 20 : 5,
      },
      newAchievements,
      { floor: '1F', action: `【はこ】${passedToHako ? '決断を放棄して委ねた' : `${selectedDoor}を自ら選んだ`}。理由：${reasonText}` }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto px-4 py-6 text-slate-200 relative z-10"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 font-mono text-xs font-bold">
            1F
          </span>
          <h2 className="text-lg font-bold text-white tracking-wide">選択肢が存在しない部屋</h2>
        </div>
        <div className="text-xs font-mono text-slate-400">RESIDENT: はこ 📦</div>
      </div>

      <div className="bg-slate-900/90 border border-slate-700/70 rounded-xl p-5 mb-6 backdrop-blur shadow-xl relative">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            📦
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">はこ</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">INTP / ILI (9w8)</span>
            </div>
            <p className="text-sm sm:text-base text-cyan-100 font-medium leading-relaxed italic">
              {hakoMessage}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'doors' && (
          <motion.div key="doors" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {(['扉 α', '扉 β', '扉 γ'] as const).map((door, idx) => (
                <button
                  key={door}
                  id={`door-btn-${idx}`}
                  onClick={() => handleChooseDoor(door)}
                  className="group flex flex-col items-center justify-center p-6 rounded-xl bg-slate-900/70 border border-slate-700 hover:border-cyan-400/80 hover:bg-slate-800/80 transition-all cursor-pointer shadow-lg active:scale-95"
                >
                  <DoorClosed className="w-10 h-10 text-slate-400 group-hover:text-cyan-300 transition-colors mb-2" />
                  <span className="text-sm font-bold text-slate-200 group-hover:text-white font-mono">{door}</span>
                  <span className="text-[10px] text-slate-400 mt-1">開ける</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                id="observe-door-btn"
                onClick={handleObserve}
                className="px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 hover:border-slate-600 text-xs text-slate-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>扉を開けずに構造を観察する</span>
              </button>

              <button
                id="pass-to-hako-btn"
                onClick={handlePassToHako}
                className="px-4 py-2.5 rounded-lg bg-indigo-950/50 border border-indigo-700/50 hover:border-indigo-500 text-xs text-indigo-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 font-medium"
              >
                <CornerDownRight className="w-4 h-4 text-indigo-400" />
                <span>「はこが決めて」と丸投げする</span>
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'why' && (
          <motion.div key="why" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-2.5">
            <div className="text-xs font-mono text-cyan-400 mb-2">【問】あなたがその選択を下した理由は？</div>
            {!passedToHako ? (
              <>
                <button onClick={() => handleAnswerWhy('intuition')} className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800/80 transition-all text-sm cursor-pointer">
                  A. 「直感。なんとなくこれだと思ったから。」
                </button>
                <button onClick={() => handleAnswerWhy('logic')} className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800/80 transition-all text-sm cursor-pointer">
                  B. 「一番合理的だから。」
                </button>
                <button onClick={() => handleAnswerWhy('elimination')} className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800/80 transition-all text-sm cursor-pointer">
                  C. 「消去法。他のほうが地雷っぽかったから。」
                </button>
                <button onClick={() => handleAnswerWhy('infinite_loop')} className="w-full text-left p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 hover:border-purple-400 hover:bg-purple-900/50 transition-all text-sm text-purple-200 cursor-pointer">
                  D. 「……なんでそう思ったのか、考えてたらわからなくなった。」
                </button>
              </>
            ) : (
              <>
                <button onClick={() => handleAnswerWhy('intuition')} className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800/80 transition-all text-sm cursor-pointer">
                  A. 「自分で決めるのが面倒だったから。」
                </button>
                <button onClick={() => handleAnswerWhy('logic')} className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800/80 transition-all text-sm cursor-pointer">
                  B. 「ぼく（はこ）の選択が見てみたかったから。」
                </button>
                <button onClick={() => handleAnswerWhy('infinite_loop')} className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-cyan-400 hover:bg-slate-800/80 transition-all text-sm cursor-pointer">
                  C. 「……運命を委ねたかったから。」
                </button>
              </>
            )}

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick(350);
                  setStage('doors');
                  setPassedToHako(false);
                  setSelectedDoor(null);
                  setHakoMessage('「どれでもいいよ。正解なんて知らないし……決めてもらえるなら、それでいいよ。」');
                }}
                className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← 扉の選択に戻る</span>
              </button>
            </div>
          </motion.div>
        )}

        {stage === 'end' && (
          <motion.div key="end" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>1F CLEAR ── 思考ログを保存しました</span>
            </div>

            <div>
              <button onClick={handleNextFloor} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer">
                <span>2F（🥺 ダーリンちゃんの部屋）へ登る</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  sound.playClick(350);
                  setStage('why');
                }}
                className="text-xs text-slate-400 hover:text-cyan-400 cursor-pointer transition-colors"
              >
                ← 理由を選び直す
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
