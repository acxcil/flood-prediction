// components/api.js
/**
 * Frontend API helper for ML-driven Flood Prediction and Early Warning
 * Connects to FastAPI backend at http://127.0.0.1:8000
 */
import axios from 'axios';

const BASE = 'http://127.0.0.1:8000';

const api = {
  // ─── Regions ────────────────────────────────────────────────────────────────
  /**
   * GET /regions
   * @returns {Promise<Array<{ id: string, name: string, lat: number, lon: number }>>}
   */
  getRegions: () =>
    axios.get(`${BASE}/regions`).then(res => res.data),

  // ─── Forecasts ──────────────────────────────────────────────────────────────
  /**
   * GET /forecast/latest
   * @returns {Promise<Array<ForecastOut>>}
   */
  getLatest: () =>
    axios.get(`${BASE}/forecast/latest`).then(res => res.data),

  /**
   * GET /forecast/{region}?days={days}
   * @param {string} region
   * @param {number} days
   * @returns {Promise<Array<ForecastOut>>}
   */
  getHistory: (region, days = 30) =>
    axios
      .get(`${BASE}/forecast/${region}`, { params: { days } })
      .then(res => res.data),

  /**
   * GET /forecast/{region}
   * (no params) → returns all available history for that region
   * @param {string} region
   * @returns {Promise<Array<ForecastOut>>}
   */
  getAllHistory: (region) =>
    axios.get(`${BASE}/forecast/${region}`).then(res => res.data),

  /**
   * GET /forecast/{region}?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD
   * @param {string} region
   * @param {string} start_date ISO date string
   * @param {string} end_date   ISO date string
   * @returns {Promise<Array<ForecastOut>>}
   */
  getHistoryByRange: (region, start_date, end_date) =>
    axios
      .get(`${BASE}/forecast/${region}`, {
        params: { start_date, end_date },
      })
      .then(res => res.data),

  // ─── Authentication ─────────────────────────────────────────────────────────
  /**
   * POST /auth/login
   * @param {string} username
   * @param {string} password
   * @returns {Promise<string>} access_token
   */
  login: (username, password) =>
    axios
      .post(`${BASE}/auth/login`, { username, password })
      .then(res => res.data.access_token),

  /**
   * POST /users/
   * @param {string} email
   * @param {string} password
   * @returns {Promise<UserOut>}
   */
  register: (email, password) =>
    axios
      .post(`${BASE}/users/`, { email, password })
      .then(res => res.data),

  /**
   * GET /auth/me
   * @param {string} token
   * @returns {Promise<UserOut>}
   */
  getCurrentUser: token =>
    axios
      .get(`${BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.data),

  // ─── Subscriptions ──────────────────────────────────────────────────────────
  /**
   * GET /user/subscriptions
   * @param {string} token
   * @returns {Promise<Array<Subscription>>}
   */
  getSubscriptions: token =>
    axios
      .get(`${BASE}/user/subscriptions`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.data),

  /**
   * POST /user/subscriptions
   * @param {string} region
   * @param {string} token
   * @returns {Promise<Subscription>}
   */
  subscribe: (region, token) =>
    axios
      .post(
        `${BASE}/user/subscriptions`,
        { region },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => res.data),

  /**
   * DELETE /user/subscriptions/{id}
   * @param {string|number} id
   * @param {string} token
   * @returns {Promise<void>}
   */
  unsubscribe: (id, token) =>
    axios.delete(`${BASE}/user/subscriptions/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // ─── Admin ─────────────────────────────────────────────────────────────────
  /**
   * POST /admin/ingest
   * @param {string} token
   * @returns {Promise<IngestResponse>}
   */
  ingest: token =>
    axios
      .post(`${BASE}/admin/ingest`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.data),

  /**
   * DELETE /admin/cleanup?days={days}
   * @param {string} token
   * @param {number} days
   * @returns {Promise<void>}
   */
  cleanup: (token, days = 30) =>
    axios
      .delete(`${BASE}/admin/cleanup`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { days },
      })
      .then(res => res.data),

  // ─── Prediction (Model Testing) ─────────────────────────────────────────────
  /**
   * POST /predict
   * @param {object} features
   * @returns {Promise<{ risk_score: number, alert_level: string }>}
   */
  predict: features =>
    axios.post(`${BASE}/predict`, features).then(res => res.data),
};

export default api;
