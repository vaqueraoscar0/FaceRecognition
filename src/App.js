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
            imageURL: '',
            box: {}
        }
    }

    calculateFaceLocation = (data) =>{
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) =>{
        console.log(box)
        this.setState({box: box});
    }

   onInputChange = (event) =>{
        this.setState({input: event.target.value});
    }

    onButtonSubmit =() =>{
        this.setState({imageURL: this.state.input})
        app.models.predict( Clarifai.FACE_DETECT_MODEL, this.state.input)
            .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
            .catch(err => console.log(err));
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
          <FaceRecognition box={this.state.box} imageURL={this.state.imageURL}/>

        </div>
    );
  }
}

export default App;
