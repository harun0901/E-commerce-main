/*
 *
 * Stats
 *
 */

import React from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { Row, Col } from 'reactstrap';

import actions from '../../actions';

import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class Stats extends React.PureComponent {
  componentDidMount() {
    this.props.fetchStats();
  }

  render() {
    const { stats, isLoading, order } = this.props;
    console.log(stats);


    return (
      <div className='order-success'>
        {isLoading ? (
          <LoadingIndicator />
        ) : (
            <div>
              <Row>
                <Col xs='12' md='4'>
                  <div className="mt-5 orders">

                    <h3>{stats?.newOrders}</h3>
                    <h3>New Orders</h3>
                  </div>
                </Col>
                <Col xs='12' md='4'>
                  <div className="mt-5 orders">

                    <h3>{stats?.inProgress}</h3>
                    <h3> In-Progress Orders</h3>
                  </div>
                </Col>
                <Col xs='12' md='4'>
                  <div className="mt-5 orders">

                    <h3>{stats?.delivered}</h3>
                    <h3>Delivered Orders</h3>
                  </div>
                </Col>
                <Col xs='12' md='4'>
                  <div className="mt-5 orders">

                    <h3>{stats?.totalRevenue}</h3>
                    <h3>Total Revenue</h3>
                  </div>
                </Col>
                <Col xs='12' md='4'>
                  <div className="mt-5 orders">

                    <h3>{stats?.totalUsers}</h3>
                    <h3>Total Users</h3>
                  </div>
                </Col>
              </Row>
            </div>
          )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    order: state.order.order,
    isLoading: state.order.isLoading,
    stats: state.dashboard.stats
  };
};

export default connect(mapStateToProps, actions)(Stats);
