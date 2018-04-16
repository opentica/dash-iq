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
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  LabelList,
  Legend,
} from 'recharts'

class WorkflowEnterprisePage extends Component {
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

    const data = practiceResults.map(
      ({ results: [practiceId, responseTime, count] }) => ({
        practiceName: `${this.getPracticeName(practiceId)} (${practiceId})`,
        responseTime: parseInt(responseTime, 10),
        count: parseInt(count, 10),
      })
    )

    const enterpriseAvg = Math.round(
      _.sum(practiceResults.map(({ results: [x, y] }) => parseInt(y, 10))) /
        practiceResults.length
    )

    // page average
    const averageResults = parseInt(
      analyticsQueries.find(({ label }) => label === 'averageQuery').results[0]
        .results[0],
      10
    )

    return (
      <div>
        <h4>{this.props.pageName}</h4>
        {practiceResults && practiceResults.length ? (
          <BarChart width={1000} height={300} data={data}>
            <XAxis dataKey="practiceName" />
            <Tooltip />
            <YAxis />
            <Bar dataKey="responseTime" fill="#7ec8ea" unit=" ms">
              <LabelList dataKey="count" />
            </Bar>
            <Legend
              verticalAlign="top"
              height={36}
              payload={[
                {
                  value: 'response time (ms)',
                  type: 'line',
                  color: '#7ec8ea',
                },
                {
                  value: `athenanet average (${averageResults} ms)`,
                  type: 'line',
                  color: 'blue',
                },
                {
                  value: `enterprise average (${enterpriseAvg} ms)`,
                  type: 'line',
                  color: 'red',
                },
              ]}
            />
            <ReferenceLine
              y={enterpriseAvg}
              stroke="red"
              strokeDasharray="3 3"
              alwaysShow
            />
            <ReferenceLine
              y={averageResults}
              stroke="blue"
              strokeDasharray="3 3"
              alwaysShow
            />
          </BarChart>
        ) : null}
      </div>
    )
  }
}

export default graphql(multipleAnalyticsQueries, {
  options: ({ pageName, practices, timeAgo: { timeMagnitude, timeUnits } }) => {
    const practiceStrings = practices
      .map(({ contextId }) => `"${contextId}"`)
      .join()
    const practicesQueryString = `
    SELECT userdata.practiceId, avg(metrics.\`End User Response Time (ms)\`) AS "Response Time", count(*)
    FROM browser_records
    WHERE pagename = "${pageName}"
      AND userdata.practiceId IN (${practiceStrings})
      ${appKeyFilter}
    ORDER BY \`Response Time\` DESC
    LIMIT 200
    `

    const averageQueryString = `
    SELECT avg(metrics.\`End User Response Time (ms)\`) AS "Response Time"
    FROM browser_records
    WHERE pagename = "${pageName}"
      ${appKeyFilter}
    ORDER BY \`Response Time\` DESC
    LIMIT 200
    `
    const analyticsQueries = [
      { label: 'practicesQuery', queryString: practicesQueryString },
      { label: 'averageQuery', queryString: averageQueryString },
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
})(WorkflowEnterprisePage)
