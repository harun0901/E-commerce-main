/*
 *
 * Users actions
 *
 */

import axios from 'axios';

import { FETCH_USERS } from './constants';
import { success } from 'react-notification-system-redux';
import handleError from '../../utils/error';

export const fetchUsers = filter => {
  return async (dispatch, getState) => {
    
    try {
      const response = await axios.get(`/api/user/list`, {
        params: {
          search: filter?.value
        }
      });
      dispatch({ type: FETCH_USERS, payload: response.data.users });


    } catch (error) {
      console.log(error, 'error in search');
      
      handleError(error, dispatch);
    }
  };
};


export const approveMerchantRequest = id => {
  return async (dispatch, getState) => {
    
    try {
      const response = await axios.put(`/api/user/update-to-merchant/${id}`);
      let users = getState().users.users;
      let index = users?.findIndex(user => user.id == id)
      if(index > -1){
        users[index].merchantRequest = false;
        users[index].role = "ROLE_MERCHANT";
      }
      console.log(users, 'user after approve', index, id);
      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };     
       dispatch(success(successfulOptions))
      dispatch({ type: FETCH_USERS, payload: [...users] });
    } catch (error) {
      console.log(error, 'error in search');
      
      handleError(error, dispatch);
    }
  };
};



export const searchUsers = filter => {
  return async (dispatch, getState) => {
    try {
      dispatch(fetchUsers(filter));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
