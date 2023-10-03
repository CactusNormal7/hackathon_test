import { useState } from 'react';
import io from 'socket.io-client'
import { useEffect } from 'react';

const socketio = io.connect('https://hack-socket-etst.vercel.app');

const Lobby = () => {

    const [inputValue, setInputValue] = useState("")

    const sendMessage = () => {
        socketio.emit("send_message", { message: inputValue })
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        socketio.on("receive_message", (data) => {
            alert(data.message)
        })
    }, [socketio])

    return (
        <div>
            <input placeholder='salut' onChange={handleInputChange} value={inputValue}></input>
            <button onClick={sendMessage}>send</button>
            <h1>{inputValue}</h1>
        </div>
    );
}

export default Lobby;
