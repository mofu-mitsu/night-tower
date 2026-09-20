import { CharacterProfile, TowerParameters, GlobalState } from '../types';

// Google Apps Script ウェブアプリURL
export const DEFAULT_GAS_URL =
  'https://script.google.com/macros/s/AKfycbyrhc5r_WkWYPkL6MA457jznUB-w7fVt4BUkk4JDMCkhUKnG8RpDFHO1o1dP0DBVGVLzg/exec';

export interface DarlingObservationData {
  category: string;
  rankBadge: string;
  emoji: string;
  speech: string;
  analysis: string;
}

export interface DiagnosticLogPayload {
  profile: CharacterProfile;
  parameters: TowerParameters;
  globalState: GlobalState;
  unlockedAchievementIds: string[];
  darlingObservation?: DarlingObservationData | null;
  rooftopComment?: string;
}

/**
 * 診断結果を Google スプレッドシート (GAS) へ送信
 */
export async function sendDiagnosticResultToGAS(payload: DiagnosticLogPayload): Promise<boolean> {
  const gasUrl = import.meta.env.VITE_GAS_URL || DEFAULT_GAS_URL;
  if (!gasUrl || gasUrl.trim() === '') {
    // URL未設定時は静かに待機
    return false;
  }

  try {
    const speech = payload.darlingObservation?.speech || payload.rooftopComment || '';
    const analysis = payload.darlingObservation?.analysis || '';
    const impression = payload.globalState.finalImpression || '';

    const data = {
      profile: {
        id: payload.profile.id,
        name: payload.profile.name,
        subTitle: payload.profile.subTitle,
        typeBadge: payload.profile.typeBadge,
        feRank: payload.profile.feRank,
        towerType: payload.profile.towerType,
      },
      parameters: payload.parameters,
      customTowerName: payload.globalState.customTowerName || '名もなき塔',
      finalImpression: impression,
      userImpression: impression,
      impression: impression,
      // ダーリンちゃんの感想・観測データ（GAS側のあらゆるプロパティ名に対応）
      darlingComment: speech,
      darlingSpeech: speech,
      darlingFeedback: speech,
      darlingAnalysis: analysis,
      darlingCategory: payload.darlingObservation?.category || '',
      darlingRankBadge: payload.darlingObservation?.rankBadge || '',
      darlingObservation: payload.darlingObservation || null,
      rooftopFeedback: speech,
      achievementCount: payload.unlockedAchievementIds.length,
      achievements: payload.unlockedAchievementIds,
      actionLogs: payload.globalState.actionLogs.map((log) => `${log.floor}: ${log.action}`),
      kirigirisNotesCount: payload.globalState.kirigirisSession ? payload.globalState.kirigirisSession.length : 0,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString(),
    };

    // CORSのプリフライトを回避するため text/plain または no-cors で送信
    await fetch(gasUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(data),
      mode: 'no-cors', // GAS への送信成功率を最大化
    });

    return true;
  } catch (err) {
    console.warn('Failed to send log to GAS:', err);
    return false;
  }
}

