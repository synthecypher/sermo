import { sendMessage, removeLastMessage } from './messages'
import { setNickname } from './nicknames'

export const SENT_COMMAND = 'SENT_COMMAND'
export const RECEIVED_COMMAND = 'RECEIVED_COMMAND'
export const COMMAND_NICK = 'nick'
export const COMMAND_THINK = 'think'
export const COMMAND_OOPS = 'oops'

export const sendCommand = (socket, command, args) => {
  return dispatch => {
    dispatch({
      type: SENT_COMMAND,
      command,
      args
    })
    socket.emit('command', {
      command,
      args
    })
    switch (command) {
      case COMMAND_THINK:
        sendMessage(socket, args.join(' '), { think: true })(dispatch)
        break
      case COMMAND_OOPS:
        removeLastMessage()(dispatch)
        break
      case COMMAND_NICK:
        setNickname('me', args.join(' '))(dispatch)
        break
      default:
        window.alert(`Command '${command}' not implemented.`)
        break
    }
  }
}

export const receiveCommand = socket => {
  return dispatch => {
    socket.on('command', data => {
      let { command, args } = data
      dispatch({
        ...data,
        type: RECEIVED_COMMAND
      })
      switch (command) {
        case COMMAND_OOPS:
          removeLastMessage({them: true})(dispatch)
          break
        case COMMAND_NICK:
          setNickname('them', args.join(' '))(dispatch)
          break
        case COMMAND_THINK:
          // Handled by messages.
          break
        default:
          window.alert(`Command '${command}' not implemented.`)
          break
      }
    })
  }
}
