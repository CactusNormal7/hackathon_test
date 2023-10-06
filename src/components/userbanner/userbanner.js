import React from "react";


const Userbanner = (props) => {

    return (
        <div>
            <div id="wrappercard">
                <p className="username">{props.username}</p>
                <p className="message">{props.message}</p>
            </div>
        </div>
    )
}

export default Userbanner;