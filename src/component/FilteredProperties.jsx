import React, { useState } from 'react'
import { Card, Carousel, Col, ListGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function FilteredProperties(props) {
    const navigate = useNavigate();
    const [show, hide] = useState(null);
    const zoom = 13;
    const viewOnMap = (mapId) => {
        hide(show === mapId ? null : mapId);
    };
    const displaySingleProperty = (property, index) => {
        navigate(`/properties/${property}`);
    };

    return (
        <div>
            <Row xl={2} lg={2} md={1} sm={1} xs={1}>
                {props.filteredProperties.map((item, index) => {
                    return (
                        <Col key={index}>
                            <Card>
                                <Card.Body onClick={() => displaySingleProperty(item.id, index)}>
                                    <Carousel>
                                        {item.propertyImages.images.map((image, imgIndex) => (
                                            <Carousel.Item key={imgIndex}>
                                                <img
                                                    className="d-block w-100"
                                                    src={image.srcUrl}
                                                    alt={`Property ${image.id} Image ${imgIndex}`}
                                                    width={'100%'}
                                                    height={'250px'}
                                                />
                                            </Carousel.Item>
                                        ))}
                                    </Carousel>
                                    <Card.Title>Displayed:- {item.addedOrReduced}</Card.Title>
                                    <Card.Text>id:- {item.id}</Card.Text>
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>
                                            Bathrooms:- {item.bathrooms} and Bedrooms:- {item.bedrooms}
                                        </ListGroup.Item>
                                        <ListGroup.Item>Address:- {item.displayAddress}</ListGroup.Item>
                                        <ListGroup.Item>Price:- {item.price.amount} £</ListGroup.Item>
                                        <ListGroup.Item>Brief:- {item.propertyTypeFullDescription}</ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>
                                <ListGroup className="list-group-flush">
                                    <ListGroup.Item onClick={() => viewOnMap(item.id)}>View On Map</ListGroup.Item>
                                    <ListGroup.Item>
                                        {show === item.id && (
                                            <iframe
                                                width={'375'}
                                                height={'300'}
                                                style={{ border: 'none' }}
                                                src={`https://maps.google.com/maps?q=${item.location.latitude},${item.location.longitude}&z=${zoom}&output=embed`}
                                                title="google map"
                                            />
                                        )}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Card>
                            <br />
                        </Col>
                    );
                })}
            </Row>
        </div>
    )
}

export default FilteredProperties