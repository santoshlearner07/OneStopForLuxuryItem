import axios from 'axios';
import React, { useEffect, useState } from 'react';
import BaseApi from '../utils/BaseAPI';
import { Card, Col, Row, Form, Button, OverlayTrigger, Tooltip, Carousel, ListGroup } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
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
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [pastSearch, setPastSearch] = useState([]);
    const [isFocus, setIsFocus] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

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
            applyFilters(filters, priorities);
        }
    }, [filters, priorities, ownerHouses]);

    useEffect(() => {
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

        // First, filter properties based on the values provided in the filters
        if (address) {
            filtered = filtered.filter(property =>
                property.displayAddress.toLowerCase().includes(address.toLowerCase())
            );
        }

        if (bedrooms) {
            filtered = filtered.filter(property => property.bedrooms === Number(bedrooms));
        }

        if (bathrooms) {
            filtered = filtered.filter(property => property.bathrooms === Number(bathrooms));
        }

        if (minPrice) {
            filtered = filtered.filter(property => property.price.amount >= Number(minPrice));
        }

        if (maxPrice) {
            filtered = filtered.filter(property => property.price.amount <= Number(maxPrice));
        }

        // Sort properties based on priorities (example sorting by bedrooms, bathrooms, and price)
        filtered.sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;

            if (bedroomsPriority > 0) {
                scoreA += a.bedrooms === Number(bedrooms) ? bedroomsPriority : 0;
                scoreB += b.bedrooms === Number(bedrooms) ? bedroomsPriority : 0;
            }

            if (bathroomsPriority > 0) {
                scoreA += a.bathrooms === Number(bathrooms) ? bathroomsPriority : 0;
                scoreB += b.bathrooms === Number(bathrooms) ? bathroomsPriority : 0;
            }

            if (pricePriority > 0) {
                const priceA = a.price.amount;
                const priceB = b.price.amount;

                scoreA += (priceA >= minPrice && priceA <= maxPrice) ? pricePriority : 0;
                scoreB += (priceB >= minPrice && priceB <= maxPrice) ? pricePriority : 0;
            }

            return scoreB - scoreA; // Higher score means higher priority
        });

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

    // Handle priority input changes
    const handlePriorityChange = (e, priorityType) => {
        const value = e.target.value;

        // Update the priorities state
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
                    console.log('Search saved:', res);
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
                    console.log('All user inputs saved:', res);
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

    const handleFocus = () => {
        setIsFocus(true);
        setShowTooltip(true);

        setTimeout(() => setShowTooltip(false), 5000);
    };

    const handleSelectSearch = (item) => {
        setFilters({
            address: item.address || '',
            bedrooms: item.bedrooms.join(', ') || '',
            bathrooms: item.bathrooms.join(', ') || '',
            minPrice: item.minPrice || '',
            maxPrice: item.maxPrice || ''
        });
    };

    const handleIncreaseMaxPrice = () => {
        setFilters(prevFilters => ({
            ...prevFilters,
            maxPrice: prevFilters.maxPrice ? (Number(prevFilters.maxPrice) * 1.1).toFixed(2) : ''
        }));
    };

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
                    {/* <Button variant="outline-primary" onClick={sortPropertiesByPriority}>Sort Properties</Button> */}
                </Form>
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
