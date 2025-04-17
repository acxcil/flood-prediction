// API endpoints
export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: '/auth/login',
      SIGNUP: '/auth/signup',
    },
    PREDICTION: {
      PREDICT: '/prediction/predict',
      BATCH_PREDICT: '/prediction/batch-predict',
      RISK_TREND: '/prediction/risk-trend',
    },
    DATA: {
      HISTORICAL: '/data/historical',
      STATS: '/data/stats',
      EXPORT: '/data/export',
    },
    REGIONS: {
      LIST: '/regions',
      DETAIL: '/regions',
    },
    ALERTS: {
      SIMULATE: '/alerts/simulate',
    },
  };
  
  // Risk levels
  export const RISK_LEVELS = {
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
  };
  
  // Risk thresholds
  export const RISK_THRESHOLDS = {
    HIGH: 0.7,
    MEDIUM: 0.4,
  };
  
  // Map settings
  export const MAP_SETTINGS = {
    DEFAULT_CENTER: [41.20, 74.76],
    DEFAULT_ZOOM: 7,
    TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  };
  
  // Data visualization colors
  export const CHART_COLORS = {
    RIVER_LEVEL: '#1976d2', // primary.main
    PRECIPITATION: '#2196f3', // info.main
    TEMPERATURE: '#ff9800', // warning.main
    FLOOD: '#f44336', // error.main
    NO_FLOOD: '#4caf50', // success.main
  };
  
  // Time intervals
  export const TIME_INTERVALS = {
    DAY: 1,
    WEEK: 7,
    MONTH: 30,
    QUARTER: 90,
    YEAR: 365,
  };
  
  // Local storage keys
  export const STORAGE_KEYS = {
    AUTH_TOKEN: 'flood_prediction_token',
    THEME_MODE: 'themeMode',
    USER_PREFERENCES: 'userPreferences',
  };
  
  // Routes
  export const ROUTES = {
    HOME: '/',
    DASHBOARD: '/',
    PREDICTION: '/prediction',
    REGIONS: '/regions',
    REGION_DETAIL: '/regions/:regionId',
    HISTORICAL: '/historical',
    ALERTS: '/alerts',
    LOGIN: '/login',
    SIGNUP: '/signup',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    HELP: '/help',
    NOT_FOUND: '/404',
  };
  
  // Form validation regex patterns
  export const VALIDATION_PATTERNS = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD: /^.{8,}$/,
    USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
  };