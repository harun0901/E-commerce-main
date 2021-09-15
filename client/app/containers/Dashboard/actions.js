/*
 *
 * Dashboard actions
 *
 */

import { TOGGLE_DASHBOARD_MENU, FETCH_STATS } from './constants';
import handleError from '../../utils/error';
import axios from 'axios';

export const toggleDashboardMenu = () => {
  return {
    type: TOGGLE_DASHBOARD_MENU
  };
};



// fetch store categories api
export const fetchStats = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/stats/`);
      dispatch({
        type: FETCH_STATS,
        payload: response.data
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};