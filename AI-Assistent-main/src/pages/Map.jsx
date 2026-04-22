import React from 'react';
import './style.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


const Map = () => {

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    paddingTop:'50px',
};

const imageStyle = {
    width: '500px',
    height: '500px',
    objectFit: 'cover', // Ensures the image maintains its aspect ratio
};
    return (
        <section className="container section section__height" id="about"> 
        <div style={containerStyle}>
        <img 
            src="https://www.chennaimuseum.org/draft/siteplan/images/fronblgr.gif" 
            alt="Centered Museum Image" 
            style={imageStyle} 
        />
    </div>
   

        </section>
    );
} 

export default Map;


