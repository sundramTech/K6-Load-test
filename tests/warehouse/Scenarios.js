import { Trend } from 'k6/metrics';
import {
  loadTest,
  stressTest,
  spikeTest,
  errorRate,
  successRate,
  apiRequestsCounter
} from '../scenarios/GlobalScenarios.js';

// Warehouse-specific trends
const warehouseTrends = {
  warehouseListTrend: new Trend('warehouse_list_duration'),
  cropDetailsTrend: new Trend('crop_details_duration'),
  consignmentCreateTrend: new Trend('consignment_create_duration'),
  poCoListTrend: new Trend('po_co_list_duration')
};

// Extend the base configurations with warehouse-specific thresholds
export const warehouseLoadTest = {
  ...loadTest,
  thresholds: {
    ...loadTest.thresholds,
    'warehouse_list_duration': ['p(95)<800'],    // 95% of warehouse list requests should be under 800ms
    'crop_details_duration': ['p(95)<500'],      // 95% of crop details should be under 500ms
    'consignment_create_duration': ['p(95)<2000'], // 95% of consignment creation should be under 2s
    'po_co_list_duration': ['p(95)<1000']        // 95% of PO/CO list requests should be under 1s
  },
};

export const warehouseStressTest = {
  ...stressTest,
  stages: [
    { duration: '1m', target: 30 },    // Ramp up to 30 users over 1 minute
    { duration: '2m', target: 60 },    // Ramp up to 60 users over 2 minutes
    { duration: '3m', target: 100 },   // Ramp up to 100 users over 3 minutes
    { duration: '5m', target: 100 },   // Stay at 100 users for 5 minutes
    { duration: '2m', target: 50 },    // Ramp down to 50 users
    { duration: '1m', target: 0 },     // Ramp down to 0 users
  ],
  thresholds: {
    ...stressTest.thresholds,
    'warehouse_list_duration': ['p(95)<2000'],
    'crop_details_duration': ['p(95)<1500'],
    'consignment_create_duration': ['p(95)<4000'],
    'po_co_list_duration': ['p(95)<2500']
  },
};

export const warehouseSpikeTest = {
  ...spikeTest,
  stages: [
    { duration: '30s', target: 10 },   // Normal load
    { duration: '15s', target: 150 },  // Spike to 150 users over 15 seconds
    { duration: '1m', target: 150 },   // Stay at peak for 1 minute
    { duration: '30s', target: 10 },   // Quickly drop back to normal
    { duration: '1m', target: 10 },    // Stay at normal load to see recovery
    { duration: '10s', target: 0 },    // End test
  ],
  thresholds: {
    ...spikeTest.thresholds,
    'warehouse_list_duration': ['p(95)<3000'],
    'crop_details_duration': ['p(95)<2000'],
    'consignment_create_duration': ['p(95)<5000'],
    'po_co_list_duration': ['p(95)<3000']
  },
};

// Re-export needed metrics
export { errorRate, successRate, apiRequestsCounter };

// Export warehouse-specific trends
export const {
  warehouseListTrend,
  cropDetailsTrend,
  consignmentCreateTrend,
  poCoListTrend
} = warehouseTrends;

// Optional: Default export for configuration verification
export default function() {
  console.log("Warehouse scenarios configuration loaded successfully");
} 