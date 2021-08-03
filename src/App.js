import React, { Component } from "react";
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Navigation from "./Component/Navigation/Navigation";
import Logo from "./Component/Logo/Logo";
import Rank from "./Component/Rank/Rank";
import './App.css';
import Particles from "react-particles-js";

const particleOptions = {
    particles: {
        number:{
            value: 30,
            density:{
                enable: true,
                value_area: 800
            }
        }
    }
}

class App extends Component {
  render() {
    return (
        <div className="App">
            <Particles className={'particles'}
                params={particleOptions}
            />
          <Navigation />
          <Logo />
          <Rank />
          <ImageLinkForm />
          {/*<FaceRecognition />*/}

        </div>
    );
  }
}

export default App;
