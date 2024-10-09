import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Carousel, Col, ListGroup, Row } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import BaseApi from '../utils/BaseAPI';
import { IoTrashBinSharp } from "react-icons/io5";
import { NavLink } from 'react-router-dom';

function ListedProperties() {
    // all state to hold initial values
    const [listedProperties, setListedProperties] = useState([]);
    const [show, setShow] = useState(null);
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const [propertiesWithDistance, setPropertiesWithDistance] = useState([]);
    const zoom = 13; // Zoom level for Google Maps

    // Function to toggle map view for a property
    const viewOnMap = (mapId) => {
        setShow(show === mapId ? null : mapId);
    };

    // useEffect to fetch listed properties when the component mounts
    useEffect(() => {
        // retrieve token from local storage and with the help of jwtDecode take out email
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const decodedEmail = decoded.email;

            //fetch properties for the user by email
            axios.get(`${BaseApi}/properties/userGetPropertyByEmail/${decodedEmail}`)
                .then(res => setListedProperties(res.data || [])) // set the listed properties state
                .catch(err => {
                    console.log(err); // log errors during fetch
                });
        } else {
            console.log('No token found');// Log if no token is present
        }
    }, []);

    // useEffect to get user's location and calculate distances to listed properties
    useEffect(() => {
        // getting user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

                    // update properties with calculated distances
                    const updatedProperties = listedProperties.map((property) => {
                        if (property.latitude && property.longitude) {
                            const distanceInMiles = calculateDistance(
                                latitude,
                                longitude,
                                property.latitude,
                                property.longitude
                            );
                            return { ...property, distance: distanceInMiles.toFixed(2) }; // Limit distance to 2 decimal places
                        }
                        return { ...property, distance: null };
                    });
                    // update the properties details with distance
                    setPropertiesWithDistance(updatedProperties);
                },
                (error) => {
                    console.error('Error getting location:', error); // Log any errors in retrieving location
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.'); // Log if geolocation is not supported
        }
    }, [listedProperties]);

    // Function to calculate the distance between two geographical points
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const toRadians = (degrees) => (degrees * Math.PI) / 180; // Convert degrees to radians
        const R = 3958.8; // Radius of Earth in miles
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const lat1Rad = toRadians(lat1);
        const lat2Rad = toRadians(lat2);

        // Haversine formula to calculate distance
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    // Function to delete a property by its ID
    const deletePost = (propertyId) => {
        axios.delete(`${BaseApi}/properties/deletePropertyById/${propertyId}`) // Delete request
            .then(() => {
                setPropertiesWithDistance(propertiesWithDistance.filter(property => property._id !== propertyId)); // filter out the deleted property
            })
            .catch((err) => {
                console.error('Error deleting property:', err); // log any errors during deletion
            });
    };

    console.log(propertiesWithDistance) // log the properties with distance

    return (
        <Row xl={2} lg={2} md={1} sm={1} xs={1}> {/* Responsive grid layout for properties */}
            {propertiesWithDistance.length > 0 ? (
                propertiesWithDistance && propertiesWithDistance.map((item, index) => ( // mapping through propertiesWithDistance to display them
                    <Col key={index}>
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col xl={10} lg={10} md={10} sm={10} xs={10} >
                                        <Card.Title>Displayed: {item.premiumListing ? "Premium Listing" : "General Listing"} </Card.Title>
                                    </Col>
                                    <Col style={{ color: "red", cursor: "pointer" }} onClick={() => deletePost(item._id)}> {/* Clickable icon to delete property */}
                                        <IoTrashBinSharp />
                                    </Col>
                                </Row>
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
                                <ListGroup className="list-group-flush"> {/* List of property details */}
                                    <ListGroup.Item>
                                        Bathrooms: {item.bathrooms} | Bedrooms: {item.bedrooms}
                                    </ListGroup.Item>
                                    {item.residential === true ? 'Residential Use' : 'Commercial Use'} <br />
                                    {item.students === true ? 'Students Use' : 'Not for Students'} <br />
                                    <ListGroup.Item>Address: {item.displayAddress}</ListGroup.Item>
                                    <ListGroup.Item>Price: £{item.amount}</ListGroup.Item>
                                    <ListGroup.Item>Brief: {item.summary},<br /><b>Contact:-</b>Email:- {item.email} or Phone Number:- {item.phoneNumber || "Not Available"}</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item onClick={() => viewOnMap(item.id)}>View On Map</ListGroup.Item> {/* Link to view property on map via function*/}
                                <ListGroup.Item>
                                    {show === item.id && (
                                        <iframe
                                            width="375"
                                            height="300"
                                            style={{ border: 'none' }}
                                            src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=${zoom}&output=embed`} // Google Maps iframe
                                            title="google map"
                                        />
                                    )}
                                    {item.distance !== null ? ( // Display distance if available
                                        <p>Distance: {item.distance} miles</p>
                                    ) : (
                                        <p>Distance not available</p> // Message if distance is not available
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                        <br />
                    </Col>
                ))
            ) : (
                <div>No properties to display,<NavLink to={'/addproperty'} className={'nav-link'} >
                    Click to add Property
                </NavLink>
                </div>
            )}
        </Row>
    );
}

export default ListedProperties;
