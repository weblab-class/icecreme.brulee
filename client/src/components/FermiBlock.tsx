import React, { Component, useState } from "react";
import "../utilities.css";
import Player from "../../../shared/Player";
import './Player.css';
import { Button, Icon } from 'semantic-ui-react';
import CircleButton from "./CircleButton";
import { post } from "../utilities";
import RangeSlider from 'react-bootstrap-range-slider';
import { RouteComponentProps } from "@reach/router";


//const ButtonExampleCircular = () => <Button circular icon='settings' />


interface Props {
    isAnsweringPlayer: boolean;
    isChosenPlayer: boolean;
}

interface State {
    value: number;
}

class FermiBlock extends Component<Props & RouteComponentProps, State> {
    constructor(props) {
        super(props);
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
            <div>
                <h2>Fermi's Question</h2> 
                {(this.props.isAnsweringPlayer || this.props.isChosenPlayer) ? (<>
                    <RangeSlider
                        value={0}
                        onChange={this.setValue}
                        min = {0}
                        max = {100}
                    />

                    <button onClick = {this.submitAnswer}>Submit</button>
                </>): ""}
            </div>
        )
    }
}

export default FermiBlock;