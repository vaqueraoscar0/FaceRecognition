import React from "react";
import Tilt from 'react-tilt';
import FR from './FR.png';
import './Logo.css';

const Logo = () => {
    return(
        <div className={'ma6 mt0 center'}>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 140, width: 140 }} >
                <div className="Tilt-inner pa3"><img style={{paddingTop: '5px'}} alt={'logo'} src={FR}/></div>
            </Tilt>
        </div>
    )
}

export default Logo;