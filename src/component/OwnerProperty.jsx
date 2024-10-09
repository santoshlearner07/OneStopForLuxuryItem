import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BaseApi from '../utils/BaseAPI';
import { Card, Col, Row, Form, Button, OverlayTrigger, Tooltip, Carousel, ListGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import FetchPreviousSearches from './FetchPreviousSearches';

function OwnerProperty() {
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
    const [filteredProperties, setFilteredProperties] = useState(ownerHouses || []);
    const [pastSearch, setPastSearch] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    // New state for the listing type filter
    const [listingType, setListingType] = useState('');

    // Toast notifications
    const userLogin = () => toast.warning("Please login to save your searches");
    const allSearchSaved = () => toast.success("Search Saved");

    const zoom = 13;

    const viewOnMap = (mapId) => {
        hide(show === mapId ? null : mapId);
    };

    useEffect(() => {
        axios.get(`${BaseApi}/properties/usergetproperty`)
            .then((res) => {
                setOwnerHouses(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (ownerHouses.length) {
            applyFilters(filters, priorities, listingType);
        }
    }, [filters, priorities, ownerHouses, listingType]);
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

    const applyFilters = (currentFilters, currentPriorities, currentListingType) => {
        let filtered = ownerHouses || [];
        const { address, bedrooms, bathrooms, minPrice, maxPrice } = currentFilters;
        const { bedroomsPriority, bathroomsPriority, pricePriority } = currentPriorities;

        // Address filter (if provided)
        if (address) {
            filtered = filtered.filter(property =>
                property.displayAddress?.toLowerCase().includes(address.toLowerCase())
            );
        }

        const priorityLevels = ['1', '2', '3'];
        let matchedProperties = [];

        // Apply filters based on priorities
        for (const priority of priorityLevels) {
            let tempFiltered = [...filtered];

            // Check bedrooms based on current priority
            if (bedrooms && bedroomsPriority === priority) {
                tempFiltered = tempFiltered.filter(property => property.bedrooms === Number(bedrooms));
            }

            // Check bathrooms based on current priority
            if (bathrooms && bathroomsPriority === priority) {
                tempFiltered = tempFiltered.filter(property => property.bathrooms === Number(bathrooms));
            }

            // Check price based on current priority
            if (pricePriority === priority) {
                tempFiltered = tempFiltered.filter(property => {
                    const price = property.price?.amount;
                    const min = Number(minPrice) || 0;
                    const max = Number(maxPrice) || Infinity;
                    return price !== undefined && price >= min && price <= max;
                });
            }

            // Apply listing type filter (General or Premium)
            if (currentListingType) {
                tempFiltered = tempFiltered.filter(property =>
                    currentListingType === 'premium' ? property.premiumListing : !property.premiumListing
                );
            }

            // If there are any matches, set them as the matched properties
            if (tempFiltered.length > 0) {
                matchedProperties = tempFiltered;
                break; // Exit the loop when we find properties for a priority
            }
        }

        // If no properties were matched, fallback to showing all filtered properties
        setFilteredProperties(matchedProperties.length > 0 ? matchedProperties : filtered);
    };

    const handleInputChange = (e, filterType) => {
        const value = e.target.value;
        setFilters(prevFilters => ({
            ...prevFilters,
            [filterType]: value
        }));
    };

    const handlePriorityChange = (e, priorityType) => {
        const value = e.target.value;
        setPriorities(prevPriorities => ({
            ...prevPriorities,
            [priorityType]: value
        }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
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
                    allSearchSaved();
                })
                .catch(err => {
                    console.error('Error saving search:', err);
                });
        } else {
            userLogin();
        }
    };

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
                    allSearchSaved();
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

    // Handle the listing type change
    const handleListingTypeChange = (e) => {
        setListingType(e.target.value);
    };

    // handle focus on input fields
    const handleFocus = () => {
        setIsFocus(true);
        setShowTooltip(true);

        setTimeout(() => setShowTooltip(false), 5000); // hide tooltip after 5 seconds
    };

    // handle selecting a past search
    const handleSelectSearch = (item) => {
        console.log(item); // Log the item to see its structure
        setFilters({
            address: item.address || '',
            bedrooms: Array.isArray(item.bedrooms) ? item.bedrooms.join(', ') : (item.bedrooms || ''),
            bathrooms: Array.isArray(item.bathrooms) ? item.bathrooms.join(', ') : (item.bathrooms || ''),
            minPrice: item.minPrice || '',
            maxPrice: item.maxPrice || ''
        });
    };

    const handleTooltipEnter = () => {
        setShowTooltip(true);
    };

    const [propertiesWithDistance, setPropertiesWithDistance] = useState([]);
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });

    useEffect(() => {
        // Check if geolocation is supported by the browser
        if (navigator.geolocation) {
            // Get user's current location
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

                    // Only calculate distances if we have valid lat/long values
                    if (latitude && longitude) {
                        const updatedProperties = filteredProperties.map((property) => {
                            if (property.latitude && property.longitude) {
                                // Calculate distance using the Haversine formula
                                const distanceInMiles = calculateDistance(
                                    latitude,
                                    longitude,
                                    property.latitude,
                                    property.longitude
                                );
                                return { ...property, distance: distanceInMiles.toFixed(2) }; // Format distance to 2 decimal places
                            }
                            return { ...property, distance: null }; // If no lat/long, set distance to null
                        });

                        // Update state with properties and calculated distances
                        setPropertiesWithDistance(updatedProperties);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, [filteredProperties]);


    function calculateDistance(lat1, lon1, lat2, lon2) {
        const toRadians = (degrees) => (degrees * Math.PI) / 180; // Convert degrees to radians
        const R = 3958.8; // Radius of Earth in miles
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const lat1Rad = toRadians(lat1);
        const lat2Rad = toRadians(lat2);

        // Haversine formula to calculate the distance between two points
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Return distance in miles
    }


    console.log(filteredProperties)

    const handleTooltipExit = () => {
        setShowTooltip(false);
    };
    // render tooltip for past searches
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {pastSearch.length > 0 ? (
                <ul>
                    {pastSearch.slice(0, 5).map((item, index) => <li key={index}>{item}</li>)}
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
                            show={showTooltip}
                            onEnter={handleTooltipEnter}
                            onExit={handleTooltipExit}
                        >
                            <Form.Control
                                type="text"
                                placeholder="Enter address"
                                value={filters.address}
                                onChange={(e) => handleInputChange(e, 'address')}
                                onFocus={() => setShowTooltip(true)} // Show tooltip on focus
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

                    {/* New Radio buttons for General and Premium listing */}
                    <Form.Group>
                        <Form.Label>Listing Type</Form.Label>
                        <Form.Check
                            type="radio"
                            label="General Listing"
                            name="listingType"
                            value="general"
                            checked={listingType === 'general'}
                            onChange={handleListingTypeChange}
                        />
                        <Form.Check
                            type="radio"
                            label="Premium Listing"
                            name="listingType"
                            value="premium"
                            checked={listingType === 'premium'}
                            onChange={handleListingTypeChange}
                        />
                    </Form.Group>

                    <Button type="submit" variant="primary">Save Search Address</Button>
                    <Button variant="warning" onClick={handleSaveAll}>Save All Filters</Button>
                </Form>
                <FetchPreviousSearches
                    pastSearch={pastSearch}
                    onSelectSearch={handleSelectSearch}
                />
            </Col>
            <Col sm={8}>
                <Row className='mt-3'>
                    {filteredProperties && filteredProperties.length > 0 ? (
                        propertiesWithDistance.map((item, index) => (
                            <Col key={index} sm={6}>
                                <Card>
                                    <Card.Body>
                                        {/* Property details */}
                                        <Carousel>
                                            {item.images.map((image, imgIndex) => (
                                                <Carousel.Item key={imgIndex}>
                                                    <img
                                                        className="d-block w-100"
                                                        src={`data:${image.contentType};base64,${image.base64}`}
                                                        alt={`data:${image.contentType};base64,${image.base64}`}
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
                                            <ListGroup.Item>Summary: {item.summary} <br /><b>Contact:-</b>Email:- {item.email} or Phone Number:- {item.phoneNumber || "Not Available"}</ListGroup.Item>
                                        </ListGroup>
                                    </Card.Body>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item onClick={() => viewOnMap(item._id)}>View On Map</ListGroup.Item>
                                        {item.distance !== null ? (
                                            <ListGroup.Item>Distance: {item.distance} miles</ListGroup.Item>
                                        ) : (
                                            <ListGroup.Item>Distance not available</ListGroup.Item>
                                        )}

                                        {show === item._id && (
                                            <iframe
                                                width={'100%'}
                                                height={'300'}
                                                style={{ border: 'none' }}
                                                src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=${zoom}&output=embed`}
                                                title="google map"
                                            />
                                        )}
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
