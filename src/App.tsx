import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, RotateCcw, Building2, ChevronLeft, AlertTriangle } from 'lucide-react';
import { TowerParameters, GlobalState } from './types';
import { ALL_ACHIEVEMENTS, evaluateFinalResult } from './data/characters';
import { sound } from './utils/sound';
import { NightSkyBackground } from './components/NightSkyBackground';
import { Entrance } from './components/Entrance';
import { Floor1Hako } from './components/Floor1Hako';
import { Floor2Darling } from './components/Floor2Darling';
import { Floor3Lala } from './components/Floor3Lala';
import { Floor4Gohoubi } from './components/Floor4Gohoubi';
import { Floor5Eiji } from './components/Floor5Eiji';
import { Floor6Kirigiris } from './components/Floor6Kirigiris';
import { Floor7Tsukushi } from './components/Floor7Tsukushi';
import { Floor8LSI } from './components/Floor8LSI';
import { RooftopResult } from './components/RooftopResult';

interface HistorySnapshot {
  floor: number;
  parameters: TowerParameters;
  globalState: GlobalState;
  unlockedAchievements: string[];
}

const INITIAL_PARAMS: TowerParameters = {
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
};

const INITIAL_GLOBAL: GlobalState = {
  hasSoup: false,
  hasSweat: false,
  customTowerName: '名もなき塔',
  finalImpression: '',
  actionLogs: [],
};

export default function App() {
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [parameters, setParameters] = useState<TowerParameters>(INITIAL_PARAMS);
  const [globalState, setGlobalState] = useState<GlobalState>(INITIAL_GLOBAL);
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>([]);
  const [showRestartModal, setShowRestartModal] = useState<boolean>(false);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setMuted(!next);
  };

  const handleAdvanceFloor = (
    delta: Partial<TowerParameters>,
    newAchievements?: string[],
    floorLog?: { floor: string; action: string }
  ) => {
    // スナップショットを履歴スタックに保存
    setHistoryStack((prev) => [
      ...prev,
      {
        floor: currentFloor,
        parameters: { ...parameters },
        globalState: {
          ...globalState,
          actionLogs: [...globalState.actionLogs],
        },
        unlockedAchievements: [...unlockedAchievements],
      },
    ]);

    setParameters((prev) => {
      const updated: TowerParameters = { ...prev };
      (Object.keys(delta) as (keyof TowerParameters)[]).forEach((key) => {
        if (typeof delta[key] === 'number') {
          (updated[key] as number) += (delta[key] as number) || 0;
        } else if (typeof delta[key] === 'boolean') {
          (updated[key] as boolean) = (delta[key] as boolean) || false;
        }
      });
      return updated;
    });

    if (newAchievements && newAchievements.length > 0) {
      setUnlockedAchievements((prev) => Array.from(new Set([...prev, ...newAchievements])));
    }

    if (floorLog) {
      setGlobalState((prev) => ({
        ...prev,
        actionLogs: [...prev.actionLogs, floorLog],
      }));
    }

    setCurrentFloor((f) => f + 1);
  };

  const handleGoBack = () => {
    sound.playClick(350);
    if (historyStack.length > 0) {
      const last = historyStack[historyStack.length - 1];
      setHistoryStack((prev) => prev.slice(0, -1));
      setCurrentFloor(last.floor);
      setParameters(last.parameters);
      setGlobalState(last.globalState);
      setUnlockedAchievements(last.unlockedAchievements);
    } else if (currentFloor > 0) {
      setCurrentFloor(0);
      setParameters(INITIAL_PARAMS);
      setGlobalState(INITIAL_GLOBAL);
      setUnlockedAchievements([]);
    }
  };

  const handleRestart = () => {
    sound.playClick(400);
    setHistoryStack([]);
    setCurrentFloor(0);
    setParameters(INITIAL_PARAMS);
    setGlobalState(INITIAL_GLOBAL);
    setUnlockedAchievements([]);
    setShowRestartModal(false);
  };

  const floorLabel =
    currentFloor === 0
      ? 'ENTRANCE'
      : currentFloor === 9
      ? 'ROOFTOP'
      : `${currentFloor}F`;

  const finalResultProfile = evaluateFinalResult(parameters, unlockedAchievements);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden select-none">
      <NightSkyBackground floor={currentFloor} />

      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/60 border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xs sm:text-sm">
            <a
              href="https://mofu-mitsu.github.io/lab.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 font-bold group"
              title="Ni lab トップへ戻る"
            >
              <span className="group-hover:underline">Ni lab</span>
            </a>
            <span className="text-slate-600 font-bold">＞</span>
            <div className="flex items-center gap-1.5 font-black tracking-wider text-cyan-400">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>NIGHT TOWER</span>
            </div>
            <div className="h-3.5 w-[1px] bg-slate-800 hidden sm:block" />
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[11px] font-mono font-bold text-slate-300 hidden sm:inline-block">
              {floorLabel}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentFloor > 0 && currentFloor < 9 && (
              <button
                id="header-back-btn"
                onClick={handleGoBack}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-slate-200 hover:text-cyan-300 transition-all cursor-pointer shadow-sm active:scale-95"
                title={currentFloor === 1 ? 'タイトルに戻る' : '前の階（質問）に戻る'}
              >
                <ChevronLeft className="w-4 h-4 text-cyan-400" />
                <span>戻る</span>
              </button>
            )}

            <button
              id="sound-toggle-header-btn"
              onClick={handleToggleSound}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-all cursor-pointer"
              title={soundEnabled ? '音声をミュート' : '音声を有効化'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-cyan-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </button>

            {currentFloor > 0 && currentFloor < 9 && (
              <button
                id="header-restart-btn"
                onClick={() => setShowRestartModal(true)}
                className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 text-slate-500 hover:text-rose-400 transition-all cursor-pointer"
                title="タイトル画面へリセット"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 最初からやり直す確認モーダル */}
      {showRestartModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-full bg-rose-950/60 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">最初からやり直しますか？</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                これまでの行動ログと獲得パラメータがリセットされ、タイトル画面へ戻ります。
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowRestartModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
              >
                キャンセル
              </button>
              <button
                onClick={handleRestart}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg transition-colors cursor-pointer"
              >
                最初からやり直す
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <main className="relative z-10 py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {currentFloor === 0 && (
            <motion.div key="entrance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Entrance
                onStart={() => {
                  sound.init();
                  sound.playElevator();
                  setHistoryStack([
                    {
                      floor: 0,
                      parameters: INITIAL_PARAMS,
                      globalState: INITIAL_GLOBAL,
                      unlockedAchievements: [],
                    },
                  ]);
                  setCurrentFloor(1);
                }}
                isMuted={!soundEnabled}
                onToggleMute={handleToggleSound}
              />
            </motion.div>
          )}

          {currentFloor === 1 && (
            <motion.div key="floor1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Floor1Hako onComplete={handleAdvanceFloor} />
            </motion.div>
          )}

          {currentFloor === 2 && (
            <motion.div key="floor2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Floor2Darling onComplete={handleAdvanceFloor} />
            </motion.div>
          )}

          {currentFloor === 3 && (
            <motion.div key="floor3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Floor3Lala onComplete={handleAdvanceFloor} />
            </motion.div>
          )}

          {currentFloor === 4 && (
            <motion.div key="floor4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Floor4Gohoubi onComplete={handleAdvanceFloor} setGlobalState={setGlobalState} />
            </motion.div>
          )}

          {currentFloor === 5 && (
            <motion.div key="floor5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Floor5Eiji onComplete={handleAdvanceFloor} globalState={globalState} setGlobalState={setGlobalState} />
            </motion.div>
          )}

          {currentFloor === 6 && (
            <motion.div key="floor6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Floor6Kirigiris onComplete={handleAdvanceFloor} setGlobalState={setGlobalState} />
            </motion.div>
          )}

          {currentFloor === 7 && (
            <motion.div key="floor7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Floor7Tsukushi onComplete={handleAdvanceFloor} setGlobalState={setGlobalState} />
            </motion.div>
          )}

          {currentFloor === 8 && (
            <motion.div key="floor8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Floor8LSI onComplete={handleAdvanceFloor} />
            </motion.div>
          )}

          {currentFloor === 9 && (
            <motion.div key="rooftop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RooftopResult
                profile={finalResultProfile}
                parameters={parameters}
                globalState={globalState}
                setGlobalState={setGlobalState}
                unlockedAchievementIds={unlockedAchievements}
                allAchievements={ALL_ACHIEVEMENTS}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-10 py-6 text-center text-[11px] font-mono text-slate-500 border-t border-slate-900/60 space-y-1">
        <div>
          <a
            href="https://mofu-mitsu.github.io/lab.html"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors underline decoration-slate-700 underline-offset-4"
          >
            Ni lab
          </a>
          <span className="mx-2 text-slate-700">|</span>
          <span className="text-slate-400">NIGHT TOWER</span>
        </div>
        <div className="text-[10px] text-slate-600">
          NIGHT TOWER © ── NON-STANDARD PSYCHO-DIAGNOSTIC EXPERIMENT
        </div>
      </footer>
    </div>
  );
}
