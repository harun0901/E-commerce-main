/**
 *
 * OrderSummary
 *
 */

import React from 'react';

import { Col } from 'reactstrap';

const OrderSummary = props => {
  const { order } = props;

  const getTotal = () =>{
    let total = 0;
    for(let pr of order.OrderDetails || []){
      console.log(pr);
      if(pr.status != "Cancelled"){
        total+=pr.productPrice * pr.quantity
      }   
    }
    return total
  }

  return (
    <Col className='order-summary pt-3'>
      <h2>Order Summary</h2>
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Subtotal</p>
        <p className='summary-value ml-auto'>${getTotal()}</p>
      </div>
      {/* <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Est. Sales Tax</p>
        <p className='summary-value ml-auto'>${0}</p>
      </div> */}

      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Shipping & Handling</p>
        <p className='summary-value ml-auto'>$0</p>
      </div>

      <hr />
      <div className='d-flex align-items-center summary-item'>
        <p className='summary-label'>Total</p>
        <p className='summary-value ml-auto'>${getTotal()}</p>
      </div>
    </Col>
  );
};

export default OrderSummary;
