import React, { useState, useEffect } from "react";
import './style.css';
import Chatbox from './Chatbox';
import Medicines from '../components/Placess.jsx';

const Home = () => {
    const images = [
        "https://c8.alamy.com/comp/FFYW3J/museum-theatre-pantheon-complex-madras-chennai-tamil-nadu-india-FFYW3J.jpg",
        "https://images.news18.com/ibnlive/uploads/2021/08/1628180747_chennai-dinosaur-museum-163255231416x9.png",
        "https://sjoneall.net/big-galleries/india-2008-big/chennai_govt_museum/slides/in08_020912430_j.jpg",
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        const index = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(index);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 2000); // Change slide every 2 seconds

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [currentIndex]);

    return (
        <section id="home" className="container">
            <div style={sliderBlockStyles}>
                <div style={sliderContainerStyles}>
                    <div style={imageContainerStyles}>
                        <img
                            src={images[currentIndex]}
                            alt={`slide-${currentIndex}`}
                            style={imageStyles}
                        />
                        <div style={overlayStyles}>
                            <h1 style={headingStyles}>WE WILL EXPLORE THE HISTORY</h1>
                            <h1 style={headingStyles}>CHENNAI CENTRAL MUSEUM</h1>
                        </div>
                    </div>
                    <div style={dotsContainerStyles}>
                        {images.map((_, index) => (
                            <span
                                key={index}
                                onClick={() => goToSlide(index)}
                                style={{
                                    ...dotStyles,
                                    backgroundColor: currentIndex === index ? "#333" : "#bbb",
                                }}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>

            <div style={searchBlockStyles}>
                <Medicines />
            </div>

            <div style={chatboxContainerStyles}>
                <Chatbox />
            </div>
        </section>
    );
};

const sliderBlockStyles = {
    position: "relative",
    width: "100%",
    height: "100vh", // Full viewport height
    overflow: "hidden",
    textAlign: "center",
};

const overlayStyles = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Transparent black overlay
    color: "#fff", // White text
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    zIndex: 1,
};

const headingStyles = {
    marginBottom: "20px",
    fontSize: "2rem",
};

const sliderContainerStyles = {
    position: "relative",
    zIndex: 0,
    width: "100%",
    height: "100%",
};

const imageContainerStyles = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
};

const imageStyles = {
    width: "100%",
    height: "auto",
    maxHeight: "100%",
    objectFit: "cover",
};

const dotsContainerStyles = {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    justifyContent: "center",
    width: "100%",
};

const dotStyles = {
    height: "10px",
    width: "10px",
    margin: "0 5px",
    cursor: "pointer",
    borderRadius: "50%",
    display: "inline-block",
    transition: "background-color 0.3s ease",
};

const searchBlockStyles = {
    padding: "20px",
    backgroundColor: "#f8f8f8",
};

const chatboxContainerStyles = {
    marginTop: "20px",
};

export default Home;
