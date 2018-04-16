import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import _ from 'lodash'
import appKeyFilter from '../appKeyFilter'
import multipleAnalyticsQueries from '../multipleAnalyticsQueries'

class WorkflowPage extends Component {
  render() {
    const results = _.get(
      this.props.data,
      'analyticsQueries[0].results[0].results'
    )

    if (this.props.data.loading) {
      return <div>Loading</div>
    }
    if (!results) {
      return <div>No data</div>
    }
    const responseTime = parseInt(results[0], 10)
    const numOfCalls = results[1]

    let responseTimeThresholdClass = ''
    if (responseTime >= this.props.responseTimeCritical) {
      responseTimeThresholdClass = 'bg-danger text-light font-weight-bold'
    } else if (responseTime >= this.props.responseTimeWarning) {
      responseTimeThresholdClass = 'bg-warning font-weight-bold'
    }

    const avgResult = _.get(
      this.props.data,
      'analyticsQueries[1].results[0].results[0]'
    )

    return (
      <tr>
        <td>
          <PageNameLink
            key={this.props.pageName}
            pageName={this.props.pageName}
            addId={this.props.addId}
            applicationId={process.env.REACT_APP_APPD_APP_ID}
            controllerPath={process.env.REACT_APP_APPD_CONTROLLER_BASE_URL}
          />
        </td>
        {avgResult ? (
          <td className={`text-right ${responseTimeThresholdClass}`}>
            {avgResult ? `${parseInt(avgResult, 10)} ms` : ''}
          </td>
        ) : (
          undefined
        )}
        <td className={`text-right ${responseTimeThresholdClass}`}>
          {responseTime ? `${responseTime} ms` : ''}
        </td>
        <td className="text-right">{numOfCalls}</td>
      </tr>
    )
  }
}

const PageNameLink = ({ addId, pageName, applicationId, controllerPath }) =>
  !addId ? (
    pageName
  ) : (
    <a
      target="_blank"
      href={`${controllerPath}/controller/#/location=EUM_PAGE_DASHBOARD&timeRange=last_15_minutes.BEFORE_NOW.-1.-1.15&application=${applicationId}&addId=${addId}`}
    >
      {pageName}
    </a>
  )

const addFilterClause = name => {
  const key = Object.keys(name)[0]
  const val = Object.values(name)[0]

  return val ? `AND userdata.${key} = "${val}"` : ''
}

export default graphql(multipleAnalyticsQueries, {
  options: ({
    pageName,
    practiceId,
    stackId,
    username,
    timeAgo: { timeMagnitude, timeUnits },
  }) => {
    const practiceQueryString = `
      SELECT avg(metrics.\`End User Response Time (ms)\`), count(*)
      FROM browser_records
      WHERE pagename = "${pageName}"
      ${addFilterClause({ practiceId })}
      ${addFilterClause({ stack: stackId })}
      ${addFilterClause({ username })}
      ${appKeyFilter}
    `
    let analyticsQueries = [
      { label: 'practicesQuery', queryString: practiceQueryString },
    ]
    if (practiceId || stackId || username) {
      const athenaAvgQuery = `
        SELECT avg(metrics.\`End User Response Time (ms)\`)
        FROM browser_records
        WHERE pagename = "${pageName}"
        ${appKeyFilter}
      `
      analyticsQueries.push({
        label: 'athenaAvgQuery',
        queryString: athenaAvgQuery,
      })
    }

    return {
      variables: {
        analyticsQueries,
        timeMagnitude,
        timeUnits,
      },
      pollInterval: 1000 * 60,
    }
  },
})(WorkflowPage)
