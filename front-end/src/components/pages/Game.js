import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './game.css';

class Game extends Component{
    constructor(){
        super()
        this.state = {

        }
    }

    render(){
        return(
            <div className="game-container">
                <div className="row">
                    <div className="col s12 m4">
                        <img src="http://via.placeholder.com/250" alt="" className="game-pic" />
                    </div>
                    <div className="col s12 m8">
                        <div className="row">
                            <h3 className="game-title">GAME TITLE</h3>
                            <div className="game-desc">
                                <p>Paragraph 1</p>
                                <p>Paragraph 2</p>
                                <p>Paragraph 3</p>
                                <p>Paragraph 4</p>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col s1">
                                <span>Qty:</span>
                            </div>
                            <div className="col s8">
                                <input type="text" name="quantity"/>
                            </div>
                            <div className="col s2">
                                <button>ADD</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Game;