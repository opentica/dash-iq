import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class Home extends Component {
  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <h1 className="display-4">AppD Analytics, visualized</h1>
          <p className="lead">
            This is a set of custom visualizations using AppDynamics performance
            data
          </p>
          <hr className="my-4" />
          <p>
            Check out the first visualization, or go to the main{' '}
            <a href={process.env.REACT_APP_CONTROLLER_URL}>AppDynamics</a>{' '}
            interface
          </p>
          <p className="lead">
            <Link
              className="btn btn-primary btn-lg"
              to="/workflows"
              role="button"
            >
              View Workflows Visualization
            </Link>
          </p>
        </div>
      </div>
    )
  }
}

export default Home
