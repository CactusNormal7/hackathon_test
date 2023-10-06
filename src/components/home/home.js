import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

    const [room, setRoom] = useState("")
    const [username, setUsername] = useState("")


    const roomInputChange = (event) => {
        setRoom(event.target.value);
    };
    const usernameInputChange = (event) => {
        setUsername(event.target.value);
    };

    return (
        <div>
            <div id='wrapperall'>
                <form id="userForm">
                    <input placeholder='username' onChange={usernameInputChange}></input>
                    <input placeholder='room' onChange={roomInputChange}></input>
                    <Link to={`./lobby?username=${username}&room=${room}`}>
                        <button>join</button>
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Home;