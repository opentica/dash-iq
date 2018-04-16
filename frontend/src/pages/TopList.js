/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

import React, { Component } from 'react'
import SlowestPages from '../components/SlowestPages'
import TimeSelect from '../components/TimeSelect'
import timeRanges from '../timeRanges'

class TopList extends Component {
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
    return (
      <div>
        <div className="py-4 bg-light border-bottom">
          <div className="container">
            <div className="row">
              <div className="col-sm-6 offset-sm-6 col-md-4 offset-md-8">
                <h4>Time Range</h4>
                <TimeSelect
                  changeTime={this.changeTime}
                  selectedTime={this.state.timeAgo.name}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="container mt-3">
          <SlowestPages timeAgo={this.state.timeAgo} />
        </div>
      </div>
    )
  }
}

export default TopList
