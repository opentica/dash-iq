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
import enterprises from '../enterprises'
import weightedMean from 'weighted-mean'

const getEnterpriseFromPracticeId = practiceId => {
  for (let i = 0; i < enterprises.length; i += 1) {
    const { name, contexts } = enterprises[i]
    if (contexts.map(({ contextId }) => contextId).includes(practiceId)) {
      return name
    }
  }
}

class EnterpriseSummaryComponent extends Component {
  getPracticeName = practiceId => {
    const { name } = _.find(
      this.props.practices,
      ({ contextId }) => contextId === practiceId
    )
    return name
  }
  render() {
    if (this.props.data.loading) {
      return <div>Loading</div>
    }
    const analyticsQueries = _.get(this.props.data, 'analyticsQueries')

    const practiceResults = _.get(analyticsQueries, '[0].results')
    const athenanetAvg = _.get(analyticsQueries, '[1].results.[0].results[0]')

    const strategicAccountsAvg =
      practiceResults &&
      parseInt(
        weightedMean(
          practiceResults.map(({ results }) => [
            parseInt(results[2], 10),
            parseInt(results[3], 10),
          ])
        ),
        10
      )

    if (!practiceResults) {
      return <div>No results</div>
    }

    const formattedPracticeResults = practiceResults.map(
      ({ results: [practiceId, pageName, responseTime, count] }) => ({
        practiceId,
        pageName,
        responseTime: parseInt(responseTime, 10),
        count: parseInt(count, 10),
      })
    )

    const entepriseResults = _.groupBy(
      formattedPracticeResults,
      ({ practiceId }) => getEnterpriseFromPracticeId(practiceId)
    )

    // summary stats
    const summaryResults = _.reverse(
      _.sortBy(
        Object.entries(entepriseResults).map(([enterpriseName, results]) => ({
          enterpriseName,
          responseTime: parseInt(
            weightedMean(
              results.map(({ responseTime, count }) => [responseTime, count])
            ),
            10
          ),
          count: _.sumBy(results, 'count'),
        })),
        'responseTime'
      )
    )

    // page results
    const pageResults = Object.entries(
      _.groupBy(formattedPracticeResults, 'pageName')
    ).map(([name, results]) => ({
      name,
      results: _.groupBy(
        Object.entries(_.groupBy(results, 'practiceId')).map(
          ([practiceId, results]) => ({
            practiceId,
            responseTime: weightedMean(
              results.map(({ responseTime, count }) => [responseTime, count])
            ),
            count: _.sumBy(results, 'count'),
          })
        ),
        ({ practiceId }) => getEnterpriseFromPracticeId(practiceId)
      ),
    }))

    const pageResultsFinal = pageResults.map(({ name, results }) => ({
      name,
      results: Object.keys(results).map(enterpriseName => {
        const enterpriseResults = results[enterpriseName]
        return {
          enterpriseName,
          responseTime: parseInt(
            weightedMean(
              enterpriseResults.map(({ responseTime, count }) => [
                responseTime,
                count,
              ])
            ),
            10
          ),
          count: _.sumBy(enterpriseResults, 'count'),
        }
      }),
    }))

    console.log(pageResultsFinal)

    return (
      <div>
        <div className="">
          <h2>Summary</h2>
          <BarChart width={1000} height={300} data={summaryResults}>
            <XAxis dataKey="enterpriseName" />
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
                  value: `enterprise average (${strategicAccountsAvg} ms)`,
                  type: 'line',
                  color: 'red',
                },
                {
                  value: `athenanet average (${parseInt(athenanetAvg, 10)} ms)`,
                  type: 'line',
                  color: 'blue',
                },
              ]}
            />
            <ReferenceLine
              y={strategicAccountsAvg}
              stroke="red"
              strokeDasharray="3 3"
              alwaysShow
            />
            <ReferenceLine
              y={athenanetAvg}
              stroke="blue"
              strokeDasharray="3 3"
              alwaysShow
            />
          </BarChart>
        </div>
        <div className="">
          {pageResultsFinal &&
            pageResultsFinal.map(({ name, results }) => (
              <React.Fragment key={name}>
                <h3>{name}</h3>
                <BarChart
                  width={1000}
                  height={300}
                  data={_.reverse(_.sortBy(results, 'responseTime'))}
                >
                  <XAxis dataKey="enterpriseName" />
                  <Tooltip />
                  <YAxis />
                  <Bar dataKey="responseTime" fill="#7ec8ea" unit=" ms">
                    <LabelList dataKey="count" />
                  </Bar>
                </BarChart>
              </React.Fragment>
            ))}
        </div>
      </div>
    )
  }
}

export default graphql(multipleAnalyticsQueries, {
  options: ({
    allPracticeIds,
    allPages,
    timeAgo: { timeMagnitude, timeUnits },
  }) => {
    const practiceStrings = allPracticeIds
      .map(practice => `"${practice}"`)
      .join()

    const pageNamesStrings = allPages.map(page => `"${page}"`).join()

    const practicesQueryString = `
    SELECT userdata.practiceId, pagename, avg(metrics.\`End User Response Time (ms)\`) AS "Response Time", count(*)
    FROM browser_records
    WHERE pagename IN (${pageNamesStrings})
      AND userdata.practiceId IN (${practiceStrings})
      ${appKeyFilter}
    ORDER BY \`Response Time\` DESC
    LIMIT 10000
    `

    const averageQueryString = `
    SELECT avg(metrics.\`End User Response Time (ms)\`) AS "Response Time"
    FROM browser_records
    WHERE pagename IN (${pageNamesStrings})
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
})(EnterpriseSummaryComponent)
