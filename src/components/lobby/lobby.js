import { useState } from 'react';
import io from 'socket.io-client'

const socketio = io.connect('http://localhost:3001');

const Lobby = () => {

    const [inputValue, setInputValue] = useState("")

    const sendMessage = () => {
        socketio.emit("send_message", {message : inputValue })
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
      };

    return (
        <div>
            <input placeholder='salut' onChange={handleInputChange} value={inputValue}></input>
            <button onClick={sendMessage}>send</button>
        </div>
    );
}

export default Lobby;
