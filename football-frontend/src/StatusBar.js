import React, { useState, useCallback } from "react";
import axios from 'axios';
import NetworkClient from './NetworkClient';

function StatusBar(props) {
    const [isSending, setIsSending] = useState(false)
    const sendRequest = useCallback(async () => {
        if (isSending) return
        setIsSending(true)
        await axios.post(NetworkClient.getApiUrl('reset'));
        setIsSending(false)
        props.resetCallback();
      }, [isSending])

    return (
        <div className="statusBar">
            <div className="statusMessage">
                {props.message}
            </div>
            <div className="statusActions">
                <button disabled={isSending} onClick={sendRequest} data-testid="resetButton">Reset</button>
            </div>
        </div>
    );
}

export default StatusBar;