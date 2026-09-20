import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Play, Square, Volume2 } from 'lucide-react';
import { TowerParameters, GlobalState, KirigirisNote } from '../types';
import { sound } from '../utils/sound';

interface Floor6KirigirisProps {
  onComplete: (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => void;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
}

export const Floor6Kirigiris: React.FC<Floor6KirigirisProps> = ({ onComplete, setGlobalState }) => {
  const [phase, setPhase] = useState<'rhythm' | 'cleared'>('rhythm');
  const [kirigirisMessage, setKirigirisMessage] = useState<string>(
    '「好きな楽器鳴らしてみて！ 適当でいいよ、未来は何とかなるから〜！」'
  );
  const [timer, setTimer] = useState<number>(30);
  const [playedInstruments, setPlayedInstruments] = useState<KirigirisNote[]>([]);
  const startTime = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 再生プレイヤー用ステート
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackTime, setPlaybackTime] = useState<number>(0);
  const playTimerRef = useRef<number | null>(null);
  const playbackStartTimeRef = useRef<number>(0);
  const scheduledTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // クリーンアップ用
  useEffect(() => {
    return () => {
      if (playTimerRef.current) cancelAnimationFrame(playTimerRef.current);
      scheduledTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // 30秒カウントダウンタイマー
  useEffect(() => {
    if (phase !== 'rhythm') return;
    startTime.current = Date.now();
    const interval = setInterval(() => {
      setTimer((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const handleTimeUp = () => {
    sound.playSweetFe();
    if (playedInstruments.length === 0) {
      setKirigirisMessage('🦗「……静かな曲もいいよね。最高！！🌸 CLEAR！」');
    } else {
      setKirigirisMessage(`🦗「${playedInstruments.length}回も鳴らしてくれたんだ！ なんかすごい曲になったね！ 適当でも形になるじゃん！🌸 CLEAR！」`);
    }
    setPhase('cleared');
    setGlobalState((prev) => ({
      ...prev,
      kirigirisSession: playedInstruments,
    }));
  };

  // timerが0になったら安全にhandleTimeUpをトリガー
  useEffect(() => {
    if (phase === 'rhythm' && timer === 0) {
      handleTimeUp();
    }
  }, [timer, phase]);

  const instruments: { id: string; emoji: string; name: string; type: 'drum' | 'piano' | 'guitar'; freq: number }[] = [
    { id: 'drum', emoji: '🥁', name: 'ドラム', type: 'drum', freq: 150 },
    { id: 'piano', emoji: '🎹', name: 'ピアノ', type: 'piano', freq: 440 },
    { id: 'guitar', emoji: '🎸', name: 'ギター', type: 'guitar', freq: 330 },
    { id: 'synth_high', emoji: '🎹✨', name: '高音シンセ', type: 'piano', freq: 880 },
    { id: 'bass', emoji: '🎸⚡', name: 'ベース', type: 'guitar', freq: 110 },
  ];

  const handlePlay = (id: string, type: 'drum' | 'piano' | 'guitar', freq: number) => {
    sound.playInstrument(type, freq);
    const relTime = Date.now() - startTime.current;
    const note: KirigirisNote = { id, time: relTime, type, freq };
    setPlayedInstruments((prev) => [...prev, note]);
    if (playedInstruments.length === 4) {
      setKirigirisMessage('🦗「いいねいいね〜！ その調子！」');
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (playTimerRef.current) cancelAnimationFrame(playTimerRef.current);
    scheduledTimeoutsRef.current.forEach(clearTimeout);
    scheduledTimeoutsRef.current = [];
    setPlaybackTime(0);
  };

  const handlePlayback = () => {
    stopPlayback();
    sound.playClick(500);
    setIsPlaying(true);
    setKirigirisMessage('🦗「オッケー！ 30秒の即興セッション、再生するね〜！」');
    
    playbackStartTimeRef.current = Date.now();

    // 楽器音のタイマースケジュール
    playedInstruments.forEach((note) => {
      const t = setTimeout(() => {
        sound.playInstrument(note.type, note.freq);
      }, note.time);
      scheduledTimeoutsRef.current.push(t);
    });

    // 30秒のタイムラインアニメーションループ
    const updateProgress = () => {
      const elapsed = Date.now() - playbackStartTimeRef.current;
      const progressSec = elapsed / 1000;
      if (progressSec >= 30) {
        setPlaybackTime(30);
        setIsPlaying(false);
        setKirigirisMessage('🦗「ふぅ〜！ 最高の30秒間だったね！！」');
      } else {
        setPlaybackTime(progressSec);
        playTimerRef.current = requestAnimationFrame(updateProgress);
      }
    };
    playTimerRef.current = requestAnimationFrame(updateProgress);
  };

  const handleNextFloor = () => {
    stopPlayback();
    sound.playElevator();
    setGlobalState((prev) => ({
      ...prev,
      kirigirisSession: playedInstruments,
    }));

    const noteCount = playedInstruments.length;
    let flowGain = 20;
    let chaosGain = 15;
    if (noteCount === 0) {
      flowGain = 35;
      chaosGain = 0;
    } else if (noteCount >= 20) {
      flowGain = 35;
      chaosGain = 25;
    } else if (noteCount >= 10) {
      flowGain = 25;
      chaosGain = 15;
    }

    onComplete(
      { chaos: chaosGain, flow: flowGain, acting: 10 },
      noteCount === 0 ? ['kirigiris_rest'] : [],
      { floor: '6F', action: `【キリギリス】楽器を${noteCount}回鳴らして30秒セッションした` }
    );
  };

  const currentPercent = Math.min(100, (playbackTime / 30) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-xl mx-auto px-4 py-6 text-slate-200 relative z-10">
      <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-400 font-mono text-xs font-bold">6F</span>
          <h2 className="text-lg font-bold text-white tracking-wide">キリギリス・ジャムセッション</h2>
        </div>
        <div className="text-xs font-mono text-purple-300">RESIDENT: 🦗 キリギリス</div>
      </div>

      <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 mb-6 backdrop-blur flex items-start gap-3">
        <div className="w-14 h-14 rounded-2xl bg-purple-950/60 border border-purple-500/50 flex items-center justify-center text-3xl shrink-0 shadow-lg">🦗</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-300">キリギリス</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400">ENFP / EIE (7w6)</span>
          </div>
          <p className="text-sm sm:text-base text-purple-100 font-medium leading-relaxed italic">{kirigirisMessage}</p>
        </div>
      </div>

      {phase === 'rhythm' && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-6">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>🎵 即興セッション録音中...</span>
            <span className="text-purple-400 font-bold">残り: {timer}s</span>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {instruments.map((inst) => (
              <button
                key={inst.id}
                onClick={() => handlePlay(inst.id, inst.type, inst.freq)}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 border border-purple-500/50 hover:bg-purple-900/50 text-3xl sm:text-4xl shadow-lg active:scale-90 transition-all flex items-center justify-center cursor-pointer"
                title={inst.name}
              >
                {inst.emoji}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            <div className="text-xs font-mono text-purple-300">
              打刻した音: {playedInstruments.length} 音
            </div>
            <div className="text-[10px] text-slate-500">
              何も押さずに待つことも、ひとつの音楽です。
            </div>
          </div>
        </div>
      )}

      {phase === 'cleared' && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          
          {/* 30秒セッションプレイヤー & タイムラインバー */}
          <div className="bg-slate-900/90 border border-purple-500/40 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-white">30秒の即興トラック</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300">
                  {playedInstruments.length} 音符
                </span>
              </div>
              <div className="text-xs font-mono text-purple-300 font-bold">
                {playbackTime.toFixed(1)}s / 30.0s
              </div>
            </div>

            {/* 30秒タイムラインシークバー */}
            <div className="relative w-full h-8 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center px-1">
              {/* プログレスバー背景塗り */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-30 transition-all duration-75"
                style={{ width: `${currentPercent}%` }}
              />

              {/* 5秒ごとの目盛り */}
              {[5, 10, 15, 20, 25].map((sec) => (
                <div
                  key={sec}
                  className="absolute top-0 bottom-0 w-px bg-slate-800 pointer-events-none"
                  style={{ left: `${(sec / 30) * 100}%` }}
                >
                  <span className="absolute bottom-0.5 -translate-x-1/2 text-[9px] font-mono text-slate-600">
                    {sec}s
                  </span>
                </div>
              ))}

              {/* 演奏されたノートのピン */}
              {playedInstruments.map((note, index) => {
                const notePercent = Math.min(100, (note.time / 30000) * 100);
                const isPassed = playbackTime * 1000 >= note.time;
                return (
                  <div
                    key={index}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 transition-transform"
                    style={{ left: `${notePercent}%` }}
                    title={`${(note.time / 1000).toFixed(1)}s: ${note.id}`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full border transition-all ${
                        isPassed && isPlaying
                          ? 'bg-amber-300 border-amber-100 scale-125 shadow-[0_0_8px_#fcd34d]'
                          : 'bg-purple-400/80 border-purple-200'
                      }`}
                    />
                  </div>
                );
              })}

              {/* 再生現在地カーソル */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-amber-300 shadow-[0_0_10px_#fde047] z-20 pointer-events-none transition-all duration-75"
                style={{ left: `${currentPercent}%` }}
              />
            </div>

            {/* コントロールボタン */}
            <div className="flex items-center justify-center gap-3 pt-1">
              {!isPlaying ? (
                <button
                  onClick={handlePlayback}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg hover:shadow-purple-500/25 cursor-pointer active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>セッションを再生する</span>
                </button>
              ) : (
                <button
                  onClick={stopPlayback}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all cursor-pointer active:scale-95"
                >
                  <Square className="w-4 h-4 fill-slate-300" />
                  <span>停止する</span>
                </button>
              )}
            </div>
          </div>

          <div className="text-center space-y-4 pt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>6F CLEAR ── 楽観的調和</span>
            </div>
            <div>
              <button
                onClick={handleNextFloor}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-900 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-[0_0_20px_rgba(251,191,36,0.4)] cursor-pointer active:scale-95"
              >
                <span>7F（🌱 つくしの部屋）へ登る</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
