import React from "react";

function ScoreBoard(props) {
    return (
        <div className="scoreBoard">
            <div className="player1Score">
                {props.player1Score}
            </div>
            <div className="player2Score">
                {props.player2Score}
            </div>
        </div>
    );
}

export default ScoreBoard;