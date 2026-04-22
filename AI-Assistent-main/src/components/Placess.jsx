import React, { useState, useEffect } from "react";
import './styles.css'; 
import { FaSearch } from "react-icons/fa";
import MedicineItem from "./Places";

const   Placess = () => {
    const [naturalMedicines, setNaturalMedicines] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/natural-medicines')
            .then(response => response.json())
            .then(data => setNaturalMedicines(data))
            .catch(err => console.error('Error fetching data:', err));
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    const filteredMedicines = naturalMedicines.filter(medicine =>
        medicine.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="main">
                <div className="heading">
                    <h1>Search Spots</h1>
                </div>
                <div className="searchBox">
                <FaSearch className="search-icon" />
                    <input type="search" className="search-bar" value={searchQuery} onChange={handleSearchChange} placeholder="Search natural medicines" />
                </div>
                <div className="meal-container">
                    {filteredMedicines.map(medicine => (
                        <MedicineItem key={medicine.id} data={medicine} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Placess;
