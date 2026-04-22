import React, { useEffect } from "react";
import { preLoaderAnim } from "../animations";
import './Preloader.css';

const PreLoader = () => {
  useEffect(() => {
    preLoaderAnim();
  }, []);
  return (
    <div className="preloader">
        <img src="https://static.vecteezy.com/system/resources/previews/024/238/439/non_2x/futuristic-wonders-discover-the-world-of-ai-generated-small-robots-free-png.png" width="150px" height="150px" />
      <div className="texts-container">
        <span>WELLCOME</span>
        <span>I AM,</span>
        <span>TOURIST GIUDE.</span>
      </div>
    </div>
  );
};

export default PreLoader;