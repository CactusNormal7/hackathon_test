import { useState } from 'react';
import io from 'socket.io-client'
import { useEffect } from 'react';

//        __                            
//  ____ |__| ____   ____   _____  ____ 
// /    \|  |/ ___\ / ___\_/ __ \_  __ \
// |   |  \  / /_/  > /_/  >  ___/|  | \/
// |___|  /__\___  /\___  / \___  >__|   
//     \/  /_____//_____/       \/      
 

// const socketio  = io.connect('http://localhost:3001');
const socketio  = io.connect('https://testsocket-4vkm.onrender.com/');

const Lobby = () => {


    const room = window.location.pathname.substring(1);
    socketio.emit("room_number", {room : room})

    const [allMsgTable, setAllMsgTable] = useState({})
    const [inputValue, setInputValue] = useState("")

    const sendMessage = () => {
        socketio.emit("send_message", { message: inputValue })
    }

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    useEffect(() => {
        socketio.on("receive_message", (data) => {
            let updatedvalue = { [data.sender]: data.data.message };
            setAllMsgTable(allMsgTable => ({ ...allMsgTable, ...updatedvalue }))
        })
        console.log(allMsgTable);

    }, [socketio, allMsgTable])

    return (
        <div>
            <input placeholder='salut' onChange={handleInputChange} value={inputValue}></input>
            <button onClick={sendMessage}>send</button>

            {Object.keys(allMsgTable).map((key, i) => {
                return (
                    <div key={i}>
                        <h2>{key} : {allMsgTable[key]}</h2>
                        <hr />
                    </div>
                );
            })}

        </div>
    );
}

export default Lobby;
