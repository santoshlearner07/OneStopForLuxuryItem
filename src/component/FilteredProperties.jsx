import React, { useState } from 'react'
import { Button, Card, Carousel, Col, ListGroup, Row } from 'react-bootstrap';
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

    const [currentPage, setCurrentPage] = useState(1);
    const propertyPerPage = 6;

    const totalPage = Math.ceil(props.filteredProperties.length / propertyPerPage);

    const indexOfLastProperty = currentPage * propertyPerPage;
    const indexOfFirstProperty = indexOfLastProperty - propertyPerPage;
    const currentProperty = props.filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
    const nextProperty = () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
        }
    }

    const prevProperty = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    return (
        <div>
            <Row xl={2} lg={2} md={1} sm={1} xs={1}>
                {currentProperty.map((item, index) => {
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
                                    {/* <Card.Text>id:- {item.id}</Card.Text> */}
                                    <ListGroup className="list-group-flush">
                                        <ListGroup.Item>
                                            Bathrooms:- {item.bathrooms} and Bedrooms:- {item.bedrooms}
                                        </ListGroup.Item>
                                        {item.residential === true ? "Residential Use" : "Commercial Use"}<br />
                                        {item.students === true ? "Students Use" : "Not for Students"} <br />
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
            <div className="pagination-controls" style={{ marginTop: '20px', textAlign: 'center' }}>
                <Button onClick={prevProperty} disabled={currentPage === 1}>
                    Previous
                </Button>
                <span style={{ margin: '0 10px' }}>
                    Page {currentPage} of {totalPage}
                </span>
                <Button onClick={nextProperty} disabled={currentPage === totalPage}>
                    Next
                </Button>
            </div>
        </div>
    )
}

export default FilteredProperties