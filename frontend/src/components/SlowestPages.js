import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import _ from 'lodash'
import appKeyFilter from '../appKeyFilter'
import analyticsQuery from '../analyticsQuery'

class WorkflowPage extends Component {
  render() {
    const allResults = _.get(this.props.data, 'analyticsQuery.results')

    if (this.props.data.loading) {
      return <div>Loading</div>
    }
    if (!allResults) {
      return <div>No data</div>
    }

    return (
      <div>
        <h2>Slowest Pages</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Page Name</th>
              <th scope="col" className="text-right">
                Response Time (ms)
              </th>
              <th scope="col" className="text-right">
                # of Calls
              </th>
            </tr>
          </thead>
          <tbody>
            {allResults.map(
              ({ results: [pageName, responseTime, numOfCalls] }) => (
                <tr>
                  <td>{pageName}</td>
                  <td className="text-right">
                    {parseInt(responseTime, 10)} ms
                  </td>
                  <td className="text-right">{numOfCalls}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    )
  }
}

export default graphql(analyticsQuery, {
  options: ({ timeAgo: { timeMagnitude, timeUnits } }) => {
    const queryString = `
    SELECT pagename, avg(metrics.\`End User Response Time (ms)\`) AS "Response Time", count(*)
    FROM browser_records
    WHERE pagetype = "IFRAME" ${appKeyFilter}
    ORDER BY \`Response Time\` DESC
    LIMIT 10
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
})(WorkflowPage)
