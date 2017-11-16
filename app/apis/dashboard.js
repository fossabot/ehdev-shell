/**
 * dashboard apis
 * @author ryan.bian
 */
import { handleResponse } from './utils';

const API_PATH = '/api/dashboard';

const DASHBOARD_API = {
  projects: {
    async getList() {
      const res = await fetch(`${API_PATH}/projects`);
      return handleResponse(res);
    }
  },
  overall: {
    async get() {
      const res = await fetch(`${API_PATH}/overall`);
      return handleResponse(res);
    }
  },
  wallPaper: {
    async get() {
      const res = await fetch(`${API_PATH}/dailyWallpaper`);
      return handleResponse(res);
    }
  },
};

export default DASHBOARD_API;
