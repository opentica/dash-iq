/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

import React, { Component } from 'react'
import workflows from '../workflows.json'
import TimeSelect from '../components/TimeSelect'
import timeRanges from '../timeRanges'
import enterprises from '../enterprises.json'
import _ from 'lodash'
import EnterpriseSummaryComponent from '../components/EnterpriseSummaryComponent'

class EnterprisesSummary extends Component {
  constructor(props) {
    super(props)
    const { name, timeMagnitude, timeUnits } = timeRanges[0]
    this.state = {
      timeAgo: { name, timeMagnitude, timeUnits },
    }
  }
  changeTime = ({ timeAgo }) => {
    this.setState({ timeAgo })
  }
  render() {
    const allPracticeIds = _.flattenDeep(
      enterprises.map(({ contexts }) =>
        contexts.map(({ contextId }) => contextId)
      )
    )
    const allPages = _.flattenDeep(
      workflows.map(({ pages }) => pages.map(({ name }) => name))
    )

    return (
      <div>
        <div className="py-4 bg-light border-bottom">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-md-8">
                <h4>Enterprises Summary</h4>
              </div>
              <div className="col-sm-6 col-md-4">
                <h4>Time Range</h4>
                <TimeSelect
                  changeTime={this.changeTime}
                  selectedTime={this.state.timeAgo.name}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container workflows mt-3">
          <EnterpriseSummaryComponent
            allPracticeIds={allPracticeIds}
            allPages={allPages}
            timeAgo={this.state.timeAgo}
          />
        </div>
      </div>
    )
  }
}

export default EnterprisesSummary
