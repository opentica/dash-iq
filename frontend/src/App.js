import React, { Component } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Navbar from './components/Navbar'
import Workflows from './pages/Workflows'
import Home from './pages/Home'
import TopList from './pages/TopList'
import Enterprises from './pages/Enterprises'
import EnterprisesSummary from './pages/EnterprisesSummary'
import PagesByPractice from './pages/PagesByPractice'
import EnterpriseIP from './pages/EnterpriseIP'
import './bootstrap/bootstrap.css'
import 'popper.js'
import 'bootstrap'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { practiceId: '', stackId: '', username: '' }
  }
  handleInputChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({ [name]: value })
  }
  render() {
    return (
      <Router>
        <div>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/top-list" component={TopList} />
            <Route path="/workflows" component={Workflows} />
            <Route path="/enterprises" component={Enterprises} />
            <Route path="/enterprises-summary" component={EnterprisesSummary} />
            <Route path="/enterprise-pages" component={PagesByPractice} />
            <Route path="/enterprise-ips" component={EnterpriseIP} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default App
