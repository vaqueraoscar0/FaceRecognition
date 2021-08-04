import React, { Component } from "react";
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Navigation from "./Component/Navigation/Navigation";
import Logo from "./Component/Logo/Logo";
import Rank from "./Component/Rank/Rank";
import Clarifai from 'clarifai';
import './App.css';
import Particles from "react-particles-js";
import FaceRecognition from "./Component/FaceRecognition/FaceRecognition";

const app = new Clarifai.App({
    apiKey: '0d63782af1044abf968675c7809a0285'
});

const particleOptions = {
    particles: {
        number:{
            value: 30,
            density:{
                enable: true,
                value_area: 200
            }
        }
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            input: '',
            imageURL: ''
        }
    }

   onInputChange = (event) =>{
        this.setState({input: event.target.value});
    }

    onButtonSubmit =() =>{
        this.setState({imageURL: this.state.input})
        app.models.predict( Clarifai.FACE_DETECT_MODEL, this.state.input).then(
            function (response){
                console.log(response.outputs[0].data.regions[0].region_info.bounding_box);
            },
            function(err){

            }
        );
    }

  render() {
    return (
        <div className="App">
            <Particles className={'particles'}
                params={particleOptions}
            />
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition imageURL={this.state.imageURL}/>

        </div>
    );
  }
}

export default App;
