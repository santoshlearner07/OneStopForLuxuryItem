import React, { useEffect, useState } from 'react'
import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { useNavigate, useParams } from 'react-router-dom';

function Product(props) {
  const [show, hide] = useState(null)
  const navigate = useNavigate();
  const zoom = 13;
  if (props.loading) {
    return <div>Loading...</div>;
  }

  if (props.errMsg) {
    return <div>Error: {props.errMsg.message}</div>;
  }
  console.log(props.properties)

  // const viewOnMap = (mapId) => {
  //   navigate(`/${mapId}`)
  // }
  const viewOnMap = (mapId) => {
    hide(show === mapId ? null : mapId);
  }

  return (
    <Container>
      <h1>One Stop For Luxury Item</h1>
      <Row>
        <Col sm={3} style={{ backgroundColor: "aqua" }}> 1</Col>
        <Col>
          <Row xl={2} lg={2} md={1} sm={1} xs={1} >
            {props.properties.map((item, index) => {
              return (
                <Col key={index}>
                  <Card>
                    <Card.Img variant="top" src={item.propertyImages.mainMapImageSrc} />
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
                          // <MapContainer center={[item.location.latitude, item.location.longitude]} zoom={13} scrollWheelZoom={false}>
                          //   <TileLayer
                          //     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          //   />
                          //   <Marker position={[item.location.latitude, item.location.longitude]}>
                          //     <Popup>
                          //       A pretty CSS3 popup. <br /> Easily customizable.
                          //     </Popup>
                          //   </Marker>
                          // </MapContainer>
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
      </Row>
    </Container>
  );
};

export default Product