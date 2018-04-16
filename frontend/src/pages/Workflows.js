import React, { Component } from 'react'
import './Workflows.css'
import workflows from '../workflows.json'
import WorkflowPage from '../components/WorkflowPage'
import TimeSelect from '../components/TimeSelect'
import UsernameFilter from '../components/UsernameFilter'
import timeRanges from '../timeRanges'
import queryString from 'query-string'

class Workflows extends Component {
  constructor(props) {
    super(props)
    const { name, timeMagnitude, timeUnits } = timeRanges[0]
    const parsedSearch = queryString.parse(this.props.location.search)
    this.state = {
      practiceId: parsedSearch.practiceId || '',
      stackId: parsedSearch.stackId || '',
      username: parsedSearch.username,
      timeAgo: { name, timeMagnitude, timeUnits },
    }
  }
  handleInputChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({ [name]: value })
  }
  handleUsernameChange = value => {
    this.setState({ username: value && value.value })
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
              <div className="col-sm-6 col-md-8">
                <h4>Filters</h4>
                <form className="form-inline my-1">
                  <div className="form-group mr-2">
                    <input
                      type="text"
                      className="form-control"
                      id="practiceInput"
                      name="practiceId"
                      placeholder="practiceId"
                      value={this.state.practiceId}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="form-group mr-2">
                    <input
                      type="text"
                      className="form-control"
                      id="stackInput"
                      name="stackId"
                      placeholder="stackId"
                      value={this.state.stackId}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <UsernameFilter
                    username={this.state.username}
                    onChange={this.handleUsernameChange}
                    practiceId={this.state.practiceId}
                    timeAgo={this.state.timeAgo}
                  />
                </form>
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
              <div className="workflow-pages">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th scope="col">Page Name</th>
                      {this.state.practiceId ||
                      this.state.stackId ||
                      this.state.username ? (
                        <th scope="col" className="text-right">
                          athenanet Average
                        </th>
                      ) : (
                        undefined
                      )}
                      <th scope="col" className="text-right">
                        Response Time (ms)
                      </th>
                      <th scope="col" className="text-right">
                        # of Calls
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.map(
                      ({
                        name,
                        addId = '',
                        responseTimeWarning,
                        responseTimeCritical,
                      }) => (
                        <WorkflowPage
                          pageName={name}
                          key={name}
                          addId={addId}
                          practiceId={this.state.practiceId}
                          stackId={this.state.stackId}
                          username={this.state.username}
                          responseTimeWarning={responseTimeWarning}
                          responseTimeCritical={responseTimeCritical}
                          timeAgo={this.state.timeAgo}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Workflows
