import { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import Userbanner from '../userbanner/userbanner'
import Chatmsg from '../chatMessage/chatmsg'
import Ytbplayer from '../ytbplayer/ytbplayer';
import YouTube from 'react-youtube';


//         __                            
//  ____ |__| ____   ____   _____  ____ 
// /    \|  |/ ___\ / ___\_/ __ \_  __ \
// |   |  \  / /_/  > /_/  >  ___/|  | \/
// |___|  /__\___  /\___  / \___  >__|   
//     \/  /_____//_____/       \/      


const socketio = io.connect('http://localhost:3001');
// const socketio  = io.connect('https://testsocket-4vkm.onrender.com');



const Lobby = () => {
    const [allMsgTable, setAllMsgTable] = useState({})
    const [messageInputValue, setMessageInputValue] = useState("")
    const [chatInputValue, setChatInputValue] = useState("")
    const [chatMessages, setChatMessages] = useState([])
    const [isGameStarted, setIsGameStarted] = useState(false)
    const [songsToGuess, setSongsToGuess] = useState(false)

    const [allUsers, setAllUsers] = useState([])

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const room = searchParams.get('room')
    const username = searchParams.get('username')

    const onStart = () => {
        socketio.emit("on_start")
    }

    useEffect(() => {
        socketio.emit("join_room", { username: username, room: room })

        socketio.on('console_message', (message) => {
            console.log(message);
        })

        socketio.on('users_infos', (data) => {
            setAllUsers(data.users)
        })

        socketio.on('game_started', (data) => {
            console.log(data);
            setIsGameStarted(true)
            setSongsToGuess(data)
        })

        socketio.on('chat_message_received', async (data) => {
            setChatMessages(old => ([old, <Chatmsg username={data.user} message={data.message} />]));
        })

        socketio.on('answer_message_received', (data) => {
            let updval = { [data.username]: data.message }
            setAllMsgTable(allMsgTable => ({ ...allMsgTable, ...updval }))
        })
    }, [])

    const sendMessage = (e) => {
        socketio.emit('chat_message', { username: username, message: chatInputValue })
    }

    const sendAnswer = () => {
        socketio.emit('answer_message', { message: messageInputValue })
    }

    const handleInputChange = (event) => {
        setMessageInputValue(event.target.value);
    };

    const handleChatChange = (event) => {
        setChatInputValue(event.target.value);
    }

    return (
        <div>
            <div id='wrapperall'>
                <div id='leftside'></div>
                <div id='middleside'>
                    <div id='midtopside'>
                        <div>
                            <h1>Quel est le titre de cette oeuvre ?</h1>
                        </div>
                    </div>
                    <div id='midmidside'>
                        <button onClick={onStart}>START</button>
                        
                        <YouTube videoId='https://www.youtube.com/watch?v=6WrVXWgn094'></YouTube>
                    </div>
                    <div id='midbotside'>
                        <input id='messageinput' placeholder='message' onChange={handleInputChange} value={messageInputValue}></input>
                        <button id='sendButton' onClick={sendAnswer}>send</button>
                    </div>
                </div>
                <div id='rightside'>
                    <div id='userlistpart'>
                        <p id='userlisttittle'>Connected Users</p>
                        {
                            allUsers.map(function (values) {
                                return (
                                    <Userbanner username={values.username} message={allMsgTable[values.username]} />
                                )
                            })
                        }
                    </div>
                    <div id='chatpart'>
                        {chatMessages}
                        <input value={chatInputValue} onChange={handleChatChange} placeholder='send a message'></input>
                        <button onClick={sendMessage}>send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lobby;
