/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import _ from 'lodash'
import appKeyFilter from '../appKeyFilter'
import multipleAnalyticsQueries from '../multipleAnalyticsQueries'
import { BarChart, Bar, LabelList, XAxis, YAxis, Tooltip } from 'recharts'

class EnterpriseIPPractices extends Component {
  getPracticeName = practiceId => {
    const { name } = _.find(
      this.props.practices,
      ({ contextId }) => contextId === practiceId
    )
    return name
  }
  render() {
    const analyticsQueries = _.get(this.props.data, 'analyticsQueries')

    const hasData = _.get(this.props.data, 'analyticsQueries[0].results[0]')

    if (this.props.data.loading) {
      return <div>Loading</div>
    }
    if (!hasData) {
      return <div>{this.props.pageName} - No data</div>
    }

    const practiceResults = analyticsQueries.find(
      ({ label }) => label === 'practicesQuery'
    ).results

    const dataRaw = practiceResults.map(
      ({ results: [practiceId, x, responseTime, count] }) => ({
        practiceId,
        x,
        responseTime: parseInt(responseTime, 10),
        count: parseInt(count, 10),
      })
    )
    const dataUnsorted = _.groupBy(dataRaw, 'practiceId')
    const data = Object.entries(dataUnsorted).map(
      ([practiceId, practiceData]) => [
        practiceId,
        _.reverse(_.sortBy(practiceData, 'count')),
      ]
    )
    return (
      <div>
        {practiceResults && practiceResults.length
          ? data.map(([practiceId, practiceData]) => (
              <React.Fragment key={practiceId}>
                <h4>
                  {practiceId} - {this.getPracticeName(practiceId)}
                </h4>
                <BarChart width={1000} height={300} data={practiceData}>
                  <XAxis dataKey="x" />
                  <Tooltip />
                  <YAxis />
                  <Bar dataKey="responseTime" fill="#7ec8ea" unit=" ms">
                    <LabelList dataKey="count" />
                  </Bar>
                </BarChart>
              </React.Fragment>
            ))
          : null}
      </div>
    )
  }
}

export default graphql(multipleAnalyticsQueries, {
  options: ({
    pageName,
    practices,
    showIP,
    timeAgo: { timeMagnitude, timeUnits },
  }) => {
    const practiceStrings = practices
      .map(({ contextId }) => `"${contextId}"`)
      .join()
    const practicesQueryString = `
    SELECT userdata.practiceId, ${showIP ? 'ip' : 'geocarrier'},
      avg(metrics.\`End User Response Time (ms)\`),
      count(metrics.\`End User Response Time (ms)\`) AS "Response Time"
    FROM browser_records
    WHERE userdata.practiceId IN (${practiceStrings})
      ${appKeyFilter}
    ORDER BY \`Response Time\` DESC
    LIMIT 200
    `

    const analyticsQueries = [
      { label: 'practicesQuery', queryString: practicesQueryString },
    ]
    return {
      variables: {
        analyticsQueries,
        timeMagnitude,
        timeUnits,
      },
      pollInterval: 1000 * 60,
    }
  },
})(EnterpriseIPPractices)
