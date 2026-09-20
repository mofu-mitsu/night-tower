import { LucideIcon } from 'lucide-react';

export interface TowerParameters {
  structure: number;  // 構造把握 (Ti/Te)
  acting: number;     // 演技・仮面度 (Fe/Fi)
  chaos: number;      // 混沌・反逆度 (Ne/Se)
  flow: number;       // 流動・受け流し (Ni)
  deviation: number;  // 逸脱嗜好
  fuel: number;       // 情熱・燃料度 (Se/Si)
  feIllusion: number; // ダーリンちゃん専用：幻影への同調
  feActing: number;   // ダーリンちゃん専用：演技への迎合
  iliInsight: number; // ダーリンちゃん専用：深層見抜き度
  provocationFailed: boolean; // 煽り耐性チェック
}

export interface ActionLog {
  floor: string;
  action: string;
}

export interface KirigirisNote {
  id: string;
  time: number;
  type: 'drum' | 'piano' | 'guitar';
  freq: number;
}

export interface GlobalState {
  hasSoup: boolean;
  hasSweat: boolean;
  customTowerName: string;
  finalImpression: string;
  actionLogs: ActionLog[];
  kirigirisSession?: KirigirisNote[];
}

export type ResultId = 
  | 'darling_fe'
  | 'darling_ili'
  | 'lsi_morpho'
  | 'lsi_caterpillar'
  | 'gohoubi'
  | 'eiji'
  | 'lala'
  | 'kirigiris'
  | 'hako'
  | 'tsukushi';

export interface CharacterProfile {
  id: ResultId;
  name: string;
  subTitle: string;
  emoji: string;
  typeBadge: string;
  speech: string;
  description: string;
  feRank: string;
  towerType: {
    title: string;
    description: string;
    icon: string;
    shape: string;
  };
  residentComment: {
    name: string;
    comment: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
}
