/*
 *
 * Account actions
 *
 */

import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  ACCOUNT_CHANGE,
  FETCH_PROFILE,
  TOGGLE_RESET_FORM,
  CLEAR_ACCOUNT,
  SET_PROFILE_LOADING,
} from './constants';
import handleError from '../../utils/error';

export const accountChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: ACCOUNT_CHANGE,
    payload: formData
  };
};

export const toggleResetForm = () => {
  return {
    type: TOGGLE_RESET_FORM
  };
};

export const clearAccount = () => {
  return {
    type: CLEAR_ACCOUNT
  };
};

export const setProfileLoading = value => {
  return {
    type: SET_PROFILE_LOADING,
    payload: value
  };
};

export const fetchProfile = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setProfileLoading(true));
      const response = await axios.get(`/api/user`);

      dispatch({ type: FETCH_PROFILE, payload: response.data.user });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setProfileLoading(false));
    }
  };
};

export const updateProfile = () => {
  return async (dispatch, getState) => {
    const profile = getState().account.user;

    try {
      const response = await axios.put(`/api/user`, {
        profile
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch({ type: FETCH_PROFILE, payload: response.data.user });

      dispatch(success(successfulOptions));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};


export const postMerchantRequest = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.put(`/api/user/merchantRequest`);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch({ type:  FETCH_PROFILE, payload: {...response.data.user, merchantRequest:true} });

      dispatch(success(successfulOptions));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};