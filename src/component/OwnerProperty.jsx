import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BaseApi from '../utils/BaseAPI';
import { Card, Col, Row, Form, Button, OverlayTrigger, Tooltip, Carousel, ListGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import FetchPreviousSearches from './FetchPreviousSearches';
function OwnerProperty() {
    // all initial useState for OwnerProperty
    const [ownerHouses, setOwnerHouses] = useState([]);
    const [show, hide] = useState(null);
    const [filters, setFilters] = useState({
        address: '',
        bedrooms: '',
        bathrooms: '',
        minPrice: '',
        maxPrice: ''
    });
    const [priorities, setPriorities] = useState({
        bedroomsPriority: '',
        bathroomsPriority: '',
        pricePriority: '',
    });
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [pastSearch, setPastSearch] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // Toast notifications for user actions
    const userLogin = () => toast.warning("Please login to save your searches");
    const allSearchSaved = () => toast.success("Search Saved");
    const zoom = 13; // Default zoom level for the map

    // Function to toggle map visibility for a specific property
    const viewOnMap = (mapId) => {
        hide(show === mapId ? null : mapId);
    };

    // Fetch owner's properties on component mount
    useEffect(() => {
        axios.get(`${BaseApi}/properties/usergetproperty`)
            .then((res) => {
                setOwnerHouses(res.data); // Set owner houses data in state
            })
            .catch((err) => {
                console.log(err); // Log any errors
            });
    }, []);

    // Apply filters whenever filters, priorities, or owner's houses change
    useEffect(() => {
        if (ownerHouses.length) {
            applyFilters(filters, priorities);
        }
    }, [filters, priorities, ownerHouses]);

    // Fetch user's past searches based on decoded token
    useEffect(() => {
        //decodeToken with the help of jwtDecode to take out email
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const decodedEmail = decoded.email;

            axios.get(`${BaseApi}/getUserSearch?email=${decodedEmail}`)
                .then(res => setPastSearch(res.data.searchData || []))
                .catch(err => console.error('Error fetching user search data:', err));
        }
    }, []);

    const applyFilters = (currentFilters, currentPriorities) => {
        let filtered = ownerHouses || [];
    
        // Deconstruct the filter and priority values
        const { address, bedrooms, bathrooms, minPrice, maxPrice } = currentFilters;
        const { bedroomsPriority, bathroomsPriority, pricePriority } = currentPriorities;
    
        // Filter by address
        if (address) {
            filtered = filtered.filter(property =>
                property.displayAddress?.toLowerCase().includes(address.toLowerCase())
            );
        }
    
        // Calculate scores for properties
        filtered = filtered.map((property) => {
            let score = 0;
    
            // Bedroom priority scoring
            if (bedroomsPriority > 0 && bedrooms) {
                const bedroomDifference = Math.abs(property.bedrooms - Number(bedrooms));
                score += bedroomsPriority / (1 + bedroomDifference); // Give a higher score for closer matches
            }
    
            // Bathroom priority scoring
            if (bathroomsPriority > 0 && bathrooms) {
                const bathroomDifference = Math.abs(property.bathrooms - Number(bathrooms));
                score += bathroomsPriority / (1 + bathroomDifference); // Higher score for closer matches
            }
    
            // Price priority scoring
            if (pricePriority > 0 && property.price && property.price.amount) {
                const priceA = property.price.amount;
                const inRange = priceA >= (Number(minPrice) || 0) && priceA <= (Number(maxPrice) || Infinity);
                score += inRange ? pricePriority : 0; // Only add price priority if the property is in range
            }
    
            return { ...property, score }; // Attach score to each property
        });
    
        // Sort properties based on their score
        filtered.sort((a, b) => b.score - a.score);
    
        // Update the filtered properties state
        setFilteredProperties(filtered);
    };
    
    const handleInputChange = (e, filterType) => {
        const value = e.target.value;

        // Update the filters state
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    // handle priority input changes
    const handlePriorityChange = (e, priorityType) => {
        const value = e.target.value;

        // update the priorities state
        setPriorities(prevPriorities => ({
            ...prevPriorities,
            [priorityType]: value
        }));
    };

    // handle search submission 
    const handleSearch = (e) => {
        e.preventDefault();
        // retrieve token from local storage and with the help of jwtDecode take out email
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const decodedEmail = decoded.email;
            localStorage.setItem('email', decodedEmail);

            if (!filters.address.trim()) {
                alert('Cannot search empty address');
                return;
            }

            const savingSearch = {
                email: decodedEmail,
                searchData: filters.address
            };

            axios.post(`${BaseApi}/saveSearch`, savingSearch)
                .then((res) => {
                    console.log('Search saved:', res);
                    allSearchSaved();// Notify user of successful save
                })
                .catch(err => {
                    console.error('Error saving search:', err);
                });
        } else {
            userLogin();
        }
    };

    // handle saving all filters and priorities
    const handleSaveAll = () => {
        const token = localStorage.getItem('token');

        if (token) {
            const decoded = jwtDecode(token);
            const decodedEmail = decoded.email;

            const savingData = {
                email: decodedEmail,
                filters: [{
                    address: filters.address,
                    bedrooms: filters.bedrooms,
                    bathrooms: filters.bathrooms,
                    minPrice: filters.minPrice,
                    maxPrice: filters.maxPrice
                }]
            };

            axios.post(`${BaseApi}/saveAllUserInputs`, savingData)
                .then((res) => {
                    console.log('All user inputs saved:', res);
                    allSearchSaved(); // Notify user of successful save
                })
                .catch(err => {
                    if (err.response.status === 404) {
                        alert('User not found. Please create an account to save your data.');
                    } else {
                        console.error('Error saving all user inputs:', err);
                    }
                });
        } else {
            userLogin();
        }
    };

    // handle focus on input fields
    const handleFocus = () => {
        setIsFocus(true);
        setShowTooltip(true);

        setTimeout(() => setShowTooltip(false), 5000); // hide tooltip after 5 seconds
    };

    // handle selecting a past search
    const handleSelectSearch = (item) => {
        setFilters({
            address: item.address || '',
            bedrooms: item.bedrooms.join(', ') || '',
            bathrooms: item.bathrooms.join(', ') || '',
            minPrice: item.minPrice || '',
            maxPrice: item.maxPrice || ''
        });
    };

    // const handleIncreaseMaxPrice = () => {
    //     setFilters(prevFilters => ({
    //         ...prevFilters,
    //         maxPrice: prevFilters.maxPrice ? (Number(prevFilters.maxPrice) * 1.1).toFixed(2) : ''
    //     }));
    // };

    // render tooltip for past searches
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {pastSearch.length > 0 ? (
                <ul>
                    {pastSearch.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
            ) : (
                <span>No previous searches</span>
            )}
        </Tooltip>
    );

    return (
        <Row>
            <Col sm={4}>
                <Form onSubmit={handleSearch}>
                    <Form.Group>
                        <Form.Label>Address</Form.Label>
                        <OverlayTrigger
                            placement="right"
                            overlay={renderTooltip}
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter address"
                                value={filters.address}
                                onChange={(e) => handleInputChange(e, 'address')}
                                onFocus={handleFocus}
                            />
                        </OverlayTrigger>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Bedrooms</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Max number of bedrooms"
                            value={filters.bedrooms}
                            onChange={(e) => handleInputChange(e, 'bedrooms')}
                        />
                        <Form.Label>Priority</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Priority"
                            value={priorities.bedroomsPriority}
                            onChange={(e) => handlePriorityChange(e, 'bedroomsPriority')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Bathrooms</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Max number of bathrooms"
                            value={filters.bathrooms}
                            onChange={(e) => handleInputChange(e, 'bathrooms')}
                        />
                        <Form.Label>Priority</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Priority"
                            value={priorities.bathroomsPriority}
                            onChange={(e) => handlePriorityChange(e, 'bathroomsPriority')}
                        />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Price</Form.Label>
                        <Row>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Min Price"
                                    value={filters.minPrice}
                                    onChange={(e) => handleInputChange(e, 'minPrice')}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="number"
                                    placeholder="Max Price"
                                    value={filters.maxPrice}
                                    onChange={(e) => handleInputChange(e, 'maxPrice')}
                                />
                            </Col>
                        </Row>
                        <Form.Label>Priority</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Priority"
                            value={priorities.pricePriority}
                            onChange={(e) => handlePriorityChange(e, 'pricePriority')}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary">Save Search</Button>
                    <Button variant="outline-primary" onClick={handleSaveAll}>Save All Filters</Button>
                    {/* <Button variant="outline-primary" onClick={sortPropertiesByPriority}>Sort Properties</Button> */}
                </Form>
                <FetchPreviousSearches
            pastSearch={pastSearch}
            onSelectSearch={handleSelectSearch}
          />
            </Col>
            <Col sm={8}>
                <Row>
                    {filteredProperties.length > 0 ? (
                        filteredProperties.map((item, index) => (
                            <Col key={index} sm={6}>
                                <Card>
                                    <Card.Body>
                                        {/* Property details */}
                                        <Carousel>
                                            {item.images.map((image, imgIndex) => (
                                                <Carousel.Item key={imgIndex}>
                                                    <img
                                                        className="d-block w-100"
                                                        src={image.srcUrl}
                                                        alt={`Property ${item.id} Image ${imgIndex}`}
                                                        width={'100%'}
                                                        height={'250px'}
                                                    />
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>Bathrooms: {item.bathrooms} and Bedrooms: {item.bedrooms}</ListGroup.Item>
                                            <ListGroup.Item>{item.premiumListing ? "Premium Listing" : "General Listing"}</ListGroup.Item>
                                            <ListGroup.Item>Address: {item.displayAddress}</ListGroup.Item>
                                            <ListGroup.Item>Price: {item.amount} £</ListGroup.Item>
                                            <ListGroup.Item>Summary: {item.summary}</ListGroup.Item>
                                        </ListGroup>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item onClick={() => viewOnMap(item.id)}>View On Map</ListGroup.Item>
                                        <ListGroup.Item>
                                            {show === item.id && (
                                                <iframe
                                                    width={'100%'}
                                                    height={'300'}
                                                    style={{ border: 'none' }}
                                                    src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=${zoom}&output=embed`}
                                                    title="google map"
                                                />
                                            )}
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                                <br />
                            </Col>
                        ))
                    ) : (
                        <Col>
                            <p>No properties found based on the current filters.</p>
                        </Col>
                    )}
                </Row>
            </Col>
            <ToastContainer />
        </Row>
    );
}

export default OwnerProperty;
