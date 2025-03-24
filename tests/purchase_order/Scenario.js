import { 
  loadTest, 
  stressTest, 
  spikeTest,
  errorRate,
  successRate,
  trends,
  apiRequestsCounter
} from '../../tests/scenarios/GlobalScenarios.js';

// Extend the base configurations with PO-specific thresholds
export const poLoadTest = {
  ...loadTest,
  thresholds: {
    ...loadTest.thresholds,
    'fetch_states_duration': ['p(95)<300'],  // 95% of fetch states should be under 300ms
    'fetch_pa_duration': ['p(95)<500'],      // 95% of fetch PA should be under 500ms
    'tab_frequency_duration': ['p(95)<800'], // 95% of tab frequency should be under 800ms
  },
};

export const poStressTest = {
  ...stressTest,
  thresholds: {
    ...stressTest.thresholds,
    'fetch_states_duration': ['p(95)<1000'],
    'fetch_pa_duration': ['p(95)<1500'],
    'tab_frequency_duration': ['p(95)<2000'],
  },
};

export const poSpikeTest = {
  ...spikeTest,
};

// Re-export needed metrics
export { errorRate, successRate, apiRequestsCounter };
export const { 
  fetchStateTrend,
  fetchPATrend,
  tabFrequencyTrend,
  poDetailsTrend 
} = trends;