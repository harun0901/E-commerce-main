/*
 *
 * Order actions
 *
 */

import { push } from 'connected-react-router';
import axios from 'axios';
import { success } from 'react-notification-system-redux';

import {
  FETCH_ORDERS,
  FETCH_ORDER,
  UPDATE_ORDER,
  TOGGLE_ADD_ORDER,
  SET_ORDERS_LOADING,
  CLEAR_ORDERS
} from './constants';
import { clearCart, getCartId } from '../Cart/actions';
import { toggleCart } from '../Navigation/actions';
import handleError from '../../utils/error';

export const toggleAddOrder = () => {
  return {
    type: TOGGLE_ADD_ORDER
  };
};

export const updateOrder = value => {
  return {
    type: UPDATE_ORDER,
    payload: value
  };
};

export const setOrderLoading = value => {
  return {
    type: SET_ORDERS_LOADING,
    payload: value
  };
};

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`/api/order/list`);

      if (response.data.orders) {
        dispatch({
          type: FETCH_ORDERS,
          payload: response.data.orders
        });
      }
    } catch (error) {
      dispatch(clearOrders());
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const fetchOrder = id => {
  return async (dispatch, getState) => {
    try {
      dispatch(setOrderLoading(true));

      const response = await axios.get(`/api/order/${id}`);

      dispatch({
        type: FETCH_ORDER,
        payload: response.data.order
      });
    } catch (error) {
      handleError(error, dispatch);
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const cancelOrder = () => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      await axios.delete(`/api/order/cancel/${order.id}`);

      dispatch(push(`/dashboard/orders`));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const changeOrderStatus = (value) => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      const response = await axios.put(`/api/order/change-status/${order.id}`, {
        status: value,
      });

      const successfulOptions = {
        title: `Status Updated`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(success(successfulOptions));
      dispatch(fetchOrder(order.id));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};


export const cancelOrderItem = itemId => {
  return async (dispatch, getState) => {
    try {
      const order = getState().order.order;

      const response = await axios.put(`/api/order/cancel/item/${itemId}`, {
        orderId: order.id,
      });

      if (response.data.orderCancelled) {
        dispatch(push(`/dashboard/orders`));
      }

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      dispatch(success(successfulOptions));
      dispatch(updateOrder({ itemId, status: 'Cancelled' }, 'cencelled'));
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const addOrder = (cart) => {
  return async (dispatch, getState) => {
    try {
      const total = getState().cart.cartTotal;

        const response = await axios.post(`/api/order/add`, {
          total,
          cart
        });

        dispatch(push(`/order/success/${response.data.order.id}`));
        dispatch(clearCart());
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

export const placeOrder = () => {
  return (dispatch, getState) => {
    const token = localStorage.getItem('token');

    const cartItems = getState().cart.cartItems;
console.log(cartItems, 'token token', token);

    if (token && cartItems.length > 0) {

        dispatch(addOrder(cartItems));
      
    }

    dispatch(toggleCart());
  };
};

export const clearOrders = () => {
  return {
    type: CLEAR_ORDERS
  };
};
