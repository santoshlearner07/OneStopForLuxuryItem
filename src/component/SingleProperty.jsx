import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Carousel, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom'
import { FaBan } from "react-icons/fa";
function SingleProperty(props) {
    // all initial state
    const [show, hide] = useState(null) // useState hook for handling visibility of the map
    const [errMsg, setErrMsg] = useState(null); // useState for storing error messages, initialized as null
    const [oneProperty, setOneProperty] = useState(); // useState for storing property data, initially undefined
    const zoom = 13; // Zoom level for Google Maps iframe
    
        // useParams to get propertyId from the URL
    const propertyId = useParams();

    // useEffect to fetch a single property based on ID
    useEffect(() => {
        const id = parseInt(propertyId.id);
        axios.get(`http://localhost:8888/api/properties/${id}`)
            .then((res) => {
                setOneProperty(res.data)
            }).catch((err) => {
                setErrMsg(err)
            })
    }, [])

    // If the property data has not yet been loaded, disply loading or error message
    if (!oneProperty) {
        if (errMsg) {
            return <div>Error: {errMsg.message}</div>;
        }
        return <div>Loading...</div>;
    }

    // toggle function to show or hide Google Maps iframe
    const viewOnMap = (mapId) => {
        hide(show === mapId ? null : mapId);
    }

    return (
        <Container className='mt-3' >
            <Card>
                <Row>
                    <Col>
                    {/* Carousel to display property images */}
                        <Carousel>
                            {oneProperty.propertyImages.images.map((image, imgIndex) => (
                                <Carousel.Item key={imgIndex}>
                                    <img
                                        className="d-block w-100"
                                        src={image.srcUrl}
                                        alt={`Property ${image.id} Image ${imgIndex}`}
                                        width={"100%"} height={"250px"}
                                    />
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    </Col>
                    <Col>
                    {/* Displaying property summary and customer details */}
                        Summary :- {oneProperty.summary}<br />
                        <Row>
                            <Col lg={8}>
                                <b> Customer details:- </b><br />
                                Brand Trading Name:- {oneProperty.customer.brandTradingName}<br />
                                Branch Name :- {oneProperty.customer.branchName}<br />
                                Telephone:- {oneProperty.customer.contactTelephone}<br />
                            </Col>
                            <Col>
                                <div className='text-end mt-3' >
                                    <img src={oneProperty.customer.brandPlusLogoUrl} alt={oneProperty.customer.brandTradingName} style={{ width: "70px", marginRight: "20px" }} />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Card.Body style={{ marginLeft: "25px" }} >
                        <Card.Title>
                            {oneProperty.featuredProperty === true ? "It is Featured Property" : " "}<br />
                            Displayed:- {oneProperty.addedOrReduced}
                        </Card.Title>
                        <Card.Text>
                            Ad reference no.:- {oneProperty.id}
                            <h3>
                                {oneProperty.residential === true ? "Residential Use ONLY" : "Commercial Use ONLY"} -- 
                                {oneProperty.students === true ? " Students Use" : " Not for Students"} <br />
                            </h3>
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush" style={{ marginLeft: "15px", width: "95%" }} >
                        <ListGroup.Item>Bathrooms:- {oneProperty.bathrooms} and Bedrooms:- {oneProperty.bedrooms}</ListGroup.Item>
                        <ListGroup.Item>Price:- {oneProperty.price.displayPrices[0].displayPrice},  Address:- {oneProperty.displayAddress}</ListGroup.Item>
                        <ListGroup.Item>Brief:- {oneProperty.propertyTypeFullDescription}, Number Of Floors:- {oneProperty.numberOfFloorplans}</ListGroup.Item>
                        <ListGroup.Item>TransactionType:- {oneProperty.transactionType === "buy" ? "Buy" : "Sell"}</ListGroup.Item>
                        <ListGroup.Item onClick={() => viewOnMap(oneProperty.id)}>View On Map</ListGroup.Item>
                        <ListGroup.Item>
                            {/* Display Google Maps iframe if the user clicks on "View On Map" */}
                            {show === oneProperty.id && (
                                <iframe
                                    width={"375"}
                                    height={"300"}
                                    style={{ border: "none" }}
                                    src={`https://maps.google.com/maps?q=${oneProperty.location.latitude},${oneProperty.location.longitude}&z=${zoom}&output=embed`}
                                    title="google map"
                                />
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Row>
            </Card>
        </Container>
    )
}

export default SingleProperty