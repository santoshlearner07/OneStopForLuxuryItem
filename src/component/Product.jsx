import React, { useEffect, useState } from 'react'
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from 'components/ExampleCarouselImage';
function Product(props) {
  const [show, hide] = useState(null)
  const zoom = 13;
  if (props.loading) {
    return <div>Loading...</div>;
  }

  if (props.errMsg) {
    return <div>Error: {props.errMsg.message}</div>;
  }
  console.log(props.properties)

  const viewOnMap = (mapId) => {
    hide(show === mapId ? null : mapId);
  }

  return (
    <Container>
      <h1>One Stop For Luxury Item</h1>
      {props.properties && <Row>
        <Col sm={3} style={{ backgroundColor: "aqua" }}> 1 </Col>
        <Col>
          <Row xl={2} lg={2} md={1} sm={1} xs={1} >
            {props.properties.map((item, index) => {
              return (
                <Col key={index}>
                  <Card>

                    <Carousel>
                      {item.propertyImages.images.map((image, imgIndex) => (
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

                    {/* <Card.Img variant="top" src={item.propertyImages.mainMapImageSrc} /> */}
                    <Card.Body>
                      <Card.Title>Displayed:- {item.addedOrReduced}</Card.Title>
                      <Card.Text>
                        id:- {item.id}
                      </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                      <ListGroup.Item>Bathrooms:- {item.bathrooms} and Bedrooms:- {item.bedrooms}</ListGroup.Item>
                      <ListGroup.Item>Address:- {item.displayAddress}</ListGroup.Item>
                      <ListGroup.Item>Price:- {item.price.amount} £</ListGroup.Item>
                      <ListGroup.Item>Brief:- {item.propertyTypeFullDescription}</ListGroup.Item>
                      <ListGroup.Item onClick={() => viewOnMap(item.id)}>View On Map</ListGroup.Item>
                      <ListGroup.Item>
                        {show === item.id && (
                          <iframe
                            width={"375"}
                            height={"300"}
                            style={{ border: "none" }}
                            src={`https://maps.google.com/maps?q=${item.location.latitude},${item.location.longitude}&z=${zoom}&output=embed`}
                            title="google map"
                          />
                        )}
                      </ListGroup.Item>
                    </ListGroup>
                  </Card>
                  <br />
                </Col>
              )
            })}
          </Row>
        </Col>
      </Row>}
      {!props.properties && <div>No data to display</div>}
    </Container>
  );
};

export default Product