/**
 *
 * OrderMeta
 *
 */

import React from 'react';

import { Link } from 'react-router-dom';
import { Row, Col } from 'reactstrap';

import { formatDate } from '../../../helpers/date';
import Button from '../../Common/Button';
import SelectOption from '../../Common/SelectOption';
const OrderMeta = props => {
  const { order, cancelOrder, changeOrderStatus,user } = props;

  return (
    <div className='order-meta'>
      <div className='d-flex align-items-center justify-content-between mb-3 title'>
        <h2 className='mb-0'>Order Details</h2>
        <Link className='redirect-link' to={'/dashboard/orders'}>
          Back to orders
        </Link>
      </div>

      <Row>
        <Col xs='12' md='8'>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Order Number</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${order.id}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Order Date</p>
            </Col>
            <Col xs='8'>
              <span className='order-label one-line-ellipsis'>{` ${formatDate(
                order.created
              )}`}</span>
            </Col>
          </Row>
          <Row>
            <Col xs='4'>
              <p className='one-line-ellipsis'>Status</p>
            </Col>
            <Col xs='8'>
            <span className='order-label one-line-ellipsis'>{` ${order.status}`}</span>
              </Col>
          </Row>
          <Row>
            {
              user && (user.role === "ROLE_ADMIN" || user.role === "ROLE_MERCHANT") &&
 
            <Col xs={6}>
            <SelectOption
              multi={false}
              label={"Update status"}
              options={[ 
                { value: 'Not processed', label: 'Not processed' },
                { value: 'Processing', label: 'Processing' },
                { value: 'Shipped', label: 'Shipped' },
                { value: 'Delivered', label: 'Delivered' },
              ]}
              defaultValue={{value: order.status, lable: order.status}}
              handleSelectChange={value => {
                changeOrderStatus(value.value);
              }}
            />
            </Col>
}
          </Row>
        </Col>
        <Col xs='12' md='4' className='text-left text-md-right'>
          {
            order.status !== "Cancelled" && <Button
              id='CancelOrderItemPopover'
              size='sm'
              text='Cancel Order'
              onClick={cancelOrder}
            />
          }

        </Col>
      </Row>
    </div>
  );
};

export default OrderMeta;
