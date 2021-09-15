/**
 *
 * OrderPage
 *
 */

import React from 'react';

import { connect } from 'react-redux';

import actions from '../../actions';

import OrderDetails from '../../components/Manager/OrderDetails';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class OrderPage extends React.PureComponent {
  componentDidMount() {
    const id = this.props.match.params.id;
    this.props.fetchOrder(id);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      const id = this.props.match.params.id;
      this.props.fetchOrder(id);
    }
  }

  render() {
    const { order, isLoading, cancelOrder, cancelOrderItem, changeOrderStatus,user } = this.props;
console.log(user, 'account account account');

    return (
      <div className='order-page'>
        {isLoading ? (
          <LoadingIndicator backdrop />
        ) : order.id ? (
          <OrderDetails
            order={order}
            cancelOrder={cancelOrder}
            cancelOrderItem={cancelOrderItem}
            changeOrderStatus={changeOrderStatus}
            user={user}
          />
        ) : (
          <NotFound message='no order found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    order: state.order.order,
    isLoading: state.order.isLoading,
    user: state.account.user
  };
};

export default connect(mapStateToProps, actions)(OrderPage);
