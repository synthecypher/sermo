import './Chat.scss'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { inputChanged, clearInput } from '../actions/form'
import { MessageForm } from '../components/MessageForm'
import { MessageList } from '../components/MessageList'
import { sendCommand, receiveCommand } from '../actions/commands'
import { sendMessage, receiveMessage } from '../actions/messages'
import io from 'socket.io-client'
import React from 'react'

class Chat extends React.Component {
  constructor (props) {
    super(props)
    this.socket = io('http://localhost:3001')
    this.props.receiveMessage(this.socket)
    this.props.receiveCommand(this.socket)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  render () {
    return (
      <section className='Chat'>
        <MessageList messages={this.props.messages} />
        <MessageForm input={this.props.form.input} onChange={this.handleChange} onSubmit={this.handleSubmit} />
      </section>
    )
  }
  handleChange (event) {
    this.props.inputChanged(event.target.value)
  }
  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()
    if (this.props.form.input[0] === '/') {
      let args = this.props.form.input.slice(1).split(' ')
      let command = args.shift()
      this.props.sendCommand(this.socket, command, args)
    } else {
      this.props.sendMessage(this.socket, this.props.form.input)
    }
    this.props.clearInput()
  }
}

const mapStateToProps = state => {
  document.title = state.commands.nicks.them
  return {
    form: state.form,
    messages: state.messages
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      clearInput,
      inputChanged,
      receiveCommand,
      receiveMessage,
      sendCommand,
      sendMessage
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Chat)
