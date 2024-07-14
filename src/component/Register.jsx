import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

function Register() {
  return (
    <Container>
      <Row>
        <Col lg={"3"} style={{ backgroundColor: "red" }} >Register now to </Col>
        <Col lg={"6"} style={{ backgroundColor: "yellow" }} >
          <Form>
            <Row className="mb-3 mt-3">
              <Form.Group as={Col} controlId="formGridFName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter First Name" />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridLName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Last Name" />
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlId="formGridEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="Enter your address" />
            </Form.Group>
            <Row className="mb-3">
              <Form.Label as="legend" column sm={2}>
                Gender
              </Form.Label>
              <Col sm={5}>
                <Form.Check
                  type="radio"
                  label="Male"
                  name="gender"
                  id="formHorizontalRadios1"
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  name="gender"
                  id="formHorizontalRadios2"
                />
                <Form.Check
                  type="radio"
                  label="other"
                  name="gender"
                  id="formHorizontalRadios3"
                />
              </Col>
              <Col>
                <Form.Control type="date" name='dateOfBirth' id='dateOfBirth' label='dateOfBirth' />
              </Col>
            </Row>
            <Form.Group className="mb-3" id="formGridCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-3">
              Register
            </Button>
          </Form>
        </Col>
        <Col lg={"3"} style={{ backgroundColor: "green" }} >About us</Col>
      </Row>
    </Container>
  )
}

export default Register