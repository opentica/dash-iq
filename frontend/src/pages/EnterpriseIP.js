import React, { Component } from 'react'
import EnterpriseIPPractices from '../components/EnterpriseIPPractices'
import TimeSelect from '../components/TimeSelect'
import timeRanges from '../timeRanges'
import enterprises from '../enterprises.json'

class EnterpriseIP extends Component {
  constructor(props) {
    super(props)
    const { name, timeMagnitude, timeUnits } = timeRanges[0]
    this.state = {
      selectedEnterprise: '',
      timeAgo: { name, timeMagnitude, timeUnits },
      showIP: true,
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
  switchQuery = () => {
    this.setState({ showIP: !this.state.showIP })
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
                  <button
                    className="btn btn-primary my-2"
                    onClick={this.switchQuery}
                  >
                    {this.state.showIP
                      ? 'Switch to Geocarrier'
                      : 'Switch to IP Address'}
                  </button>
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
          <EnterpriseIPPractices
            practices={practices}
            timeAgo={this.state.timeAgo}
            showIP={this.state.showIP}
          />
        </div>
      </div>
    )
  }
}

export default EnterpriseIP
