import React from "react";
import './styles.css';

const Places = ({ data }) => {
    return (
        <div className="meal-card">
            <div className="meal-name">
            <h2>{data.name}</h2>
            </div>
            <div className="meal-details">
                        <p>{data.description}</p>
              
            </div>
        </div>
    );
};

export default Places;
