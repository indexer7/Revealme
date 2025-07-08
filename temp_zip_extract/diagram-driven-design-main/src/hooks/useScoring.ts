
import { useState, useEffect } from 'react';

export const riskVectors = [
  { id: 'phishing', name: 'Phishing', defaultWeight: 80 },
  { id: 'malware', name: 'Malware', defaultWeight: 65 },
  { id: 'dataBreach', name: 'Data Breach', defaultWeight: 90 },
  { id: 'insiderThreat', name: 'Insider Threat', defaultWeight: 40 },
  { id: 'credentialStuffing', name: 'Credential Stuffing', defaultWeight: 75 },
];

export type RiskWeights = { [key: string]: number[] };

export interface ScoringParams {
  riskWeights: RiskWeights;
  advancedHeuristics: boolean;
}

const SCORING_PARAMS_KEY = 'cycopsScoringParams';

export const getDefaultWeights = (): RiskWeights => {
  const initialWeights: RiskWeights = {};
  riskVectors.forEach(vector => {
    initialWeights[vector.id] = [vector.defaultWeight];
  });
  return initialWeights;
};

const getDefaultParams = (): ScoringParams => ({
  riskWeights: getDefaultWeights(),
  advancedHeuristics: false,
});

export const useScoring = () => {
  const [scoringParams, setScoringParams] = useState<ScoringParams>(getDefaultParams());

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(SCORING_PARAMS_KEY);
      if (item) {
        setScoringParams(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error reading scoring params from localStorage', error);
      setScoringParams(getDefaultParams());
    }
  }, []);

  const saveScoringParams = (params: ScoringParams) => {
    try {
      setScoringParams(params);
      window.localStorage.setItem(SCORING_PARAMS_KEY, JSON.stringify(params));
    } catch (error) {
      console.error('Error saving scoring params to localStorage', error);
    }
  };
  
  return { scoringParams, saveScoringParams };
};
