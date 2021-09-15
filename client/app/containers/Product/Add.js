/*
 *
 * Add
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import AddProduct from '../../components/Manager/AddProduct';
import SubPage from '../../components/Manager/SubPage';

class Add extends React.PureComponent {
  componentDidMount() {
    this.props.fetchBrandsSelect();
    this.props.fetchCategorySelect();
  }

  render() {
    const {
      history,
      productFormData,
      formErrors,
      taxableSelect,
      selectedBrands,
      brands,
      selectedCategory,
      categories,
      productChange,
      handleBrandSelect,
      handleCategorySelect,
      addProduct
    } = this.props;


    console.log(categories, 'categories categories categories');
    

    return (
      <SubPage
        title='Add Product'
        actionTitle='Cancel'
        handleAction={() => history.goBack()}
      >
        <AddProduct
          productFormData={productFormData}
          formErrors={formErrors}
          taxableSelect={taxableSelect}
          selectedBrands={selectedBrands}
          selectedCategory={selectedCategory}
          brands={brands}
          categories={categories}
          productChange={productChange}
          handleBrandSelect={handleBrandSelect}
          handleCategorySelect={handleCategorySelect}
          addProduct={addProduct}
        />
      </SubPage>
    );
  }
}

const mapStateToProps = state => {
  return {
    productFormData: state.product.productFormData,
    formErrors: state.product.formErrors,
    taxableSelect: state.product.taxableSelect,
    selectedBrands: state.brand.selectedBrands,
    selectedCategory: state.category.selectedCategory,
    brands: state.brand.brandsSelect,
    categories: state.category.categorySelect
  };
};

export default connect(mapStateToProps, actions)(Add);
