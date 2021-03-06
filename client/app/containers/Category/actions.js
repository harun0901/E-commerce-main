/*
 *
 * Category actions
 *
 */

import { goBack } from 'connected-react-router';
import { success } from 'react-notification-system-redux';
import axios from 'axios';

import {
  FETCH_CATEGORIES,
  FETCH_STORE_CATEGORIES,
  FETCH_CATEGORY,
  CATEGORY_CHANGE,
  CATEGORY_EDIT_CHANGE,
  SET_CATEGORY_FORM_ERRORS,
  SET_CATEGORY_FORM_EDIT_ERRORS,
  RESET_CATEGORY,
  TOGGLE_ADD_CATEGORY,
  ADD_CATEGORY,
  REMOVE_CATEGORY,
  FETCH_CATEGORY_SELECT,
  CATEGORY_SELECT
} from './constants';

import { RESET_PRODUCT } from '../Product/constants';

import handleError from '../../utils/error';
import { unformatSelectOptions,formatSelectOptions } from '../../helpers/select';
import { allFieldsValidation } from '../../utils/validation';

export const categoryChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: CATEGORY_CHANGE,
    payload: formData
  };
};

export const categoryEditChange = (name, value) => {
  let formData = {};
  formData[name] = value;

  return {
    type: CATEGORY_EDIT_CHANGE,
    payload: formData
  };
};

export const toggleAddCategory = () => {
  return {
    type: TOGGLE_ADD_CATEGORY
  };
};

export const categorySelect = value => {
  return {
    type: CATEGORY_SELECT,
    payload: value
  };
};

export const handleCategorySelect = value => {
  return {
    type: CATEGORY_SELECT,
    payload: value
  };
};

// fetch store categories api
export const fetchStoreCategories = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/category/list`);

      dispatch({
        type: FETCH_STORE_CATEGORIES,
        payload: response.data.categories
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// fetch categories api
export const fetchCategories = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/category`);

      dispatch({
        type: FETCH_CATEGORIES,
        payload: response.data.categories
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// fetch categories select api
export const fetchCategorySelect = () => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/category/list/select`);
      let formattedCategory = formatSelectOptions(response.data.categories);

      dispatch({
        type: FETCH_CATEGORY_SELECT,
        payload: formattedCategory
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// fetch category api
export const fetchCategory = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/api/category/${id}`);

      dispatch({
        type: FETCH_CATEGORY,
        payload: response.data.category
      });
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// add category api
export const addCategory = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        name: 'required|min:1',
        description: 'required|min:1|max:200',
        image: 'required',
      };

      const category = getState().category.categoryFormData;

      const { isValid, errors } = allFieldsValidation(category, rules, {
        'required.name': 'Name is required.',
        'min.name': 'Name must be at least 1 character.',
        'required.description': 'Description is required.',
        'required.image': 'Image is required.',
        'min.description': 'Description must be at least 1 character.',
        'max.description':
          'Description may not be greater than 200 characters.',
      });

      if (!isValid) {
        return dispatch({ type: SET_CATEGORY_FORM_ERRORS, payload: errors });
      }
      
      const formData = new FormData();
      if (category.image) {
        for (var key in category) {
          if (category.hasOwnProperty(key)) {
            formData.append(key, category[key]);
          }
        }
      }

      const response = await axios.post(`/api/category/add`, formData,{
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: ADD_CATEGORY,
          payload: response.data.category
        });
        dispatch({ type: RESET_CATEGORY });
        dispatch({ type: RESET_PRODUCT });
        dispatch(toggleAddCategory());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// update category api
export const updateCategory = () => {
  return async (dispatch, getState) => {
    try {
      const rules = {
        name: 'required|min:1',
        description: 'required|min:1|max:200'
      };

      const category = getState().category.category;

      const newCategory = {
        name: category.name,
        description: category.description
      };

      const { isValid, errors } = allFieldsValidation(newCategory, rules, {
        'required.name': 'Name is required.',
        'min.name': 'Name must be at least 1 character.',
        'required.description': 'Description is required.',
        'min.description': 'Description must be at least 1 character.',
        'max.description': 'Description may not be greater than 200 characters.'
      });

      if (!isValid) {
        return dispatch({
          type: SET_CATEGORY_FORM_EDIT_ERRORS,
          payload: errors
        });
      }

      const response = await axios.put(`/api/category/${category.id}`, {
        category: newCategory
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));

        dispatch(goBack());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// activate category api
export const activateCategory = (id, value) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.put(`/api/category/${id}/active`, {
        category: {
          isActive: value
        }
      });

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success === true) {
        dispatch(success(successfulOptions));
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};

// delete category api
export const deleteCategory = id => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.delete(`/api/category/delete/${id}`);

      const successfulOptions = {
        title: `${response.data.message}`,
        position: 'tr',
        autoDismiss: 1
      };

      if (response.data.success == true) {
        dispatch(success(successfulOptions));
        dispatch({
          type: REMOVE_CATEGORY,
          payload: id
        });
        dispatch(goBack());
      }
    } catch (error) {
      handleError(error, dispatch);
    }
  };
};
