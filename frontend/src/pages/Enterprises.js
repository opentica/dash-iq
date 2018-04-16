import React, { Component } from 'react'
import enterprises from '../enterprises.json'
import EnterprisePractice from '../components/EnterprisePractice'
import TimeSelect from '../components/TimeSelect'
import timeRanges from '../timeRanges'

class Enterprises extends Component {
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
        <div className="container">
          <table className="table table-sm">
            <thead>
              <tr>
                <th scope="col">StackId</th>
                <th scope="col">PracticeId</th>
                <th scope="col">Practice Name</th>
                <th scope="col" className="text-right">
                  Response Time (ms)
                </th>
                <th scope="col" className="text-right">
                  # of Calls
                </th>
              </tr>
            </thead>
            <tbody>
              {practices.map(({ contextId, name, stackid }) => (
                <EnterprisePractice
                  key={contextId}
                  practiceId={contextId}
                  name={name}
                  stackId={stackid}
                  timeAgo={this.state.timeAgo}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Enterprises
