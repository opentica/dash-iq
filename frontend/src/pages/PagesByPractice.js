/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

import React, { Component } from 'react'
import workflows from '../workflows.json'
import WorkflowEnterprisePage from '../components/WorkflowEnterprisePage'
import TimeSelect from '../components/TimeSelect'
import timeRanges from '../timeRanges'
import enterprises from '../enterprises.json'

class PagesByPractice extends Component {
  constructor(props) {
    super(props)
    const { name, timeMagnitude, timeUnits } = timeRanges[0]
    this.state = {
      selectedEnterprise: '',
      timeAgo: { name, timeMagnitude, timeUnits },
    }
  }
  handleInputChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({ [name]: value })
  }
  changeTime = ({ timeAgo }) => {
    this.setState({ timeAgo })
  }
  render() {
    const practices = this.state.selectedEnterprise
      ? enterprises.find(({ name }) => name === this.state.selectedEnterprise)
          .contexts
      : enterprises[0].contexts

    // Sorting the dropdown option items
    const enterpriseList = enterprises.map(({ name }) => (
      <option key={name}>{name}</option>
    ))

    return (
      <div>
        <div className="py-4 bg-light border-bottom">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 col-md-8">
                <h4>Enterprises</h4>
                <div className="form-group">
                  <select
                    className="form-control col-sm-6 col-lg-4"
                    id="enterpriseSelect"
                    name="selectedEnterprise"
                    onChange={this.handleInputChange}
                    value={this.state.selectedEnterprise}
                  >
                    {enterpriseList}
                  </select>
                </div>
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
          {workflows.map(({ name, pages }) => (
            <div className="workflow mt-1" key={name}>
              <h3>{name}</h3>
              {pages.map(
                ({ name, responseTimeWarning, responseTimeCritical }) => (
                  <WorkflowEnterprisePage
                    pageName={name}
                    key={name}
                    practices={practices}
                    responseTimeWarning={responseTimeWarning}
                    responseTimeCritical={responseTimeCritical}
                    timeAgo={this.state.timeAgo}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default PagesByPractice
