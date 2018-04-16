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
