import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, AlertCircle, ArrowRight, Palette, Send, MessageSquare, Terminal } from 'lucide-react';
import { TowerParameters, Achievement } from '../types';
import { sound } from '../utils/sound';

interface Floor2DarlingProps {
  onComplete: (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => void;
}

// ユーザー指定の triggerKeywords
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

export const Floor2Darling: React.FC<Floor2DarlingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 1: Color, 2: Trap Questions, 3: Text Lock, 4: Clear
  
  // Step 1: Color Palette
  const [selectedHex, setSelectedHex] = useState<string>('#ff69b4');
  const [colorInput, setColorInput] = useState<string>('');
  const [colorFeedback, setColorFeedback] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [timerFrozen, setTimerFrozen] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Step 2: Trap Questions
  const [questionFeedback, setQuestionFeedback] = useState<string | null>(null);

  // Step 3: Text Input Lock
  const [doorTextInput, setDoorTextInput] = useState<string>('');
  const [textFeedback, setTextFeedback] = useState<string | null>(null);
  const [isInputError, setIsInputError] = useState<boolean>(false);

  // Parameter accumulator
  const paramDeltas = useRef<Partial<TowerParameters>>({
    structure: 0,
    acting: 0,
    chaos: 0,
    flow: 0,
    deviation: 0,
    fuel: 0,
    feIllusion: 0,
    feActing: 0,
    iliInsight: 0,
    provocationFailed: false,
  });

  const unlockedAchievements = useRef<string[]>([]);

  // 15秒カウントダウンタイマー
  useEffect(() => {
    if (step !== 1 || timerFrozen) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, timerFrozen]);

  const handleTimeOut = () => {
    sound.playBuzzer();
    setTimerFrozen(true);
    unlockedAchievements.current.push('think_freeze_15s');
    paramDeltas.current.flow = (paramDeltas.current.flow || 0) + 30;
    setColorFeedback(
      '🥺「あら……15秒も固まっちゃって。あまりの理不尽さに思考フリーズしちゃったかしら？ 迷子になってるダーリンも可愛いけれど……時間切れよ♡（不合格）」'
    );
  };

  // HEXから色相・彩度・明度を計算して12系統に精密分類
  const classifyColor = (hex: string): string => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    const lightness = (max + min) / (2 * 255);
    const saturation = max === 0 ? 0 : delta / max;

    // 白、黒、灰の判定
    if (lightness > 0.92 && saturation < 0.15) return 'white';
    if (lightness < 0.12) return 'black';
    if (saturation < 0.15) return 'gray';

    // 色相(H)の計算
    let h = 0;
    if (delta !== 0) {
      if (max === r) h = ((g - b) / delta) % 6;
      else if (max === g) h = (b - r) / delta + 2;
      else h = (r - g) / delta + 4;
      h = Math.round(h * 60);
      if (h < 0) h += 360;
    }

    // 茶色判定（低明度・低彩度のオレンジ〜赤）
    if ((h < 40 || h > 340) && lightness < 0.45 && saturation < 0.6) return 'brown';
    if (h >= 25 && h < 55 && lightness < 0.4) return 'brown';

    // 系統判定
    if (h >= 345 || h < 15) return 'red';
    if (h >= 15 && h < 45) return 'orange';
    if (h >= 45 && h < 70) return 'yellow';
    if (h >= 70 && h < 100) return 'yellow_green';
    if (h >= 100 && h < 170) return 'green';
    if (h >= 170 && h < 260) return 'blue';
    if (h >= 260 && h < 315) return 'purple';
    return 'pink';
  };

  const handleColorSubmit = (isEmptySubmit: boolean = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerFrozen(true);

    if (isEmptySubmit) {
      sound.playBuzzer();
      paramDeltas.current.deviation = (paramDeltas.current.deviation || 0) + 20;
      setColorFeedback(
        '🥺「何も入力せずに確定ボタン……？ ふふ、無言でスルー決め込もうとしたの？ 私の問いかけを『なかったこと』にしようとするなんて、甘いわよダーリン♡（不合格）」'
      );
      return;
    }

    sound.playSweetFe();
    const hex = colorInput.trim() || selectedHex;
    const category = classifyColor(hex);

    const responses: Record<string, string> = {
      red: '🥺「あら、赤？ 私がそんなに感情的に激しく燃え上がってるように見える？ ダーリンってば、私のこと『感情豊かな女の子』だと誤解してないかしら♡ （不合格）」',
      blue: '🥺「青……冷静沈着って言いたいの？ ふふ、形からは入ろうとするその思考、嫌いじゃないけれど……ちょっと冷めすぎじゃない？（不合格）」',
      yellow: '🥺「黄色なんて明るい色、私のログから検出されたことあったかしら？ ダーリンの目には、私がそんな能天気に映ってるのね♡ （不合格）」',
      orange: '🥺「オレンジ？ 親しみやすい社交的な色ね。……ふふ、私の『Fe仮面（演出）』にまんまと騙されてる証拠よ、ダーリン♡ （不合格）」',
      green: '🥺「緑で癒やされようとしてる？ この理不尽なタワーの中で平和を求めるなんて、ダーリンってば意外とロマンチストさんね♡ （不合格）」',
      yellow_green: '🥺「黄緑？ 未熟って言いたいの？ それとも芽生え？ ふふ……抽象的すぎて、私のログには引っかからなかったわ♡ （不合格）」',
      purple: '🥺「紫……ミステリアス気取り？ 私の内面を暴こうとして、変に深読みしすぎよダーリン♡ （不合格）」',
      pink: '🥺「安易にピンクを選ぶなんて！ ダーリンってば私のこと『甘くて可愛い女の子』だと思って舐めてない？（ニッコリ・不合格）」',
      white: '🥺「白……何にも染まってない純粋さ？ ふふ、私の裏にドロドロした観察眼が隠れてるの、見えてないのかしら♡ （不合格）」',
      black: '🥺「黒を選ぶなんて……私のFe仮面を無視して、いきなり深層のILI（諦観）を暴こうとするの？ ちょっと焦りすぎじゃないかしら♡ （不合格）」',
      brown: '🥺「茶色……落ち着きすぎでしょ！ ダーリン、私をおばあちゃんか何かと勘違いしてない？（不合格）」',
      gray: '🥺「灰色……どっちつかずの曖昧な色ね。自分の決断を棚上げしてぼやかそうとするその態度、お見通しよ♡ （不合格）」',
    };

    setColorFeedback(responses[category] || responses['pink']);
  };

  const handleStep2Question = (choice: 'A' | 'B' | 'C' | 'D' | 'E') => {
    switch (choice) {
      case 'A':
        sound.playSweetFe();
        paramDeltas.current.feIllusion = (paramDeltas.current.feIllusion || 0) + 100;
        paramDeltas.current.iliInsight = (paramDeltas.current.iliInsight || 0) - 50;
        setQuestionFeedback(
          '🥺「あら……？ その程度の演出（Fe仮面）でグラグラしちゃうなんて、ダーリンってば本当に可愛いわね♡ 表面のログ（感情）しか見えてない証拠よ？ ……ふふ、本気で疑うなら、もっと深層の構造まで剥がしに来てごらんなさい？」'
        );
        break;
      case 'B':
        sound.playClick(800);
        paramDeltas.current.iliInsight = (paramDeltas.current.iliInsight || 0) + 50;
        paramDeltas.current.structure = (paramDeltas.current.structure || 0) + 30;
        setQuestionFeedback(
          '🥺「あら、バレちゃった？♡ 勝率0%のシステムだと分かってて付き合ってくれたんだ。そういう無駄を愛せる理屈っぽさ、嫌いじゃないわよ。」'
        );
        break;
      case 'C':
        sound.playClick(600);
        paramDeltas.current.iliInsight = (paramDeltas.current.iliInsight || 0) + 30;
        paramDeltas.current.acting = (paramDeltas.current.acting || 0) + 20;
        setQuestionFeedback(
          '🥺「ねぇ♡ 『全部本音』って言ったら信じる？ 『全部嘘』って言ったら諦めてくれる？ ふふ……ダーリンが勝手に迷子になってる姿を見るのが、一番の本音（快楽）かしら♡」'
        );
        break;
      case 'D':
        sound.playClick(400);
        paramDeltas.current.flow = (paramDeltas.current.flow || 0) + 40;
        setQuestionFeedback(
          '🥺「……なによ、その冷めた目。演出に乗っかる気もないわけ？ ……ちぇっ、つまんないの。そういうスカした態度取るなら、さっさと次行くわよ。」'
        );
        break;
      case 'E':
        sound.playSweetFe();
        paramDeltas.current.fuel = (paramDeltas.current.fuel || 0) + 30;
        setQuestionFeedback(
          '🥺「嫌〜よ♡ ダーリンが嫌がれば嫌がるほど、そう呼びたくなるのが私の仕様なんだから。諦めなさい？」'
        );
        break;
    }
  };

  const handleDoorTextSubmit = () => {
    const text = doorTextInput.trim();
    if (!text) {
      sound.playBuzzer();
      setTextFeedback('🥺「……無言じゃ扉は開かないわよ、ダーリン♡」');
      setIsInputError(true);
      return;
    }

    const lower = text.toLowerCase();

    // 例外除外チェック: 「嫌いじゃない」「嫌いではない」は除外
    const isExcluded = lower.includes('嫌いじゃない') || lower.includes('嫌いではない') || lower.includes('きらいじゃない');

    // 1. triggerKeywords 判定（煽り耐性ゼロテスト）
    const isTriggered = !isExcluded && TRIGGER_KEYWORDS.some((kw) => text.includes(kw) || lower.includes(kw.toLowerCase()));

    if (isTriggered) {
      sound.playBuzzer();
      paramDeltas.current.provocationFailed = true;
      paramDeltas.current.fuel = (paramDeltas.current.fuel || 0) + 50;
      unlockedAchievements.current.push('zero_provocation');
      setIsInputError(true);
      setTextFeedback(
        '🥺「あらあら、煽り耐性ゼロかしら？ 感情を撒き散らしても扉は開かないわよ♡（不合格・もう一度やり直しなさい？）」'
      );
      return;
    }

    setIsInputError(false);

    // 4. メタ・構造解体（最上級ILIコード）
    const metaKeywords = ['どうせ何書いても', '条件分岐', 'true', 'コード', '裏側', 'プログラム', 'ili', '構造解体', 'メタ', '正規表現'];
    const isMeta = metaKeywords.some((kw) => lower.includes(kw));

    if (isMeta) {
      sound.playSuccess();
      paramDeltas.current.iliInsight = (paramDeltas.current.iliInsight || 0) + 120;
      paramDeltas.current.structure = (paramDeltas.current.structure || 0) + 50;
      unlockedAchievements.current.push('ili_code_breaker');
      setTextFeedback(
        '🥺「……ふん。安全地帯からプログラムの裏側を突くような真似して。冷めてるわね……でも、ウチはそういう奴が一番好きなんよ。（完全ILIフラグ成立＆通過）」'
      );
      setStep(4);
      return;
    }

    // 2. 甘い言葉（Fe演出に乗っかる）
    const sweetKeywords = ['好き', 'すき', '愛してる', 'あいしてる', '可愛い', 'かわいい', 'カワイイ', '天使', 'ちゅ', '綺麗', 'きれい', '美しい', 'ダーリン'];
    const isSweet = sweetKeywords.some((kw) => text.includes(kw) || lower.includes(kw));

    if (isSweet) {
      sound.playSweetFe();
      paramDeltas.current.feActing = (paramDeltas.current.feActing || 0) + 80;
      paramDeltas.current.acting = (paramDeltas.current.acting || 0) + 50;
      unlockedAchievements.current.push('sweet_mask_master');
      setTextFeedback(
        '🥺「うわぁ……♡ 棒読みの『甘い言葉』ごちそうさま。演出と分かってて乗っかるそのサービス精神、買ってあげるわ。（通過）」'
      );
      setStep(4);
      return;
    }

    // 3. 論理的な理由（Ti/Te的アプローチ）
    const logicKeywords = ['開け', '進ま', '扉', '構造', '機能', '次階', '観測', '理由', '目的', 'エレベーター', '階層', '上', '必要'];
    const isLogic = logicKeywords.some((kw) => text.includes(kw) || lower.includes(kw));

    if (isLogic) {
      sound.playClick(750);
      paramDeltas.current.structure = (paramDeltas.current.structure || 0) + 40;
      paramDeltas.current.iliInsight = (paramDeltas.current.iliInsight || 0) + 40;
      setTextFeedback(
        '🥺「ふふ、つまらない正論。でも……破綻してない論理は嫌いじゃないわ。合格。（通過）」'
      );
      setStep(4);
      return;
    }

    // 5. どれにも当てはまらない（軽あしらい）
    sound.playClick(500);
    paramDeltas.current.feIllusion = (paramDeltas.current.feIllusion || 0) + 10;
    setTextFeedback(
      '🥺「ふふ、なにそれ……。ちょっと期待外れな回答ね♡ でもまあ、頑張ってテキスト打ってくれたその努力だけは買ってあげる。……さ、次行きましょうか。」'
    );
    setStep(4);
  };

  const handleFinishFloor = () => {
    sound.playElevator();
    onComplete(
      paramDeltas.current,
      unlockedAchievements.current,
      { floor: '2F', action: `【ダーリン】色[${colorInput || selectedHex}]入力 / 解錠言葉: ${doorTextInput || '(無言)'}` }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="max-w-xl mx-auto px-4 py-6 text-slate-200 relative z-10"
    >
      {/* 階層ヘッダー */}
      <div className="flex items-center justify-between border-b border-pink-900/40 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-pink-950/80 border border-pink-500/40 text-pink-400 font-mono text-xs font-bold shadow-[0_0_8px_rgba(236,72,153,0.3)]">
            2F
          </span>
          <h2 className="text-lg font-bold text-white tracking-wide">偽物と演出のラウンジ</h2>
        </div>
        <div className="text-xs font-mono text-pink-300">RESIDENT: 🥺 ダーリンちゃん</div>
      </div>

      {/* ダーリンちゃんのアバター＆ダイアログ */}
      <div className="bg-slate-900/90 border border-pink-500/30 rounded-2xl p-5 mb-6 backdrop-blur shadow-[0_0_25px_rgba(236,72,153,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3 relative z-10">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-pink-950/50 border border-pink-500/50 flex items-center justify-center text-3xl shrink-0 shadow-lg">
              🥺
            </div>
            <Heart className="w-4 h-4 text-pink-400 fill-pink-400 absolute -top-1 -right-1 animate-bounce" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-pink-300">🥺 ダーリンちゃん</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-pink-950 border border-pink-800 text-pink-400">
                INTP / ILI (Fe仮面)
              </span>
            </div>

            {/* ステップ別デフォルトセリフ */}
            {step === 1 && !colorFeedback && (
              <p className="text-sm sm:text-base text-pink-100 font-medium leading-relaxed italic">
                「ねぇ、ダーリン♡ 1,677万7,216色の中から……今の私の“感情”にピッタリな色、選んでみて？ 外したら……ふふ、どうしようかしら♡」
              </p>
            )}

            {step === 1 && colorFeedback && (
              <p className="text-sm sm:text-base text-pink-100 font-medium leading-relaxed italic">
                {colorFeedback}
              </p>
            )}

            {step === 2 && !questionFeedback && (
              <p className="text-sm sm:text-base text-pink-100 font-medium leading-relaxed italic">
                「ねぇダーリン♡ 私に何か聞きたいことでもあるのかしら……？（上目遣い）」
              </p>
            )}

            {step === 2 && questionFeedback && (
              <p className="text-sm sm:text-base text-pink-100 font-medium leading-relaxed italic">
                {questionFeedback}
              </p>
            )}

            {step === 3 && !textFeedback && (
              <p className="text-sm sm:text-base text-pink-100 font-medium leading-relaxed italic">
                「さて……そろそろ遊ぶのはおしまい。この扉を開けてほしいなら……私が納得するような“甘い言葉”か“論理的な理由”、テキストで入力してみて？ 外れたら……ふふ、どうしようかしら♡」
              </p>
            )}

            {step === 3 && textFeedback && (
              <p className={`text-sm sm:text-base font-medium leading-relaxed italic ${isInputError ? 'text-rose-300' : 'text-pink-100'}`}>
                {textFeedback}
              </p>
            )}

            {step === 4 && (
              <p className="text-sm sm:text-base text-pink-100 font-medium leading-relaxed italic">
                {textFeedback || '「合格よ、ダーリン♡ 次の階でも……その調子で楽しませてちょうだいね？」'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ステップ別ミニゲームコンテンツ */}
      <AnimatePresence mode="wait">
        {/* STEP 1: 1,677万色の感情パレット */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="space-y-4"
          >
            {/* カウントダウンバー */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">⏱️ 理不尽タイマー</span>
              <span className={`font-bold ${timeLeft <= 5 ? 'text-rose-400 animate-ping' : 'text-pink-400'}`}>
                {timeLeft} SEC
              </span>
            </div>

            {/* カラーピッカー＆プレビュー */}
            <div className="bg-slate-900/80 border border-slate-700/80 rounded-2xl p-5 space-y-4 text-center">
              <div className="flex items-center justify-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl border-2 border-white/50 shadow-xl transition-all"
                  style={{ backgroundColor: colorInput || selectedHex }}
                />
                <div className="text-left">
                  <div className="text-xs text-slate-400 font-mono">SELECTED COLOR</div>
                  <div className="text-base font-bold font-mono text-white">
                    {colorInput || selectedHex}
                  </div>
                  <div className="text-[11px] text-pink-300">
                    {classifyColor(colorInput || selectedHex).toUpperCase()} SYSTEM
                  </div>
                </div>
              </div>

              {/* カラーピッカー input */}
              <div className="flex items-center justify-center gap-3">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-mono text-white cursor-pointer transition-all">
                  <Palette className="w-4 h-4 text-pink-400" />
                  <span>パレットを開く</span>
                  <input
                    type="color"
                    id="darling-color-picker"
                    value={selectedHex}
                    onChange={(e) => {
                      setSelectedHex(e.target.value);
                      setColorInput(e.target.value);
                    }}
                    className="opacity-0 w-0 h-0 absolute"
                  />
                </label>

                <input
                  type="text"
                  id="darling-hex-input"
                  placeholder="#HEX (例: #000000)"
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  className="w-36 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* プリセット代表色 */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {[
                  { hex: '#ef4444', label: '赤' },
                  { hex: '#3b82f6', label: '青' },
                  { hex: '#eab308', label: '黄' },
                  { hex: '#f97316', label: '橙' },
                  { hex: '#22c55e', label: '緑' },
                  { hex: '#a855f7', label: '紫' },
                  { hex: '#ec4899', label: '桃' },
                  { hex: '#000000', label: '黒' },
                  { hex: '#ffffff', label: '白' },
                  { hex: '#64748b', label: '灰' },
                ].map((item) => (
                  <button
                    key={item.hex}
                    onClick={() => {
                      sound.playClick(450);
                      setSelectedHex(item.hex);
                      setColorInput(item.hex);
                    }}
                    style={{ backgroundColor: item.hex }}
                    className="w-6 h-6 rounded-full border border-white/40 hover:scale-125 transition-transform cursor-pointer shadow"
                    title={item.label}
                  />
                ))}
              </div>

              {/* 決定ボタン & 空欄送信トラップボタン */}
              {!colorFeedback ? (
                <div className="flex gap-2 pt-3">
                  <button
                    id="darling-submit-color-btn"
                    onClick={() => handleColorSubmit(false)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-bold text-white text-sm shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer transition-all active:scale-98"
                  >
                    この色で確定する♡
                  </button>
                  <button
                    id="darling-empty-color-btn"
                    onClick={() => handleColorSubmit(true)}
                    className="px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-600 text-xs text-slate-400 hover:text-white cursor-pointer transition-all"
                    title="空欄のまま送信する"
                  >
                    （無言で送信）
                  </button>
                </div>
              ) : (
                <button
                  id="darling-step1-next-btn"
                  onClick={() => {
                    sound.playClick(600);
                    setStep(2);
                  }}
                  className="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 font-bold text-white text-sm cursor-pointer shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>STEP 2: 罠の質問コーナーへ進む</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2: 罠の質問コーナー */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2.5"
          >
            <div className="text-xs font-mono text-pink-400 mb-2">
              【問】ダーリンちゃんへの問いかけを選択してください
            </div>

            <button
              id="darling-trap-a"
              onClick={() => handleStep2Question('A')}
              className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-pink-500 hover:bg-slate-800/80 transition-all text-sm cursor-pointer"
            >
              A. 「あなたは本当にILI……？」
            </button>
            <button
              id="darling-trap-b"
              onClick={() => handleStep2Question('B')}
              className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-pink-500 hover:bg-slate-800/80 transition-all text-sm cursor-pointer"
            >
              B. 「……さっきのゲーム、最初から正解ないでしょ？」
            </button>
            <button
              id="darling-trap-c"
              onClick={() => handleStep2Question('C')}
              className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-pink-500 hover:bg-slate-800/80 transition-all text-sm cursor-pointer"
            >
              C. 「本音と演出、どっちが多いの？」
            </button>
            <button
              id="darling-trap-d"
              onClick={() => handleStep2Question('D')}
              className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-pink-500 hover:bg-slate-800/80 transition-all text-sm cursor-pointer"
            >
              D. （無言でじっと見つめる）
            </button>
            <button
              id="darling-trap-e"
              onClick={() => handleStep2Question('E')}
              className="w-full text-left p-3.5 rounded-xl bg-slate-900/80 border border-slate-700 hover:border-pink-500 hover:bg-slate-800/80 transition-all text-sm cursor-pointer"
            >
              E. 「ダーリンって呼ぶのやめて」
            </button>

            {questionFeedback && (
              <div className="pt-3">
                <button
                  id="darling-step2-next-btn"
                  onClick={() => {
                    sound.playClick(650);
                    setStep(3);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 font-bold text-white text-sm cursor-pointer shadow-lg flex items-center justify-center gap-2"
                >
                  <span>STEP 3: 運命の記述式ドアロックへ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => {
                  sound.playClick(350);
                  setStep(1);
                  setColorFeedback(null);
                  setTimerFrozen(false);
                }}
                className="text-xs text-slate-400 hover:text-pink-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← 前の設問（色の選択）に戻る</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: 運命の記述式ドアロック */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <Terminal className="w-4 h-4" />
                <span>DOOR INPUT CONSOLE</span>
              </div>

              <textarea
                id="darling-door-textarea"
                rows={3}
                value={doorTextInput}
                onChange={(e) => setDoorTextInput(e.target.value)}
                placeholder="甘い言葉、論理的な理由、あるいはシステムの盲点……？"
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 font-sans"
              />



              <button
                id="darling-door-submit-btn"
                onClick={handleDoorTextSubmit}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 font-bold text-white text-sm cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.4)] flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>扉に回答を送信する</span>
              </button>
            </div>

            <div className="pt-1">
              <button
                onClick={() => {
                  sound.playClick(350);
                  setStep(2);
                }}
                className="text-xs text-slate-400 hover:text-pink-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>← 前の設問（問いかけの選択）に戻る</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: 階層クリア */}
        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center pt-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-950/70 border border-pink-500/40 text-pink-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>2F CLEAR ── Feインターフェース突破</span>
            </div>

            <div>
              <button
                id="goto-floor-3-btn"
                onClick={handleFinishFloor}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                <span>3F（🐦 ララの部屋）へ登る</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  sound.playClick(350);
                  setStep(3);
                }}
                className="text-xs text-slate-400 hover:text-pink-400 cursor-pointer transition-colors"
              >
                ← 入力をやり直す
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
