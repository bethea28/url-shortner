import React from 'react'
import fetch from 'isomorphic-fetch'
import axios from 'axios'
import './app.scss'

class App extends React.Component {
  state = {
    inputValue: '',
    shortUrl: '',
    baseUrl: 'localhost:4000',
  }
  handleChange = (event) => {
    let word = event.target.value
    this.setState({ inputValue: word })
  }
  handleClick = (event) => {
    const { baseUrl, inputValue } = this.state

    let longUrl = inputValue
    let fullUrl = baseUrl + longUrl
    let shortUrl = fullUrl.split('.')[1]
    // let shortUrl = Math.floor(Math.random() * (999 - 100 + 1) + 100)
    axios.post('/', {
      longUrl: inputValue,
      shortUrl: baseUrl + '/' + shortUrl,
    })

    this.setState({ inputValue: '', shortUrl: baseUrl + '/' + shortUrl })
  }
  render() {
    const { shortUrl, longUrl, inputValue } = this.state
    return (
      <div className='app-component'>
        <div className='app-component__container'>
          <p>URL TO BE SHORTENED</p>
          <input
            className='app-component__input'
            onChange={this.handleChange}
            value={this.state.inputValue}
            placeholder='e.x. www.google.com'
          />
          <button className='app-component__button' onClick={this.handleClick}>
            POST URL
          </button>
        </div>
        <h1 className='app-component__short-url'>{shortUrl}</h1>
        {/* <a href={inputValue}>test</a> */}
      </div>
    )
  }
}
export default App
