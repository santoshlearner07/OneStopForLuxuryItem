import React, { useEffect, useState } from 'react';
import { Button, Card, Carousel, Col, ListGroup, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function FilteredProperties(props) {
  // console.log(props)
  const navigate = useNavigate();
  const [show, hide] = useState(null);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [propertiesWithDistance, setPropertiesWithDistance] = useState([]);
  const zoom = 13;

  const viewOnMap = (mapId) => {
    hide(show === mapId ? null : mapId);
  };

  const displaySingleProperty = (property, index) => {
    navigate(`/properties/${property}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const propertyPerPage = 6;
  const totalPage = Math.ceil(propertiesWithDistance.length / propertyPerPage);
  const indexOfLastProperty = currentPage * propertyPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertyPerPage;
  const currentProperty = propertiesWithDistance.slice(indexOfFirstProperty, indexOfLastProperty);

  const nextProperty = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevProperty = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    // getting user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          const updatedProperties = props.filteredProperties.map((property) => {
            if (property.location && property.location.latitude && property.location.longitude) {
              const distanceInMiles = calculateDistance(
                latitude,
                longitude,
                property.location.latitude,
                property.location.longitude
              );
              return { ...property, distance: distanceInMiles };
            }
            return { ...property, distance: null };
          });

          // update the properties details
          setPropertiesWithDistance(updatedProperties);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, [props.filteredProperties]);

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

    return R * c; // distance in miles
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
                          alt={`Property ${item.id} Image ${imgIndex}`}
                          width={'100%'}
                          height={'250px'}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                  <Card.Title>Displayed:- {item.addedOrReduced}</Card.Title>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item>
                      Bathrooms:- {item.bathrooms} and Bedrooms:- {item.bedrooms}
                    </ListGroup.Item>
                    {item.residential === true ? 'Residential Use' : 'Commercial Use'}
                    <br />
                    {item.students === true ? 'Students Use' : 'Not for Students'} <br />
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
                    {item.distance !== null ? (
                      <p>Distance: 
                        {item.distance.toFixed(2)}
                         miles away</p>
                    ) : (
                      <p>Distance data is not available</p>
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
        <span style={{ margin: '0 10px', color: 'white' }}>
          Page {currentPage} of {totalPage}
        </span>
        <Button onClick={nextProperty} disabled={currentPage === totalPage}>
          Next
        </Button>
      </div>
    </div>
  );
}

export default FilteredProperties;
