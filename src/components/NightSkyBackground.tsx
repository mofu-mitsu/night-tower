import React, { useMemo, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NightSkyBackgroundProps {
  floor: number;
}

export const NightSkyBackground: React.FC<NightSkyBackgroundProps> = ({ floor }) => {
  const [weather, setWeather] = useState<'clear' | 'rain' | 'shooting_star'>('clear');

  // 星の生成
  const stars = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 5,
    }));
  }, []);

  // 摩天楼のシルエット生成
  const buildings = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => {
      const height = 15 + Math.random() * 40;
      const width = 4 + Math.random() * 6;
      const left = i * 7 + (Math.random() * 4 - 2);
      return { id: i, height, width, left };
    });
  }, []);

  // 階層に基づく背景色のグラデーション変化
  const getGradient = () => {
    const intensity = Math.min(floor * 10, 100);
    if (floor === 0) return 'linear-gradient(to bottom, #0f172a, #020617)';
    if (floor === 9) return 'linear-gradient(to bottom, #020617, #000000)';
    return `linear-gradient(to bottom, rgba(15, 23, 42, ${1 - intensity / 200}), rgba(2, 6, 23, 1))`;
  };

  // 天候のランダム変化
  useEffect(() => {
    const interval = setInterval(() => {
      const r = Math.random();
      if (r < 0.1) setWeather('rain');
      else if (r < 0.25) setWeather('shooting_star');
      else setWeather('clear');
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // 流れ星の生成
  const shootingStars = useMemo(() => {
    return Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      top: Math.random() * 40 + '%',
      left: Math.random() * 80 + '%',
      delay: Math.random() * 2,
    }));
  }, [weather]); // 天候が変わるたびに再生成

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" style={{ background: getGradient() }}>
      {/* 瞬く星々 (階層が上がると明るくなる) */}
      <div className="absolute inset-0">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
            }}
            animate={{
              opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 流れ星 (天候が shooting_star の時) */}
      <AnimatePresence>
        {weather === 'shooting_star' && (
          <div className="absolute inset-0">
            {shootingStars.map((star) => (
              <motion.div
                key={star.id}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], x: -300, y: 300, scale: [0, 1.5, 0.5] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, delay: star.delay, ease: 'easeOut' }}
                className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.8)]"
                style={{ top: star.top, left: star.left }}
              >
                {/* 尾 */}
                <div className="absolute top-0 right-0 w-[100px] h-[1px] bg-gradient-to-r from-white to-transparent origin-right -rotate-45 transform -translate-y-1/2 translate-x-1/2" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 雨 (天候が rain の時) */}
      <AnimatePresence>
        {weather === 'rain' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: '100vh', opacity: [0, 0.4, 0] }}
                transition={{
                  duration: 0.5 + Math.random() * 0.5,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear',
                }}
                className="absolute w-[1px] h-4 bg-cyan-500/30"
                style={{ left: `${Math.random() * 100}%` }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 摩天楼のシルエット (階層が上がると下に沈む) */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[40vh]"
        animate={{ y: floor * 8 }} // 階層ごとに少しずつ下がる
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      >
        <div className="absolute bottom-0 w-full h-full flex items-end">
          {buildings.map((b) => (
            <div
              key={b.id}
              className="absolute bottom-0 bg-slate-900 border-t border-r border-slate-800/50"
              style={{
                height: `${b.height}%`,
                width: `${b.width}%`,
                left: `${b.left}%`,
              }}
            >
              {/* ビルの窓（ランダムに点灯） */}
              <div className="w-full h-full p-1 flex flex-wrap gap-0.5 opacity-20">
                {Array.from({ length: Math.floor(b.height / 2) }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-1 h-1"
                    style={{
                      backgroundColor: Math.random() > 0.8 ? '#fcd34d' : 'transparent',
                      boxShadow: Math.random() > 0.9 ? '0 0 2px #fcd34d' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* 地表の霧/スモッグ */}
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent blur-sm" />
      </motion.div>
    </div>
  );
};
