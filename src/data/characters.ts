import { CharacterProfile, Achievement, ResultId, TowerParameters } from '../types';

export const CHARACTER_PROFILES: Record<ResultId, CharacterProfile> = {
  darling_fe: {
    id: 'darling_fe',
    name: 'ダーリンちゃん（Feインターフェース仮面）',
    emoji: '🥺',
    subTitle: '演出する観測者 / 完璧な感情の操り手',
    typeBadge: 'INTP / ILI (Fe仮面)',
    description:
      'ぶっきらぼうな本性を隠し、相手の本音と演出を暴く実験のために甘いインターフェースを被った観測者。周囲を翻弄しながら冷静にログを解析しています。',
    speech:
      '「あなたは場を円滑にし、相手を翻弄するために『完璧な感情』を演じ切りました。でも……ねぇ、ダーリン♡ その仮面、いつ脱ぐの？ 疲れない？」',
    feRank: '🥺 完全習得（演技だと見抜かせないプロフェッショナル）',
    towerType: {
      title: 'ネオン・ハート・タワー',
      description: '外壁にピンクとマゼンタの電飾ハートが浮遊し、華やかながら中心核は絶対零度で凍結している観測塔。',
      icon: 'Heart',
      shape: 'neon',
    },
    residentComment: {
      name: '🥺 ダーリン',
      comment: '「ふふ♡ ダーリン、最後まで結構楽しんでたでしょう？」',
    },
  },

  darling_ili: {
    id: 'darling_ili',
    name: 'アリス（完全ILI：素の観測者）',
    emoji: '🥀',
    subTitle: '演出を脱ぎ捨てた観測者 / 退屈を嫌う眠り姫',
    typeBadge: 'INTP / ILI (阿波弁モード)',
    description:
      'Fe仮面が完全に剥がれ、事象を「トランプの城」のように見下ろすILI本来の冷めた諦観と知性。欺瞞や演出のノイズを嫌い、剥き出しの真実だけを好みます。',
    speech:
      '「……ああ、やっと無駄なノイズが消えた。演出の皮を剥ぎ取って、ここ（最上階）まで辿り着いたのね。……なんや、最初からそっちの冷めた面（ツラ）で見つめてくれれば良かったのに。ウチ、退屈させられるのが一番嫌いなんよ……ねぇ、ダーリン♡」',
    feRank: '🥀 演出完全粉砕（Feを無効化し、観測核を直接撃ち抜いた構造者）',
    towerType: {
      title: 'モノリス・ノワール・タワー',
      description: 'すべてのネオンがバチバチと消灯し、漆黒のガラスと星明かりだけが残された静謐な観測塔。',
      icon: 'Moon',
      shape: 'dark',
    },
    residentComment: {
      name: '🥀 アリス',
      comment: '「……なんや、アンタもウチと同じ目しとるんやな。世界なんて退屈やけど……アンタのログだけは悪くなかったよ。」',
    },
  },

  lsi_caterpillar: {
    id: 'lsi_caterpillar',
    name: 'LSI芋虫',
    emoji: '🐛',
    subTitle: '構造を食べて育つ知識芋虫',
    typeBadge: 'INTJ / LSI-Ni (5w6)',
    description:
      '理屈っぽいが謙虚で誠実。共感しようとしても思わず構造や矛盾が先に出てきてしまう、実直な知識の求道者。',
    speech:
      '「……構造を確認した。感情や雰囲気に流されず、システムの整合性を淡々と検証し続けた結果、僕は芋虫のままここに到達したようだ。この塔の梁、一本余分だね。」',
    feRank: '🐛 そもそも使わない（構造だけ見つめる純粋種）',
    towerType: {
      title: '精密モジュール・タワー',
      description: '無駄な装飾を排し、歯車と配管と論理回路がむき出しになったインダストリアルな構造タワー。',
      icon: 'Cpu',
      shape: 'caterpillar',
    },
    residentComment: {
      name: '🐛 LSI',
      comment: '「構造は、完成した。」',
    },
  },

  lsi_morpho: {
    id: 'lsi_morpho',
    name: 'LSI完全体（レトノールモルフォ）',
    emoji: '🦋',
    subTitle: '構造を羽ばたかせる知識生命体',
    typeBadge: 'LSI 完全覚醒体',
    description:
      '矛盾を乗り越え、自らの論理構造を完成させたことで巨大な青い翅を広げた知性体。タワーの全貌を構造として支配します。',
    speech:
      '「ﾊﾟｷ……ﾊﾟｷﾊﾟｷ……羽化条件を満たしました。世界はもはや混沌ではなく、完璧に調和された数理の織物です。あなたの選択が、この羽を美しく展翅させました。」',
    feRank: '🦋 構造昇華（演出も感情もすべて論理のフラクタルとして統合）',
    towerType: {
      title: 'モルフォ・ルミナス・タワー',
      description: 'タワー全体が巨大な結晶の翅のように幾何学的に展開し、夜空にコバルトブルーの燐光を放つ奇跡の塔。',
      icon: 'Sparkles',
      shape: 'morpho',
    },
    residentComment: {
      name: '🦋 LSI',
      comment: '「構造は、完成しました。」',
    },
  },

  gohoubi: {
    id: 'gohoubi',
    name: '栄城 縫（ご褒美）',
    emoji: '🐷',
    subTitle: '全肯定型ご褒美生命体',
    typeBadge: 'INFP / IEI (4w3)',
    description:
      'ツインテールにわしゃわしゃしたい願望を持つオタク男子。罵倒すら「ありがトン♡ これはご褒美だゾ♡」と受け止める鋼のドM受容性。',
    speech:
      '「拙者のあだ名はご褒美、だゾ！拙者の風呂上がりの出汁（豚骨仕立て）をここまで持ってきてやったゾ！罵られても全部ありがトン♡だゾッ！」',
    feRank: '🐷 演技だと即バレ（だが全部嬉しそうに受け止める）',
    towerType: {
      title: '屋上豚骨大食堂タワー',
      description: 'なぜか屋上に巨大な寸胴鍋と赤提灯が灯り、熱々の豚骨スープの湯気が夜空に立ち上るオアシスタワー。',
      icon: 'Soup',
      shape: 'restaurant',
    },
    residentComment: {
      name: '🐷 ご褒美',
      comment: '「拙者とこんな高いところまで登ってくれるなんて……これって実質ツインテールわしゃわしゃだゾ！？」',
    },
  },

  eiji: {
    id: 'eiji',
    name: '筋永 明日雅（えいじ）',
    emoji: '💪',
    subTitle: '筋肉で全部解決する男',
    typeBadge: 'ESTP / SEE (8w7)',
    description:
      '東京都大島出身の超肉体派。「おっす！オラえいじ！筋肉サイコー！」と叫びながら汗ポカリを差し出してくる直情型パワーファイター。',
    speech:
      '「おっす！オラえいじ！好きな食べ物はプロテイン！ここまで登ってきた足腰、いいパンプアップしてるぜ！筋肉サイコー！！」',
    feRank: '💪 使ってるつもりで使えてない（筋肉ですべて押し切る）',
    towerType: {
      title: 'スカイ・マッスル・ジムタワー',
      description: '屋上一面にバーベル、ベンチプレス、プロテインバーが設置された超高層オープンエア筋トレタワー。',
      icon: 'Dumbbell',
      shape: 'gym',
    },
    residentComment: {
      name: '💪 えいじ',
      comment: '「おめえの根性、気に入ったぜ！明日はスクワット1000回から始めるからな！！」',
    },
  },

  lala: {
    id: 'lala',
    name: 'ララ（アトリ）',
    emoji: '🐦',
    subTitle: 'ルールの穴から侵入する屁理屈鳥',
    typeBadge: 'ENTP / LIE (3w4)',
    description:
      '可愛い名前と姿に反して、冷笑と風刺、言葉遊びと屁理屈が得意な知性派鳥。ルールを熟知したうえで、その盲点や裏をかくのが生き甲斐。',
    speech:
      '「ララだよ。よろしくね。……で、そのルール、本当に守る必要あるの？ ルールって守るためにあるんじゃなくて、読むためにあるんだよ。あはは！」',
    feRank: '🐦 逆にダーリンを操作し始める（ルールと言葉のハッカー）',
    towerType: {
      title: '非常階段スパイラル・タワー',
      description: '外壁に無数の非常階段とハシゴが斜めに飛び出し、正規ルートを完全に無視して屋上へ直通する構造塔。',
      icon: 'Compass',
      shape: 'emergency',
    },
    residentComment: {
      name: '🐦 ララ',
      comment: '「ルールの穴を探してたね。……まあ、嫌いじゃないよ。」',
    },
  },

  kirigiris: {
    id: 'kirigiris',
    name: 'キリギリス',
    emoji: '🦗',
    subTitle: '未来を信じる楽観音楽生命',
    typeBadge: 'ENFP / EIE (7w6)',
    description:
      '「まあ未来は何とかなるよ！」が口癖の超楽観主義者。面倒事は後回し、音楽とノリと楽しさを最優先にし、放置すら楽しみに変えてしまう。',
    speech:
      '「テンポがズレても、計画が崩れても、まあ未来は何とかなるって！ 人生楽しんだもん勝ちじゃん？ ほら、夜風が気持ちいいよ〜！」',
    feRank: '🦗 そこそこ使える（ただ途中で面倒になって投げ出す）',
    towerType: {
      title: 'スターライト・ライブステージタワー',
      description: '屋上が巨大なフェス会場になっており、きらびやかなスポットライトとスピーカーが夜空を震わせる宴タワー。',
      icon: 'Music',
      shape: 'stage',
    },
    residentComment: {
      name: '🦗 キリギリス',
      comment: '「また遊ぼうよ！　次はもっと適当に！」',
    },
  },

  hako: {
    id: 'hako',
    name: 'はこ',
    emoji: '📦',
    subTitle: '流されながら考え続ける箱',
    typeBadge: 'INTP / ILI (9w8)',
    description:
      '死んだ魚の目をして世界を俯瞰する箱。「自分がない」「決断を相手に任せる方が楽」と思いつつ、思考の無限ループに身体を預けて漂う。',
    speech:
      '「どれでもいいよ。……なんでその扉を選んだのか、なんでそう思ったのか考えてたら、いつの間にか屋上に着いてた。椅子が一個あって落ち着くね。」',
    feRank: '📦 そもそも使わない（流速ゼロの思考漂流体）',
    towerType: {
      title: 'キュービック・ボックス・タワー',
      description: '窓が極端に少なく、無機質な立方体が積み重なった幾何学タワー。屋上にはポツンと椅子が一つだけ置かれている。',
      icon: 'Box',
      shape: 'box',
    },
    residentComment: {
      name: '📦 はこ',
      comment: '「……一緒にぼーっとしてるだけでいいなら、ずっとここにいていいよ。」',
    },
  },

  tsukushi: {
    id: 'tsukushi',
    name: 'つくし',
    emoji: '🌱',
    subTitle: '静かに世界を再構築する人',
    typeBadge: 'INTJ / LII (5w4)',
    description:
      '花言葉は「向上心」。寡黙で無口だが極めて器用。「まず状況を定義しろ」と淡々と世界を再構築し、来るもの拒まず去るもの追わず日々を成す。',
    speech:
      '「……この部屋の定義には矛盾がありました。修正を完了しました。日々を精一杯生き、淡々と成すべきことを成す。ただそれだけです。」',
    feRank: '🌱 演技だと即バレ（表情筋が論理の重みで微動だにしない）',
    towerType: {
      title: 'モノリス・スパイア・タワー',
      description: '装飾の一切を削ぎ落とし、針のように天高くまっすぐ垂直に伸びた研ぎ澄まされたタワー。',
      icon: 'Layers',
      shape: 'spire',
    },
    residentComment: {
      name: '🌱 つくし',
      comment: '「……ちゃんと見ていたんだね。」',
    },
  },
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'sweat_oil_fantasy',
    title: '汗と油のファンタジー',
    description: 'ご褒美の風呂上がり豚骨出汁とえいじの汗ポカリを奇跡的に調合した',
    emoji: '🧪',
    unlocked: false,
  },
  {
    id: 'hero_certified',
    title: '勇者認定',
    description: 'ご褒美の差し出す風呂上がり出汁（豚骨仕立て）を一気飲みした',
    emoji: '🏆',
    unlocked: false,
  },
  {
    id: 'think_freeze_15s',
    title: '15秒の思考フリーズ',
    description: 'ダーリンちゃんの1677万色パレットの理不尽さに15秒間固まった',
    emoji: '⏳',
    unlocked: false,
  },
  {
    id: 'ili_code_breaker',
    title: '完全ILIコード解析',
    description: '安全地帯からプログラムの裏側を突くメタ記述でドアロックを解除した',
    emoji: '💻',
    unlocked: false,
  },
  {
    id: 'sweet_mask_master',
    title: 'Fe演出の共犯者',
    description: 'ダーリンちゃんに完璧な甘い言葉を返し、Fe仮面を受け止めた',
    emoji: '🍯',
    unlocked: false,
  },
  {
    id: 'zero_provocation',
    title: '煽り耐性ゼロ',
    description: '感情的なNGワードを入力してダーリンちゃんに門前払いされた',
    emoji: '💢',
    unlocked: false,
  },
  {
    id: 'rule_hacker',
    title: 'ルールの穴ハッカー',
    description: 'ララのルールブックを真面目に守らず、構造の盲点から突破した',
    emoji: '🐦',
    unlocked: false,
  },
  {
    id: 'kirigiris_rest',
    title: '今日は休もうか',
    description: 'キリギリスの音ゲーで何もしないまま30秒過ごしてクリアした',
    emoji: '🌸',
    unlocked: false,
  },
  {
    id: 'morpho_emergence',
    title: 'レトノールモルフォ羽化',
    description: '壊れたフローチャートを繋ぎ合わせ、LSI芋虫を完全体へと覚醒させた',
    emoji: '🦋',
    unlocked: false,
  },
  {
    id: 'hako_pass',
    title: '決断の完全丸投げ',
    description: 'はこに扉の選択をすべて押し付けて思考の海へ身を任せた',
    emoji: '📦',
    unlocked: false,
  },
  {
    id: 'redefine_world',
    title: '世界の再定義',
    description: 'つくしに「まず部屋とは何なのか定義する」と突き返した',
    emoji: '🌱',
    unlocked: false,
  },
  {
    id: 'alice_awakening',
    title: '眠り姫アリスの覚醒',
    description: '最上階ですべてのネオン演出を消し飛ばし、完全ILIアリスを暴き出した',
    emoji: '🥀',
    unlocked: false,
  },
];

export const ALL_ACHIEVEMENTS = INITIAL_ACHIEVEMENTS;

// 診断ロジックの判定関数（アンロックID配列またはAchievement配列どちらでも対応）
export function evaluateFinalResult(
  params: TowerParameters,
  achievementsOrIds: Achievement[] | string[]
): CharacterProfile {
  const isUnlocked = (id: string): boolean => {
    if (achievementsOrIds.length === 0) return false;
    if (typeof achievementsOrIds[0] === 'string') {
      return (achievementsOrIds as string[]).includes(id);
    }
    return !!(achievementsOrIds as Achievement[]).find((a) => a.id === id)?.unlocked;
  };

  const isAliceAwakened = isUnlocked('alice_awakening');
  const isIliCode = isUnlocked('ili_code_breaker');
  const isMorpho = isUnlocked('morpho_emergence');
  const isSweatOil = isUnlocked('sweat_oil_fantasy');

  // --- 1. 最優先特殊覚醒ルート ---
  // A. アリス（完全ILI：素の観測者）: 最上階で演出を粉砕またはコード解析
  if (isAliceAwakened || (params.iliInsight >= 65 && isIliCode)) {
    return CHARACTER_PROFILES['darling_ili'];
  }
  // B. 完全体LSI（レトノールモルフォ）: フローチャートを完全修復して羽化
  if (isMorpho && params.structure >= 45) {
    return CHARACTER_PROFILES['lsi_morpho'];
  }
  // C. 汗と油のファンタジー: 意図して出汁と汗を混ぜた場合のみ確定
  if (isSweatOil) {
    return params.chaos >= params.structure
      ? CHARACTER_PROFILES['gohoubi']
      : CHARACTER_PROFILES['eiji'];
  }

  // --- 2. 公平な総合マッチ度スコア算出 ---
  const scores: Record<ResultId, number> = {
    // ダーリンちゃん: Fe仮面・演出値・甘い共犯
    darling_fe:
      params.feActing * 1.5 +
      params.acting * 1.1 +
      (isUnlocked('sweet_mask_master') ? 45 : 0),

    // アリス（通常ルート）: ILI洞察・メタ視点
    darling_ili:
      params.iliInsight * 1.6 +
      (isUnlocked('ili_code_breaker') ? 35 : 0),

    // 完全体LSI（通常スコア）
    lsi_morpho:
      params.structure * 1.3 + (isMorpho ? 40 : 0),

    // LSI芋虫: 純粋な構造把握・論理整合性
    lsi_caterpillar:
      params.structure * 1.4 +
      (100 - Math.min(100, params.chaos)) * 0.4 +
      (params.flow >= 30 ? 15 : 0),

    // つくし: 構造＋状況定義＋淡々とした遂行
    tsukushi:
      params.structure * 1.2 +
      (isUnlocked('redefine_world') ? 50 : 0) +
      (100 - Math.min(100, params.acting)) * 0.4,

    // ララ: ルールの穴・逸脱・ハック
    lala:
      params.deviation * 1.6 +
      (isUnlocked('rule_hacker') ? 50 : 0) +
      params.chaos * 0.3,

    // キリギリス: フロー＋カオス耐性＋即興セッション
    kirigiris:
      params.flow * 1.2 +
      params.chaos * 1.0 +
      (isUnlocked('kirigiris_rest') ? 50 : 0),

    // はこ: 流動・決断の委ね・思考の無限海
    hako:
      params.flow * 1.4 +
      (isUnlocked('hako_pass') ? 50 : 0) +
      (100 - Math.min(100, params.fuel)) * 0.4,

    // えいじ: 高速連打・情熱・純粋な筋肉燃料
    eiji:
      params.fuel * 1.3 +
      params.structure * 0.5 +
      (params.fuel > 50 ? 20 : 0),

    // ご褒美: 出汁狂気・カオス燃料・男気エキス
    gohoubi:
      params.fuel * 0.9 +
      params.chaos * 1.1 +
      (isUnlocked('hero_certified') ? 45 : 0),
  };

  // 最も高いスコアのキャラクターを選出
  let bestResultId: ResultId = 'darling_fe';
  let maxScore = -Infinity;

  (Object.keys(scores) as ResultId[]).forEach((key) => {
    if (scores[key] > maxScore) {
      maxScore = scores[key];
      bestResultId = key;
    }
  });

  return CHARACTER_PROFILES[bestResultId];
}

// パラメータの理論最大値と合計の定義
const MAX_PARAMS = {
  structure: 185, // 1F(30) + 2F(50+40=90) + 3F(25) + 4F(0) + 5F(5) + 6F(0) + 7F(50) + 8F(60)
  acting: 110, // 1F(15) + 2F(50+20=70) + 3F(10) + 4F(0) + 5F(10) + 6F(15) + 7F(5)
  fuel: 160, // 2F(50+30=80) + 4F(50) + 5F(40) + 7F(5)
  chaos: 140, // 1F(40) + 3F(0) + 4F(40) + 5F(20) + 6F(40)
  flow: 135, // 1F(50) + 2F(30+40=70) + 6F(35) + 7F(10)
  feActing: 80, // 2F
};

export const MAX_TOWER_PARAMS = MAX_PARAMS;


