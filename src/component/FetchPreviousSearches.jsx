import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import BaseApi from '../utils/BaseAPI';

function FetchPreviousSearches({ onSelectSearch }) {
    // useState to store previous search data
    const [prevInputSearch, setPrevInputSearch] = useState([]);

    // useEffect hook to fetch previous searches when the component is mounted
    useEffect(() => {
        const fetchUserInputs = async () => {
            try {
                // retrieve JWT token from local storage and with the help of jwtDecode take out email
                const token = localStorage.getItem('token'); 
                if (token) {
                    const decoded = jwtDecode(token);
                    const decodedEmail = decoded.email;
                    axios.get(`${BaseApi}/getAllUserInput?email=${decodedEmail}`)
                        .then(res => setPrevInputSearch(res.data.filters || []))
                        .catch(err => {
                            console.log(err);
                        });
                } else {
                    console.log('No token found');
                }
            } catch (error) {
                console.error('Error fetching user inputs:', error);
            }
        };

        fetchUserInputs(); // call the function to fetch data when component is mounted
    }, []); // empty dependency array means the effect runs once on component mount


    const handleCardClick = (item) => {
        onSelectSearch(item); // call the parent function to handle the selected search
    };

    return (
        <>
        {/* display heading if there are previous searches */}
            {prevInputSearch.length > 0 && <h3>Previous Searches</h3>}

            {/* loop through the previous search data and display each search as a card */}
            {prevInputSearch.map((item, index) => {
                const locationText = item.address ? `Location: ${item.address}` : '';
                const bathroomText = item.bathrooms ? `Bathroom: ${item.bathrooms}` : '';
                const bedroomText = item.bedrooms ? `Bedroom: ${item.bedrooms}` : '';
                const minPriceText = item.minPrice || item.minPrice === 0 ? `Min Price: ${item.minPrice}` : '';
                const maxPriceText = item.maxPrice || item.maxPrice === 0 ? `Max Price: ${item.maxPrice}` : '';

                //combine all filter text that are not empty
                const filterText = [locationText, bathroomText, bedroomText, minPriceText, maxPriceText]
                    .filter(text => text)
                    .join(', ');

                return (
                    // display each previous search as a card, allowing it to be clicked to select
                    <Card key={index} className="mb-3" onClick={() => handleCardClick(item)} style={{cursor:"pointer"}} >
                        <Card.Body>
                            <Card.Text>
                                {filterText || 'No details available'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                );
            })}
        </>
    );
}

export default FetchPreviousSearches;
