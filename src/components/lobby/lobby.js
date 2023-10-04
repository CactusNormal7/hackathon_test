import { useState } from 'react';
import io from 'socket.io-client'
import { useEffect } from 'react';

//        __                            
//  ____ |__| ____   ____   _____  ____ 
// /    \|  |/ ___\ / ___\_/ __ \_  __ \
// |   |  \  / /_/  > /_/  >  ___/|  | \/
// |___|  /__\___  /\___  / \___  >__|   
//     \/  /_____//_____/       \/      


const socketio = io.connect('http://localhost:3001');
// const socketio  = io.connect('https://testsocket-4vkm.onrender.com');



const Lobby = () => {
    const [allMsgTable, setAllMsgTable] = useState({})
    const [inputValue, setInputValue] = useState("")
    const [username, setUsername] = useState("")
    const [users, setUsers] = useState([])


    useEffect(() => {
        let room = window.location.pathname.substring(1);
        socketio.emit("room_number", { room: room })
    }, [])


    const sendMessage = () => {
        socketio.emit("send_message", { message: inputValue, username: username })
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const joinTriggered = async (e) => {
        new Promise((resolve, reject) => {
            const username = prompt("username");
            if (username) {
                resolve(username);
            } else {
                reject(new Error("Username cannot be empty"));
            }
        })
            .then((username) => {
                setUsername(username);
                socketio.emit("joined_username", username);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        socketio.on('receive_message', (data) => {
            let updtval = { [data.username]: data.message }
            setAllMsgTable(allMsgTable => ({ ...allMsgTable, ...updtval }))
        })
        socketio.on('user_list', (user_list) => {
            setUsers(user_list)
            console.log(users);
        })
    }, [socketio])

    return (
        <div>
            <input placeholder='username' onChange={handleInputChange} value={inputValue}></input>
            <button onClick={sendMessage}>send</button>
            <button onClick={joinTriggered}>join</button>
            {users.map((item) => (
                <h1 key={item}>{item}</h1>
            ))}
            {Object.keys(allMsgTable).map((key) => (
                <h1 key={key}>{key} : {allMsgTable[key]}</h1>
            ))}
        </div>
    );
}

export default Lobby;
