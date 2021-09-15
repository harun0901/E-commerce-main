/*
 *
 * Dashboard reducer
 *
 */

import { TOGGLE_DASHBOARD_MENU,FETCH_STATS } from './constants';

const initialState = {
  isMenuOpen: false,
  stats: {}
};

const dashboardReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_DASHBOARD_MENU:
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen
      };
      case FETCH_STATS:
        return {
          ...state,
          stats: action.payload
        };
    default:
      return state;
  }
};

export default dashboardReducer;
