import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, Carousel, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom'

function SingleProperty(props) {
    const [show, hide] = useState(null)
    const [errMsg, setErrMsg] = useState(null);
    const zoom = 13;
    const [oneProperty, setOneProperty] = useState();
    const propertyId = useParams();
    // console.log(typeof(propertyId))
    // console.log(propertyId)
    useEffect(() => {
        const id = parseInt(propertyId.id);
        axios.get(`http://localhost:8888/api/properties/${id}`)
            .then((res) => {
                setOneProperty(res.data[0])
            }).catch((err) => {
                setErrMsg(err)
            })
    }, [])

    if (!oneProperty) {
        if (errMsg) {
            return <div>Error: {errMsg.message}</div>;
        }
        return <div>Loading...</div>;
    }

    const viewOnMap = (mapId) => {
        hide(show === mapId ? null : mapId);
    }
    // console.log(oneProperty)

    return (
        <Container>
            <Card>
                <Row>
                    <Col>
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
                        <Card.Body>
                            <Card.Title>Displayed:- {oneProperty.addedOrReduced}</Card.Title>
                            <Card.Text>
                                id:- {oneProperty.id}
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroup.Item>Bathrooms:- {oneProperty.bathrooms} and Bedrooms:- {oneProperty.bedrooms}</ListGroup.Item>
                            <ListGroup.Item>Address:- {oneProperty.displayAddress}</ListGroup.Item>
                            <ListGroup.Item>Price:- {oneProperty.price.amount} £</ListGroup.Item>
                            <ListGroup.Item>Brief:- {oneProperty.propertyTypeFullDescription}</ListGroup.Item>
                            <ListGroup.Item onClick={() => viewOnMap(oneProperty.id)}>View On Map</ListGroup.Item>
                            <ListGroup.Item>
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
                    </Col>
                </Row>
            </Card>
        </Container>
    )
}

export default SingleProperty