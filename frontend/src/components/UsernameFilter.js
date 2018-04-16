/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

import React, { Component } from 'react'
import Select from 'react-select'
import { graphql } from 'react-apollo'
import appKeyFilter from '../appKeyFilter'
import analyticsQuery from '../analyticsQuery'
import _ from 'lodash'
import 'react-select/dist/react-select.css'

class UsernameFilter extends Component {
  render() {
    const usernamesRaw = _.get(this.props.data, 'analyticsQuery.results')
    const usernames = !!usernamesRaw
      ? _.uniqBy(
          usernamesRaw.map(({ results }) => {
            const result = results[0]
            return { label: result, value: result }
          }),
          ({ value }) => value
        )
      : null

    const options = this.props.practiceId
      ? [
          { label: this.props.username, value: this.props.username },
          ...(usernames ? usernames : []),
        ]
      : []

    return (
      <div className="form-group">
        <Select.Creatable
          name="username"
          value={this.props.username}
          onChange={this.props.onChange}
          placeholder="username"
          options={options}
          className="username-select"
          clearable
        />
      </div>
    )
  }
}

export default graphql(analyticsQuery, {
  options: ({ practiceId, timeAgo: { name, timeMagnitude, timeUnits } }) => {
    if (!practiceId) {
      return {}
    }
    const queryString = `
    SELECT distinct userdata.username
    FROM browser_records
    WHERE userdata.practiceId = "${practiceId}"
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
})(UsernameFilter)
