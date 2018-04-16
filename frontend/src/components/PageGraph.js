import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import _ from 'lodash'
import appKeyFilter from '../appKeyFilter'
import analyticsQuery from '../analyticsQuery'
import { getSeriesIntervalSize } from '../timeRanges'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'
import moment from 'moment'

const CustomTick = value => {
  const text = moment(value, 'x')
  return text
}

class PageGraph extends Component {
  render() {
    const results = _.get(this.props.data, 'analyticsQuery.results')
    const data =
      results &&
      results.map(({ results: [x, y] }) => ({
        x,
        y: parseInt(y, 10),
      }))

    if (this.props.data.loading) {
      return <div>Loading</div>
    }
    if (!results) {
      return <div>No data</div>
    }

    return (
      <div>
        {this.props.pageName}
        <LineChart width={600} height={300} data={data}>
          <Line type="monotone" dataKey="y" stroke="#8884d8" />
          <XAxis dataKey="x" tickFormatter={CustomTick} />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    )
  }
}

const addFilterClause = name => {
  const key = Object.keys(name)[0]
  const val = Object.values(name)[0]

  return val ? `AND userdata.${key} = "${val}"` : ''
}

export default graphql(analyticsQuery, {
  options: ({
    pageName,
    practiceId,
    stackId,
    username,
    timeAgo: { name, timeMagnitude, timeUnits },
  }) => {
    const queryString = `
    SELECT series(eventTimestamp, "${getSeriesIntervalSize({
      name,
    })}"), avg(metrics.\`End User Response Time (ms)\`), count(*) FROM browser_records
    WHERE pagename = "${pageName}"
    ${addFilterClause({ practiceId })}
    ${addFilterClause({ stackId })}
    ${addFilterClause({ username })}
    ${appKeyFilter}
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
})(PageGraph)
