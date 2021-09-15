/**
 *
 * select.js
 * this helper formulate data into select options
 */

export const formatSelectOptions = (data, isMulti) => {
  let newSelectOptions = [];

  data.map(option => {
    let newOption = {};

    newOption.value = option.id;
    newOption.label = option.name;

    newSelectOptions.push(newOption);
  });

  if (!isMulti) {
    const emptyOption = {
      value: 0,
      label: 'No option selected'
    };

    newSelectOptions.unshift(emptyOption);
  }

  return newSelectOptions;
};

export const unformatSelectOptions = data => {
  let newSelectOptions = [];

  data.map(option => {
    let newOption = {};

    newOption.id = option.value;

    newSelectOptions.push(newOption.id);
  });

  return newSelectOptions;
};
