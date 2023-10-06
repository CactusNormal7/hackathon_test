import { useEffect, useState } from 'react';
import io from 'socket.io-client'
import { useLocation } from 'react-router-dom'
import Userbanner from '../userbanner/userbanner'
import Chatmsg from '../chatMessage/chatmsg'
import Ytbplayer from '../ytbplayer/ytbplayer';
import YouTube from 'react-youtube';

//feat quentin le ↓
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
    const [songsToGuess, setSongsToGuess] = useState([])
    const [actualSong, setActualSong] = useState([])

    const [allUsers, setAllUsers] = useState([])

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const room = searchParams.get('room')
    const username = searchParams.get('username')

    const onStart = () => {
        socketio.emit("on_start")
    }


    const gameLoop = (data) => {
        setSongsToGuess(data)
        console.log(data);
        let i = 0
        while (i !== 5) {
            setTimeout(() => {
                // console.log(data);
                // let url = ((data[0].track).split('?')[1]).split("&");
                // let videoId = null
                // url.forEach(parametre => {
                //     const [cle, valeur] = parametre.split('=');
                //     if (cle === "v") {
                //         videoId = valeur;
                //         return;
                //     }
                // });
                // document.getElementById('testtrack').innerText = `${videoId} + ${i}`
                console.log("test");
                i++
            }, 1000);
        }
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
            setIsGameStarted(true)
            gameLoop(data);
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
                        <h1 id='testtrack'>

                        </h1>
                        {/* <iframe
                            width={300}
                            height={300}
                            src={`https://www.youtube.com/embed/nwKDhfAnu2M?start=10&end=30&autoplay=1`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        ></iframe> */}
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
