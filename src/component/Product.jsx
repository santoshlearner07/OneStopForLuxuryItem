import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Container, Form, ListGroup, Overlay, OverlayTrigger, Popover, Row, Tooltip } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';
import BaseApi from '../utils/BaseAPI';
import FilteredProperties from './FilteredProperties';

function Product(props) {
  const [isFocus, setIsFocus] = useState(false)
  const [filters, setFilters] = useState({
    address: '',
    bedrooms: [],
    lessThan5Bedrooms: false,
    moreThan5Bedrooms: false,
    bathrooms: [],
    lessThan5Bathrooms: false,
    moreThan5Bathrooms: false,
  });

  const [filteredProperties, setFilteredProperties] = useState([]);

  const [pastSearch, setpastSearch] = useState([]);

  useEffect(() => {
    applyFilters();
  }, [props.properties, filters]);


  const applyFilters = () => {
    let filtered = props.properties;

    if (filters.address.trim() !== '') {
      filtered = filtered.filter((item) =>
        item.displayAddress.toLowerCase().includes(filters.address.toLowerCase())
      );
    }

    if (filters.bedrooms.length > 0) {
      filtered = filtered.filter((item) => filters.bedrooms.includes(item.bedrooms));
    }

    if (filters.bathrooms.length > 0) {
      filtered = filtered.filter((item) => filters.bathrooms.includes(item.bathrooms));
    }

    if (filters.lessThan5Bedrooms) {
      filtered = filtered.filter((item) => item.bedrooms < 5);
    }

    if (filters.moreThan5Bedrooms) {
      filtered = filtered.filter((item) => item.bedrooms > 5);
    }

    if (filters.lessThan5Bathrooms) {
      filtered = filtered.filter((item) => item.bathrooms < 5);
    }

    if (filters.moreThan5Bathrooms) {
      filtered = filtered.filter((item) => item.bathrooms > 5);
    }

    setFilteredProperties(filtered);
  };

  const handleAddressChange = (e) => {
    setFilters({ ...filters, address: e.target.value });
  };

  const handleCheckboxChange = (e, type, value) => {
    const isChecked = e.target.checked;
    let updatedFilters = { ...filters };

    if (type === 'bedrooms') {
      if (isChecked) {
        updatedFilters.bedrooms.push(value);
      } else {
        updatedFilters.bedrooms = updatedFilters.bedrooms.filter((item) => item !== value);
      }
    }

    if (type === 'bathrooms') {
      if (isChecked) {
        updatedFilters.bathrooms.push(value);
      } else {
        updatedFilters.bathrooms = updatedFilters.bathrooms.filter((item) => item !== value);
      }
    }

    if (type === 'lessThan5Bedrooms') {
      updatedFilters.lessThan5Bedrooms = isChecked;
    }

    if (type === 'moreThan5Bedrooms') {
      updatedFilters.moreThan5Bedrooms = isChecked;
    }

    if (type === 'lessThan5Bathrooms') {
      updatedFilters.lessThan5Bathrooms = isChecked;
    }

    if (type === 'moreThan5Bathrooms') {
      updatedFilters.moreThan5Bathrooms = isChecked;
    }

    setFilters(updatedFilters);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      const decodedEmail = decoded.email
      console.log(decodedEmail)
      const savingSearch = {
        email: decodedEmail,
        searchData: filters.address
      }
      console.log(savingSearch)
      axios.post(`${BaseApi}/saveSearch`, savingSearch)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          alert("Cannot search empty address")
          console.log(err)
        })
    } else {
      console.log("dntknow")
    }
  }

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {
        pastSearch && pastSearch.map((item, index) => {
          return <li key={index}>
            {item}
          </li>
        })
      }
    </Tooltip>
  );

  const handleFocus = () => {
    setIsFocus(true)
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      const decodedEmail = decoded.email
      console.log(decodedEmail)
      axios.get(`${BaseApi}/getUserSearch?email=${decodedEmail}`)
        .then((res) => {
          setpastSearch(res.data.searchData
          )
        })
        .catch((err) => {
          console.log(err)
        })

    } else {
      console.log("")
    }
    setTimeout(() => {
      setIsFocus(false)
    }, 3000);
  }

  if (props.loading) {
    return <div>Loading...</div>;
  }

  if (props.errMsg) {
    return <div>Error: {props.errMsg.message}</div>;
  }

  return (
    <Container>
      <h1>Property</h1>
      {props.properties && (
        <Row>
          <Col sm={3} style={{ backgroundColor: 'aqua' }}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>Search Address</Form.Label>
                <OverlayTrigger
                  placement="bottom"
                  // delay={{ show: 250, hide: 400 }}
                  overlay={renderTooltip}
                  trigger="click"
                  show={isFocus}
                >
                  <Form.Control
                    type="text"
                    placeholder="Enter address"
                    value={filters.address}
                    onChange={handleAddressChange}
                    onFocus={handleFocus}
                  />
                </OverlayTrigger>
              </Form.Group>
              <Button type="submit">Search address</Button>
            </Form>
            <Form style={{ display: 'flex', flexDirection: 'column' }}>
              <Form.Group>
                <Form.Label>Bedrooms</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="1"
                  value={1}
                  checked={filters.bedrooms.includes(1)}
                  onChange={(e) => handleCheckboxChange(e, 'bedrooms', 1)}
                />
                <Form.Check
                  type="checkbox"
                  label="2"
                  value={2}
                  checked={filters.bedrooms.includes(2)}
                  onChange={(e) => handleCheckboxChange(e, 'bedrooms', 2)}
                />
                <Form.Check
                  type="checkbox"
                  label="3"
                  value={3}
                  checked={filters.bedrooms.includes(3)}
                  onChange={(e) => handleCheckboxChange(e, 'bedrooms', 3)}
                />
                <Form.Check
                  type="checkbox"
                  label="Less than 5 Bedrooms"
                  checked={filters.lessThan5Bedrooms}
                  onChange={(e) => handleCheckboxChange(e, 'lessThan5Bedrooms')}
                />
                <Form.Check
                  type="checkbox"
                  label="More than 5 Bedrooms"
                  checked={filters.moreThan5Bedrooms}
                  onChange={(e) => handleCheckboxChange(e, 'moreThan5Bedrooms')}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Bathrooms</Form.Label>
                <Form.Check
                  type="checkbox"
                  label="1"
                  value={1}
                  checked={filters.bathrooms.includes(1)}
                  onChange={(e) => handleCheckboxChange(e, 'bathrooms', 1)}
                />
                <Form.Check
                  type="checkbox"
                  label="2"
                  value={2}
                  checked={filters.bathrooms.includes(2)}
                  onChange={(e) => handleCheckboxChange(e, 'bathrooms', 2)}
                />
                <Form.Check
                  type="checkbox"
                  label="3"
                  value={3}
                  checked={filters.bathrooms.includes(3)}
                  onChange={(e) => handleCheckboxChange(e, 'bathrooms', 3)}
                />
                <Form.Check
                  type="checkbox"
                  label="Less than 5 Bathrooms"
                  checked={filters.lessThan5Bathrooms}
                  onChange={(e) => handleCheckboxChange(e, 'lessThan5Bathrooms')}
                />
                <Form.Check
                  type="checkbox"
                  label="More than 5 Bathrooms"
                  checked={filters.moreThan5Bathrooms}
                  onChange={(e) => handleCheckboxChange(e, 'moreThan5Bathrooms')}
                />
              </Form.Group>
            </Form>
          </Col>
          <Col>
            <FilteredProperties filteredProperties={filteredProperties} />
          </Col>
        </Row>
      )}
      {!props.properties && <div>No data to display</div>}
    </Container>
  );
}

export default Product;
