import { useEffect, useState } from 'react';
import io from 'socket.io-client'

//        __                            
//  ____ |__| ____   ____   _____  ____ 
// /    \|  |/ ___\ / ___\_/ __ \_  __ \
// |   |  \  / /_/  > /_/  >  ___/|  | \/
// |___|  /__\___  /\___  / \___  >__|   
//     \/  /_____//_____/       \/      


const socketio = io.connect('http://localhost:3001');
// const socketio  = io.connect('https://testsocket-4vkm.onrender.com');



const Lobby = () => {
    // const [allMsgTable, setAllMsgTable] = useState({})
    const [messageInputValue, setMessageInputValue] = useState("")
    const [roomInput, setRoomInput] = useState("")


    useEffect(() => {
        socketio.on('console_message', (message) => {
            console.log(message);
        })
        socketio.on('chat_message_received', (data) => {
            console.log(`${data.username} : ${data.message}`);
        })
    }, [])

    const sendMessage = () => {
        socketio.emit('chat_message', {message : messageInputValue, username : 'user'})
    }

    const handleInputChange = (event) => {
        setMessageInputValue(event.target.value);
    };

    const joinTriggered = (e) => {
    }

    return (
        <div>
            <input placeholder='username'></input>
            <input placeholder='room' onChange={(e) => { setRoomInput(e.target.value) }}></input>
            <input placeholder='message' onChange={handleInputChange} value={messageInputValue}></input>
            <button onClick={sendMessage}>send</button>
            <button onClick={joinTriggered}>join</button>
            {/* {users.map((item) => (
                <h1 key={item}>{item}</h1>
            ))}
            {Object.keys(allMsgTable).map((key) => (
                <h1 key={key}>{key} : {allMsgTable[key]}</h1>
            ))} */}
        </div>
    );
}

export default Lobby;
