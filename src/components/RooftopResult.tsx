import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Share2, Award, BarChart3, Building, Eye, Download, Copy, Send, Play, Square, Volume2, MessageCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import domtoimage from 'dom-to-image-more';
import { CharacterProfile, TowerParameters, Achievement, GlobalState, KirigirisNote } from '../types';
import { MAX_TOWER_PARAMS, ALL_ACHIEVEMENTS } from '../data/characters';
import { sound } from '../utils/sound';
import { sendDiagnosticResultToGAS } from '../utils/gas';
import aliceImg from '../assets/images/alice.png';
import eijiImg from '../assets/images/eiji.png';
import gohobiImg from '../assets/images/gohobi.png';

interface RooftopResultProps {
  profile: CharacterProfile;
  parameters: TowerParameters;
  globalState: GlobalState;
  setGlobalState: React.Dispatch<React.SetStateAction<GlobalState>>;
  unlockedAchievementIds: string[];
  allAchievements: Achievement[];
  onRestart: () => void;
}

// ダーリンちゃん悪口・反発検知トリガーキーワード
const TRIGGER_KEYWORDS = [
  'きも', 'うざ', 'ウザ', 'イラ', '苛', 'いらっ', '嫌い', 'うるさ', 'だる', 'あんぽんたん', 'いいえ',
  'アンポンタン', 'キモ', 'ゴミ', 'カス', 'オエー', 'おえー', 'きしょ', 'キショ', 'しね', 
  '死ね', 'やめて', 'いや', 'やめろ', '💢', '好きじゃない', '苦手', 'きらい', '関わりたくない',  
  '思ったか', '反対', '失せろ', '黙', '殲滅', 'うんこ', 'うせろ', '面倒', 'NO',  
  'no', '帰れ', 'kiero', 'は？', 'ハ？', 'はあ', 'ハア', 'あっそ', 'あっそー', 'どうでもいい', 
  'くだらない', 'くだらね', 'つまらん', 'つまんね', '意味分からん', '意味不明', '勝手にしろ', 
  '勝手に言っとけ', '消えろ', '消えろや', '引っ込んでろ', '黙れ', 'ダマレ', 'だまれ', 'キチガイ', 
  'バカ', 'ばか', 'アホ', 'あほ', '不快', '腹立つ', 'ムカつく', 'むかつく', '煽るな', 'ふざけ', 'クソ', 'くそ', '💩'
];

interface DarlingObservation {
  category: string;
  rankBadge: string;
  emoji: string;
  speech: string;
  analysis: string;
}

export const RooftopResult: React.FC<RooftopResultProps> = ({
  profile,
  parameters,
  globalState,
  setGlobalState,
  unlockedAchievementIds,
  allAchievements,
  onRestart,
}) => {
  const [phase, setPhase] = useState<'feedback' | 'result'>('feedback');
  const [impression, setImpression] = useState('');
  const [observation, setObservation] = useState<DarlingObservation | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // キリギリス曲再生ステート
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicCurrentTime, setMusicCurrentTime] = useState<number>(0);
  const musicTimerRef = useRef<number | null>(null);
  const musicStartTimeRef = useRef<number>(0);
  const scheduledTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // GAS 送信トリガー（二重送信防止：リザルト表示時に送信）
  const hasSentToGasRef = useRef<boolean>(false);
  useEffect(() => {
    if (phase === 'result' && !hasSentToGasRef.current) {
      hasSentToGasRef.current = true;
      const effectiveObservation = observation || analyzeImpression(impression || globalState.finalImpression);
      const hasRooftopLog = globalState.actionLogs.some((l) => l.floor === '屋上' || l.floor === 'ROOFTOP');
      const actionLogs = hasRooftopLog
        ? globalState.actionLogs
        : [
            ...globalState.actionLogs,
            {
              floor: '屋上',
              action: `【ダーリンちゃんの感想】「${effectiveObservation.speech}」 (プレイヤー感想: 「${impression || globalState.finalImpression || 'なし'}」)`,
            },
          ];

      sendDiagnosticResultToGAS({
        profile,
        parameters,
        globalState: {
          ...globalState,
          finalImpression: impression || globalState.finalImpression,
          actionLogs,
        },
        unlockedAchievementIds,
        darlingObservation: effectiveObservation,
        rooftopComment: effectiveObservation.speech,
      });
    }
  }, [phase, profile, parameters, globalState, unlockedAchievementIds, impression, observation]);

  useEffect(() => {
    if (phase === 'result') {
      sound.playSuccess();
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    }
  }, [phase]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (musicTimerRef.current) cancelAnimationFrame(musicTimerRef.current);
      scheduledTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // ダーリン最終観測の判定
  const analyzeImpression = (text: string): DarlingObservation => {
    const lower = text.toLowerCase();

    // 1. トリガーワード（悪口・反発）検知
    const hasTrigger = TRIGGER_KEYWORDS.some((kw) => text.includes(kw) || lower.includes(kw.toLowerCase()));
    if (hasTrigger) {
      return {
        category: '反逆・敵対検知',
        rankBadge: '危険被験体（特級反骨種）',
        emoji: '😈',
        speech:
          '「……あら？ 最後の最後まで私にそんな噛みつき方してくれるんだ？♡ ふふ、最高。私の観測ログに一番深く爪痕を残してくれたわ、ダーリン♡ そういう剥き出しの本音、大好物よ。」',
        analysis:
          '演出仮面（Fe）に迎合せず、観測者へ露骨な反発・反骨心を叩きつけた最も危険で魅力的なデータ。欺瞞を打ち砕く野生の意志を検出。',
      };
    }

    // 2. 出汁・豚骨
    if (text.includes('出汁') || text.includes('豚骨') || text.includes('ご褒美') || text.includes('縫')) {
      return {
        category: '出汁・油汚染検知',
        rankBadge: '超耐久型（胃袋鉄壁種）',
        emoji: '🐷',
        speech:
          '「出汁……？ ダーリン、まさかあの風呂上がり豚骨スープを本当に飲み干したの……？ 匂いがここまで漂ってきそうだけど……ふふ、ダーリンが喜んでるなら許してあげる♡」',
        analysis:
          'ドM豚骨生命体の狂気的な出汁を全身で受け止め、独自の快楽原則へと昇華。どんな過酷な状況でも生き延びる圧倒的な包容力。',
      };
    }

    // 3. 筋肉・えいじ・汗
    if (text.includes('筋肉') || text.includes('えいじ') || text.includes('汗') || text.includes('筋トレ')) {
      return {
        category: '筋肉侵食検知',
        rankBadge: '熱血脳筋被験体',
        emoji: '💪',
        speech:
          '「筋肉？ えいじの汗ポカリに毒されてない？ 私という可憐な観測者が目の前にいるのに、筋肉ばかり見つめるなんてお仕置きが必要ね♡」',
        analysis:
          '思考停止のパンプアップと熱血波動に誘惑されつつも、強靭なフィジカルでタワーを踏破した直情型の肉体派被験体。',
      };
    }

    // 4. 構造・論理・芋虫・蝶・LSI・矛盾
    if (
      text.includes('構造') ||
      text.includes('論理') ||
      text.includes('理屈') ||
      text.includes('芋虫') ||
      text.includes('蝶') ||
      text.includes('モルフォ') ||
      text.includes('LSI')
    ) {
      return {
        category: '論理構造解体検知',
        rankBadge: '純粋知性生命（構造統括種）',
        emoji: '🦋',
        speech:
          '「……ふふ、やっぱり構造が気になっちゃった？ 私の演出仮面の裏側まで透かして見ようとするその視線、ゾクゾクしたわ♡」',
        analysis:
          '感情の揺らぎや雰囲気のノイズを数理モデルとして淡々と分解。世界のバグと骨組みだけを見つめ抜いた冷徹な観察眼を認証。',
      };
    }

    // 5. ララ・屁理屈・ルール・穴
    if (text.includes('ララ') || text.includes('ルール') || text.includes('穴') || text.includes('屁理屈') || text.includes('鳥')) {
      return {
        category: 'ルールハッカー検知',
        rankBadge: '規則攪乱者（盲点侵入種）',
        emoji: '🐦',
        speech:
          '「ララの屁理屈に付き合ってあげたのね。ルールの穴を探すその視線、私を翻弄しようとする気配を感じてゾクゾクしたわ♡」',
        analysis:
          '決められた枠組みを素直に受け入れず、常にシステムの裏口と抜け穴を探し続けた知性派トリックスター。',
      };
    }

    // 6. ポジティブ（楽しい、好き、最高、面白、神、愛、感謝など）
    if (
      text.includes('楽し') ||
      text.includes('好き') ||
      text.includes('最高') ||
      text.includes('面白') ||
      text.includes('神') ||
      text.includes('愛') ||
      text.includes('ありがと') ||
      text.includes('嬉し')
    ) {
      return {
        category: '高共鳴・愛着検知',
        rankBadge: '完全調和被験体（最愛ダーリン）',
        emoji: '🥺',
        speech:
          '「ふふ♡ ダーリン、最後まで結構楽しんでたでしょう？ 私のことも少しは好きになってくれたかしら？ また退屈を壊しに来てね♡」',
        analysis:
          'タワーの実験とFe仮面の戯れを丸ごと肯定的に享受。観測者とのエンゲージメントが極限値に達した模範的ダーリン。',
      };
    }

    // 7. 通常
    return {
      category: '自由散策・独自観測',
      rankBadge: '直感型漂流体',
      emoji: '✨',
      speech:
        '「ふふ♡ ダーリンの率直な言葉、私のコアメモリにしっかり刻んでおいたわ。この塔のてっぺんからの景色、悪くなかったでしょう？」',
      analysis:
        '既成の枠にとらわれず、自分自身のペースと感覚でタワーを味わい尽くしたマイペースな観測対象。',
    };
  };

  const handleSubmitImpression = () => {
    sound.playClick(600);
    const obs = analyzeImpression(impression);
    setObservation(obs);

    const rooftopLog = {
      floor: '屋上',
      action: `【ダーリンちゃんの感想】「${obs.speech}」 (プレイヤー感想: 「${impression}」)`,
    };

    const updatedGlobalState = {
      ...globalState,
      finalImpression: impression,
      actionLogs: [...globalState.actionLogs, rooftopLog],
    };

    setGlobalState(updatedGlobalState);

    // GAS へダーリンちゃんの感想と屋上ログを直接即時送信
    hasSentToGasRef.current = true;
    sendDiagnosticResultToGAS({
      profile,
      parameters,
      globalState: updatedGlobalState,
      unlockedAchievementIds,
      darlingObservation: obs,
      rooftopComment: obs.speech,
    });

    setPhase('result');
  };

  // キリギリス音楽再生ハンドラー
  const stopMusic = () => {
    setIsPlayingMusic(false);
    if (musicTimerRef.current) cancelAnimationFrame(musicTimerRef.current);
    scheduledTimeoutsRef.current.forEach(clearTimeout);
    scheduledTimeoutsRef.current = [];
    setMusicCurrentTime(0);
  };

  const sessionNotes = globalState.kirigirisSession || [];

  const playMusic = () => {
    stopMusic();
    sound.playClick(500);
    setIsPlayingMusic(true);
    musicStartTimeRef.current = Date.now();

    sessionNotes.forEach((note) => {
      const t = setTimeout(() => {
        sound.playInstrument(note.type, note.freq);
      }, note.time);
      scheduledTimeoutsRef.current.push(t);
    });

    const updateLoop = () => {
      const elapsed = Date.now() - musicStartTimeRef.current;
      const sec = elapsed / 1000;
      if (sec >= 30) {
        setMusicCurrentTime(30);
        setIsPlayingMusic(false);
      } else {
        setMusicCurrentTime(sec);
        musicTimerRef.current = requestAnimationFrame(updateLoop);
      }
    };
    musicTimerRef.current = requestAnimationFrame(updateLoop);
  };

  const isMobileDevice = () => {
    if (typeof window === 'undefined') return false;
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      (window.matchMedia && window.matchMedia('(max-width: 768px)').matches)
    );
  };

  const handleShare = async () => {
    sound.playClick(600);
    const text = `【NIGHT TOWER 診断結果】
私は【${profile.emoji} ${profile.name}】（${profile.subTitle}）でした！

生成タワー: 『${profile.towerType.title}』
命名: 『${globalState.customTowerName || '名もなき塔'}』
実績獲得数: ${unlockedAchievementIds.length}/${ALL_ACHIEVEMENTS.length}

#NIGHTTOWER #性格診断`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NIGHT TOWER 診断結果',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
      window.open(url, '_blank');
    }
  };

  // PCと同じ横幅（680px）でスマートフォンでも安定したサイズで保存
  const handleDownloadImage = async () => {
    if (!resultRef.current || isCapturing) return;
    sound.playClick(400);
    setIsCapturing(true);

    const element = resultRef.current;
    const originalWidth = element.style.width;
    const originalMaxWidth = element.style.maxWidth;

    try {
      // 一時的にPC幅（680px）固定に設定
      element.style.width = '680px';
      element.style.maxWidth = '680px';

      const dataUrl = await domtoimage.toPng(element, {
        bgcolor: '#090d16',
        width: 680,
        style: {
          transform: 'none',
          width: '680px',
          maxWidth: '680px',
          margin: '0 auto',
        },
      });

      if (isMobileDevice()) {
        // スマホの場合は画像長押し保存モーダルを表示
        setPreviewImageUrl(dataUrl);
      } else {
        // PCの場合は即座にファイルダウンロード
        const link = document.createElement('a');
        link.download = `night_tower_${profile.id}_result.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to capture image', err);
    } finally {
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      setIsCapturing(false);
    }
  };

  const handleCopyLogs = () => {
    sound.playClick(400);
    const logText = globalState.actionLogs.map((log) => `${log.floor}: ${log.action}`).join('\n');
    const logs = `NIGHT TOWER 行動ログ\n・7F 命名: 『${globalState.customTowerName || '名もなき塔'}』\n・最終感想: 「${globalState.finalImpression}」\n\n【詳細な行動履歴】\n${logText}\n\n・実績: ${unlockedAchievementIds.length}個獲得\n・結果: ${profile.name}`;
    navigator.clipboard.writeText(logs);
    alert('行動ログをすべてクリップボードにコピーしました！');
  };

  const paramBars = [
    { label: '構造把握', value: Math.min(100, Math.round((parameters.structure / MAX_TOWER_PARAMS.structure) * 100)), color: 'from-blue-500 to-cyan-400' },
    { label: '演出・仮面適応', value: Math.min(100, Math.round(((parameters.acting + parameters.feActing) / (MAX_TOWER_PARAMS.acting + MAX_TOWER_PARAMS.feActing)) * 100)), color: 'from-pink-500 to-purple-400' },
    { label: '情熱・燃料度', value: Math.min(100, Math.round((parameters.fuel / MAX_TOWER_PARAMS.fuel) * 100)), color: 'from-emerald-500 to-teal-400' },
    { label: '混沌・反逆度', value: Math.min(100, Math.round((parameters.chaos / MAX_TOWER_PARAMS.chaos) * 100)), color: 'from-amber-500 to-rose-400' },
    { label: '流動・受け流し', value: Math.min(100, Math.round((parameters.flow / MAX_TOWER_PARAMS.flow) * 100)), color: 'from-indigo-500 to-blue-400' },
  ];

  if (phase === 'feedback') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-xl mx-auto px-4 py-12 text-slate-200">
        <div className="bg-slate-900/90 border border-pink-500/30 rounded-3xl p-8 backdrop-blur shadow-[0_0_40px_rgba(236,72,153,0.15)] space-y-6">
          <div className="flex justify-center mb-4"><div className="text-6xl animate-bounce">🥺</div></div>
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold text-pink-300">「ねぇ、ダーリン♡」</h2>
            <p className="text-pink-100">ここまで登ってきた感想……最後に聞かせて？</p>
          </div>
          <textarea
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            placeholder="楽しかった、意味不明、出汁がヤバい、ウザかった etc..."
            className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-white focus:border-pink-500 focus:outline-none min-h-[120px]"
          />
          <button
            onClick={handleSubmitImpression}
            disabled={!impression.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-900 font-bold shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Send className="w-5 h-5" /> 感想を伝えて結果を見る
          </button>
        </div>
      </motion.div>
    );
  }

  const musicPercent = Math.min(100, (musicCurrentTime / 30) * 100);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto px-4 py-8 text-slate-200 space-y-8">
      
      {/* 🥺 ダーリンの最終観測レポートカード */}
      {observation && (
        <div className="p-5 bg-gradient-to-r from-pink-950/60 via-purple-950/40 to-slate-900/80 border border-pink-500/50 rounded-3xl shadow-[0_0_30px_rgba(236,72,153,0.2)] space-y-3">
          <div className="flex items-center justify-between border-b border-pink-500/30 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{observation.emoji}</span>
              <span className="text-sm font-bold text-pink-300 tracking-wider">ダーリンの最終観測</span>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-pink-950 border border-pink-500/60 text-pink-300 font-bold">
              {observation.rankBadge}
            </span>
          </div>

          <div className="text-sm sm:text-base font-medium text-pink-100 italic leading-relaxed">
            {observation.speech}
          </div>

          <div className="bg-slate-950/70 p-3 rounded-xl border border-pink-900/40 text-xs text-pink-200/90 leading-relaxed">
            <span className="font-bold text-pink-400 mr-1.5">【観測所見】</span>
            {observation.analysis}
          </div>
        </div>
      )}

      {/* 🦗 キリギリスとの思い出セッション（30s）プレイヤー */}
      <div className="bg-slate-900/90 border border-purple-500/40 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦗</span>
            <div>
              <div className="text-xs font-bold text-purple-300">
                6F キリギリスとの思い出セッション {sessionNotes.length > 0 ? `(${sessionNotes.length}音)` : '（静寂の30秒）'}
              </div>
              <div className="text-[11px] text-slate-400">
                {sessionNotes.length > 0
                  ? 'あなたが即興で刻んだメロディ（30秒間）'
                  : '何も鳴らさなかった静寂の即興トラック（30秒間）'}
              </div>
            </div>
          </div>
          <div className="text-xs font-mono text-purple-300 font-bold">
            {musicCurrentTime.toFixed(1)}s / 30.0s
          </div>
        </div>

        {/* 30秒バー */}
        <div className="relative w-full h-7 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex items-center px-1">
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-35 transition-all duration-75"
            style={{ width: `${musicPercent}%` }}
          />

          {[5, 10, 15, 20, 25].map((sec) => (
            <div
              key={sec}
              className="absolute top-0 bottom-0 w-px bg-slate-800 pointer-events-none"
              style={{ left: `${(sec / 30) * 100}%` }}
            >
              <span className="absolute bottom-0.5 -translate-x-1/2 text-[8px] font-mono text-slate-600">
                {sec}s
              </span>
            </div>
          ))}

          {sessionNotes.map((note, index) => {
            const notePercent = Math.min(100, (note.time / 30000) * 100);
            const isPassed = musicCurrentTime * 1000 >= note.time;
            return (
              <div
                key={index}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                style={{ left: `${notePercent}%` }}
              >
                <div
                  className={`w-2 h-2 rounded-full border transition-all ${
                    isPassed && isPlayingMusic
                      ? 'bg-amber-300 border-amber-100 scale-125 shadow-[0_0_6px_#fcd34d]'
                      : 'bg-purple-400/80 border-purple-200'
                  }`}
                />
              </div>
            );
          })}

          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-300 shadow-[0_0_8px_#fde047] z-20 pointer-events-none transition-all duration-75"
            style={{ left: `${musicPercent}%` }}
          />
        </div>

        <div className="flex justify-center pt-1">
          {!isPlayingMusic ? (
            <button
              onClick={playMusic}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{sessionNotes.length > 0 ? 'セッションを再生する（30s）' : '静寂トラックを再生する（30s）'}</span>
            </button>
          ) : (
            <button
              onClick={stopMusic}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              <Square className="w-3.5 h-3.5 fill-slate-300" />
              <span>停止する</span>
            </button>
          )}
        </div>
      </div>

      {/* メインリザルトカード（キャプチャ対象） */}
      <div ref={resultRef} className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur shadow-[0_0_40px_rgba(245,158,11,0.15)] relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="text-center pb-2">
          <div className="inline-block px-4 py-1 rounded-full bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono">
            NIGHT TOWER OBSERVATION REPORT
          </div>
        </div>

        {/* キャラクタータイトル・LSI完全体などの改行対策（break-keep & inline-block） */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center text-5xl shadow-2xl shrink-0 overflow-hidden relative">
            {profile.id === 'darling_ili' ? (
              <img
                src={aliceImg}
                alt="アリス（完全ILI）"
                className="w-full h-full object-cover object-center"
              />
            ) : profile.id === 'eiji' ? (
              <img
                src={eijiImg}
                alt="えいじ"
                className="w-full h-full object-cover object-center"
              />
            ) : profile.id === 'gohoubi' ? (
              <img
                src={gohobiImg}
                alt="ご褒美"
                className="w-full h-full object-cover object-center"
              />
            ) : (
              profile.emoji
            )}
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="text-xs font-mono font-bold text-amber-400 tracking-wider">{profile.subTitle}</div>
            
            {/* 改行防止：break-keep と inline-block を適用 */}
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide break-keep" style={{ wordBreak: 'keep-all', overflowWrap: 'break-word' }}>
              <span className="inline-block">{profile.name}</span>
            </h2>

            <div className="inline-block mt-1">
              <span className="px-3 py-1 rounded-lg bg-amber-950/80 border border-amber-700 text-xs font-mono text-amber-300 font-bold">
                {profile.typeBadge}
              </span>
            </div>
          </div>
        </div>

        {/* キャラクタースピーチ */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-center italic text-sm sm:text-base text-amber-200 font-medium leading-relaxed">
          {profile.speech}
        </div>

        {/* 💬 結果キャラからのコメント（ユーザー指定） */}
        {profile.residentComment && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950/60 to-slate-900 border border-amber-500/40 space-y-1.5 shadow-inner">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <MessageCircle className="w-4 h-4" />
              <span>{profile.residentComment.name} からのメッセージ</span>
            </div>
            <p className="text-sm font-medium text-amber-100 italic leading-relaxed pl-1">
              {profile.residentComment.comment}
            </p>
          </div>
        )}

        {/* コア特性 ＆ 観測ログ */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-mono text-slate-400 font-bold tracking-wider flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>【 コア特性 ＆ 観測ログ 】</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
            {profile.description}
          </p>
        </div>

        {/* タワー構造 ＆ 7F 命名ログのわかりやすい表示 */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
            <Building className="w-4 h-4" />
            <span>あなたのアクションから生成されたタワー構造</span>
          </div>
          <div className="text-base font-bold text-white">『{profile.towerType.title}』</div>
          <p className="text-xs text-slate-400 leading-relaxed">{profile.towerType.description}</p>
          
          {/* 7F 命名ログのハイライト表示 */}
          <div className="mt-2 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
            <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1.5">
              <span>🏛️</span>
              <span>7F あなたが命名したタワー名</span>
            </span>
            <span className="text-sm font-black text-cyan-100 px-3 py-1 rounded-lg bg-cyan-950 border border-cyan-600/70 shadow-[0_0_10px_rgba(6,182,212,0.25)] text-center">
              『{globalState.customTowerName || '名もなき塔'}』
            </span>
          </div>
        </div>

        {/* パラメータ分布 */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>タワー内部パラメータ分布</span>
          </div>
          <div className="space-y-2.5">
            {paramBars.map((bar, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">{bar.label}</span>
                  <span className="text-cyan-400 font-bold">{Math.round(bar.value)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <motion.div className={`h-full bg-gradient-to-r ${bar.color}`} initial={{ width: 0 }} animate={{ width: `${bar.value}%` }} transition={{ duration: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 実績バッジ */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Award className="w-4 h-4 text-amber-400" />
            <span>獲得した実績バッジ ({unlockedAchievementIds.length} / {allAchievements.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allAchievements.map((ach) => {
              const isUnlocked = unlockedAchievementIds.includes(ach.id);
              return (
                <div key={ach.id} className={`p-3 rounded-xl border flex items-start gap-2.5 ${isUnlocked ? 'bg-amber-950/30 border-amber-500/40 text-amber-200' : 'bg-slate-950/40 border-slate-800/60 text-slate-600 opacity-60'}`}>
                  <span className="text-xl shrink-0">{ach.emoji}</span>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold font-mono">{ach.title} {isUnlocked && <span className="ml-1 text-[10px] text-amber-400">CLEARED</span>}</div>
                    <div className="text-[11px] opacity-80">{ach.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 詳細な行動ログ */}
      <div className="bg-slate-900/90 border border-slate-700/50 rounded-3xl p-6 backdrop-blur space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-300">
          <Copy className="w-4 h-4 text-cyan-400" />
          <span>詳細な行動ログ</span>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2 pr-2 text-xs font-mono text-slate-400">
          {globalState.actionLogs.map((log, i) => (
            <div key={i} className="bg-slate-950/50 p-2 rounded border border-slate-800">
              <span className="text-cyan-500 mr-2">{log.floor}</span>
              {log.action}
            </div>
          ))}
          {globalState.finalImpression && (
            <div className="bg-slate-950/50 p-2 rounded border border-slate-800 text-pink-300">
              <span className="text-pink-500 mr-2">ROOFTOP</span>
              【最終感想】 {globalState.finalImpression}
            </div>
          )}
        </div>
      </div>

      {/* 操作ボタン一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button onClick={handleShare} className="py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 font-bold text-slate-900 text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
          <Share2 className="w-4 h-4" /> 診断結果をシェア
        </button>
        <button onClick={handleDownloadImage} disabled={isCapturing} className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold text-white text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-50">
          <Download className="w-4 h-4" /> {isCapturing ? '生成中...' : isMobileDevice() ? '画像を保存（長押し）' : '結果画像を保存'}
        </button>
        <button onClick={handleCopyLogs} className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold text-white text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
          <Copy className="w-4 h-4" /> 行動ログをコピー
        </button>
        <button onClick={onRestart} className="py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-600 font-bold text-white text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all">
          <RefreshCw className="w-4 h-4" /> もう一度登る
        </button>
      </div>

      {/* 📱 スマホ用：画像長押し保存モーダル（スクロール ＆ 閉じるボタン完備） */}
      {previewImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-slate-900 border border-amber-500/50 rounded-3xl p-4 sm:p-5 shadow-[0_0_50px_rgba(245,158,11,0.2)] flex flex-col items-center">
            {/* モーダルヘッダー */}
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <span>📱 画像を長押しして保存</span>
              </div>
              <button
                onClick={() => setPreviewImageUrl(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer active:scale-90 transition-all"
                title="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 mb-2 text-center leading-relaxed">
              下の画像を<strong className="text-amber-300">長押し</strong>して<br />
              <span className="text-amber-400 font-bold">「写真に追加」</span> または <span className="text-amber-400 font-bold">「画像を保存」</span> を選んでね！
            </p>

            {/* スクロール可能な画像領域 */}
            <div className="w-full overflow-y-auto max-h-[60vh] rounded-2xl border border-slate-800 bg-slate-950 p-2 my-2 shadow-inner">
              <img
                src={previewImageUrl}
                alt="NIGHT TOWER 診断結果"
                className="w-full h-auto rounded-xl shadow-md block mx-auto pointer-events-auto select-none"
              />
            </div>

            {/* 閉じるボタン */}
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-900 font-bold text-sm cursor-pointer shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4" /> 閉じる
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
