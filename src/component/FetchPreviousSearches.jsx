import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap';
import BaseApi from '../utils/BaseAPI';

function FetchPreviousSearches() {
    const [prevInputSearch, setPrevInputSearch] = useState();

    useEffect(() => {
        const fetchUserInputs = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decoded = jwtDecode(token);
                    const decodedEmail = decoded.email;
                    axios.get(`${BaseApi}/getAllUserInput?email=${decodedEmail}`)
                        .then(res => {
                            setPrevInputSearch(res.data.filters)
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    console.log('No token found');
                }
            } catch (error) {
                console.error('Error fetching user inputs:', error);
            }
        };

        fetchUserInputs();
    }, []);
    return (
        <>
            {prevInputSearch && <h3>Previous Searches</h3>}
            {prevInputSearch && prevInputSearch.map((item, index) => {
                const locationText = item.address ? `Location: ${item.address}` : '';
                const bathroomText = item.bathrooms ? `Bathroom: ${item.bathrooms}` : '';
                const bedroomText = item.bedrooms ? `Bedroom: ${item.bedrooms}` : '';
                const minPriceText = item.minPrice || item.minPrice === 0 ? `Min Price: ${item.minPrice}` : '';
                const maxPriceText = item.maxPrice || item.maxPrice === 0 ? `Max Price: ${item.maxPrice}` : '';

                const filterText = [locationText, bathroomText, bedroomText, minPriceText, maxPriceText]
                    .filter(text => text)  // Remove empty strings
                    .join(', ');

                return (
                    <Card key={index} className="mb-3">
                        <Card.Body>
                            <Card.Text>
                                {filterText || 'No details available'}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                );
            })}
        </>
    )
}

export default FetchPreviousSearches