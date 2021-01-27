import React, { Component, useState } from "react";
import "../utilities.css";
import Player from "../../../shared/Player";
import './Player.css';
import { Button, Icon } from 'semantic-ui-react';
import CircleButton from "./CircleButton";
import { post } from "../utilities";
import RangeSlider from 'react-bootstrap-range-slider';
import { RouteComponentProps } from "@reach/router";
import "./FermiBlock.css";


//const ButtonExampleCircular = () => <Button circular icon='settings' />


interface Props {
    isAnsweringPlayer: boolean;
    isChosenPlayer: boolean;
    question?: String;
    answer?: number;
}

interface State {
    value: number;
    min: number;
    max: number;
}

class FermiBlock extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
            min: 0,
            max: (1.5+Math.random())*this.props.answer, //can change the way this is calculated
        }
    }
    //state
    setValue = (event) => {
        this.setState({value: event.target.value})
    }

    submitAnswer = () => {
        const fermiAns = {fermiAns: this.state.value};
        post('/api/fermi', fermiAns)
    }

    // handleClick = (choice) => {
    //     //const rps = {rpsChoice: this.props.text};
    //     post('/api/rps', choice)
    // }


    render() {

        return (
            <div className = "fermiContainer">
                <h3>Fermi's Questions</h3> 
                <p>insert question here</p>
                {(this.props.isAnsweringPlayer || this.props.isChosenPlayer) ? (<>
                    <RangeSlider
                        value={this.state.value || this.state.max/2}
                        onChange={this.setValue}
                        min = {0}
                        max = {this.state.max}
                        tooltip = {'on'}
                        variant = 'dark'
                        disable = {false}
                        size = 'lg'
                    />

                    <button onClick = {this.submitAnswer}>Submit</button>
                </>): ""}
            </div>
        )
    }
}

export default FermiBlock;