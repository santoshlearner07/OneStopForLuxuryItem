import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Carousel, Col, ListGroup, Row } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import BaseApi from '../utils/BaseAPI';
import { IoTrashBinSharp } from "react-icons/io5";

function ListedProperties() {
    const [listedProperties, setListedProperties] = useState([]);
    const [show, setShow] = useState(null);
    const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
    const [propertiesWithDistance, setPropertiesWithDistance] = useState([]);
    const zoom = 13;

    const viewOnMap = (mapId) => {
        setShow(show === mapId ? null : mapId);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const decodedEmail = decoded.email;

            axios.get(`${BaseApi}/properties/userGetPropertyByEmail/${decodedEmail}`)
                .then(res => setListedProperties(res.data || []))
                .catch(err => {
                    console.log(err);
                });
        } else {
            console.log('No token found');
        }
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });

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
                    setPropertiesWithDistance(updatedProperties);
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, [listedProperties]);

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const toRadians = (degrees) => (degrees * Math.PI) / 180;
        const R = 3958.8; // Radius of Earth in miles
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const lat1Rad = toRadians(lat1);
        const lat2Rad = toRadians(lat2);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    const deletePost = (propertyId) => {
        axios.delete(`${BaseApi}/properties/deletePropertyById/${propertyId}`)
            .then(() => {
                setPropertiesWithDistance(propertiesWithDistance.filter(property => property._id !== propertyId));
            })
            .catch((err) => {
                console.error('Error deleting property:', err);
            });
    };

    console.log(propertiesWithDistance)

    return (
        <Row xl={2} lg={2} md={1} sm={1} xs={1}>
            {propertiesWithDistance && propertiesWithDistance.map((item, index) => (
                <Col key={index}>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col xl={10} lg={10} md={10} sm={10} xs={10} >
                                    <Card.Title>Displayed: {item.premiumListing ? "Premium Listing" : "General Listing"} </Card.Title>
                                </Col>
                                <Col style={{ color: "red", cursor: "pointer" }} onClick={() => deletePost(item._id)}>
                                    <IoTrashBinSharp />
                                </Col>
                            </Row>
                            <Carousel>
                                {item.images.map((image, imgIndex) => (
                                    <Carousel.Item key={imgIndex}>
                                        <img
                                            className="d-block w-100"
                                            src={`http://localhost:3000/${image}`}
                                            alt={`Property ${image}`}
                                            width={'100%'}
                                            height={'250px'}
                                        />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                            <ListGroup className="list-group-flush">
                                <ListGroup.Item>
                                    Bathrooms: {item.bathrooms} | Bedrooms: {item.bedrooms}
                                </ListGroup.Item>
                                {item.residential === true ? 'Residential Use' : 'Commercial Use'} <br />
                                {item.students === true ? 'Students Use' : 'Not for Students'} <br />
                                <ListGroup.Item>Address: {item.displayAddress}</ListGroup.Item>
                                <ListGroup.Item>Price: £{item.amount}</ListGroup.Item>
                                <ListGroup.Item>Brief: {item.summary}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item onClick={() => viewOnMap(item.id)}>View On Map</ListGroup.Item>
                            <ListGroup.Item>
                                {show === item.id && (
                                    <iframe
                                        width="375"
                                        height="300"
                                        style={{ border: 'none' }}
                                        src={`https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=${zoom}&output=embed`}
                                        title="google map"
                                    />
                                )}
                                {item.distance !== null ? (
                                    <p>Distance: {item.distance} miles</p>
                                ) : (
                                    <p>Distance not available</p>
                                )}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                    <br />
                </Col>
            ))}
        </Row>
    );
}

export default ListedProperties;
