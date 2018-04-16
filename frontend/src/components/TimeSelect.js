/*
 * Copyright 2018. AppDynamics LLC and its affiliates.
 * All Rights Reserved.
 * This is unpublished proprietary source code of AppDynamics LLC and its affiliates.
 * The copyright notice above does not evidence any actual or intended publication of such source code.
 */

import React, { Component } from 'react'
import timeRanges from '../timeRanges'

class TimeSelect extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedTime: 'Last 15 min' }
  }
  handleInputChange = event => {
    const value = event.target.value
    const { timeMagnitude, timeUnits } = timeRanges.find(
      timeRange => timeRange.name === value
    )
    this.props.changeTime({ timeAgo: { timeMagnitude, timeUnits } })
  }
  render() {
    return (
      <select
        className="form-control"
        id="timeSelect"
        name="selectedTime"
        onChange={this.handleInputChange}
        value={this.props.selectedTime}
      >
        {timeRanges.map(({ name }) => <option key={name}>{name}</option>)}
      </select>
    )
  }
}

export default TimeSelect
