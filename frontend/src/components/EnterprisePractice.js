/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import appKeyFilter from '../appKeyFilter'
import analyticsQuery from '../analyticsQuery'
import queryString from 'query-string'

class EnterprisePractice extends Component {
  render() {
    const results = _.get(this.props.data, 'analyticsQuery.results[0].results')

    if (this.props.data.loading) {
      return <div>Loading</div>
    }
    if (!results) {
      return <div>No data</div>
    }
    const responseTime = parseInt(results[0], 10)
    const numOfCalls = results[1]

    return (
      <tr>
        <td>
          <Link
            to={{
              pathname: '/workflows',
              search: queryString.stringify({ stackId: this.props.stackId }),
            }}
          >
            {this.props.stackId}
          </Link>
        </td>
        <td>
          <Link
            to={{
              pathname: '/workflows',
              search: queryString.stringify({
                practiceId: this.props.practiceId,
              }),
            }}
          >
            {this.props.practiceId}
          </Link>
        </td>
        <td>{this.props.name}</td>
        <td className={`text-right`}>
          {!_.isNaN(responseTime) && `${responseTime} ms`}
        </td>
        <td className="text-right">{numOfCalls}</td>
      </tr>
    )
  }
}

export default graphql(analyticsQuery, {
  options: ({ practiceId, timeAgo: { timeMagnitude, timeUnits } }) => {
    const queryString = `
    SELECT avg(metrics.\`End User Response Time (ms)\`), count(*)
    FROM browser_records
    WHERE userdata.practiceId = "${practiceId}" ${appKeyFilter}
    `

    return {
      variables: {
        queryString,
        timeMagnitude,
        timeUnits,
      },
      pollInterval: 1000 * 60,
    }
  },
})(EnterprisePractice)
