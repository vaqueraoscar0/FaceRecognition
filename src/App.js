import React, { Component } from "react";
import ImageLinkForm from './Component/ImageLinkForm/ImageLinkForm';
import Navigation from "./Component/Navigation/Navigation";
import Logo from "./Component/Logo/Logo";
import Rank from "./Component/Rank/Rank";
import Clarifai from 'clarifai';
import './App.css';
import Particles from "react-particles-js";
import FaceRecognition from "./Component/FaceRecognition/FaceRecognition";
import SignIn from "./Component/SignIn/SignIn";
import Register from "./Component/Register/Register";

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
            box: {},
            route: 'signin',
            isSignedIn: false,
            user: {
                id: '',
                password: '',
                email: '',
                name: '',
                entries: 0,
                joined: ''
            }
        }
    }

    loadUser = (data) =>{
        this.setState({user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
        }})
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
        this.setState({box: box});
    }

   onInputChange = (event) =>{
        this.setState({input: event.target.value});
    }

    onButtonSubmit = () => {
        this.setState({imageURL: this.state.input});
        app.models
            .predict(
                // HEADS UP! Sometimes the Clarifai Models can be down or not working as they are constantly getting updated.
                // A good way to check if the model you are using is up, is to check them on the clarifai website. For example,
                // for the Face Detect Mode: https://www.clarifai.com/models/face-detection
                // If that isn't working, then that means you will have to wait until their servers are back up. Another solution
                // is to use a different version of their model that works like: `c0c0ac362b03416da06ab3fa36fb58e3`
                // so you would change from:
                // .predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
                // to:
                // .predict('c0c0ac362b03416da06ab3fa36fb58e3', this.state.input)
                Clarifai.FACE_DETECT_MODEL,
                this.state.input)
            .then(response => {
                console.log('hi', response)
                if (response) {
                    fetch('http://localhost:3000/image', {
                        method: 'put',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({
                            id: this.state.user.id
                        })
                    })
                        .then(response => response.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, { entries: count}))
                        })

                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err));
    }

    onRouteChange = (route) =>{
        if(route === 'signout'){
            this.setState({isSignedIn: false})
        }else if(route === 'home'){
            this.setState({isSignedIn: true})
        }

        this.setState({route: route});
    }


  render() {
      const { isSignedIn, route, imageURL, box} = this.state;

    return (
        <div className="App">
            <Particles className={'particles'}
                params={particleOptions}
            />
            <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
            {   route === 'home'
                ?<div>
                    <Logo/>
                    <Rank
                        name={this.state.user.name}
                        entries={this.state.user.entries}/>
                    <ImageLinkForm
                        onInputChange={this.onInputChange}
                        onButtonSubmit={this.onButtonSubmit}/>
                    <FaceRecognition box={box} imageURL={imageURL}/>
                </div>
                :(
                    route === 'signin'
                    ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                    :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
                )
            }
        </div>
    );
  }
}

export default App;
