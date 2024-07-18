import axios from 'axios';
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import BaseApi from '../utils/BaseAPI';

function Register() {
  const [userDetail, setUserDetails] = useState({
    fName: "", lName: "", email: "", pass: "", confPass: "", address: "", gender: "", dateOfBirth: ""
  })

  const userRegister = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevData) => ({ ...prevData, [name]: value }))
  }

  const randomUniqueNumber = () => {
    return Math.floor(Math.random() * 100000) + 1;
  }

  const userRegistered = () => {
    const UID = randomUniqueNumber()

    const userData = {
      userId: UID,
      firstName: userDetail.fName,
      lastName: userDetail.lName,
      email: userDetail.email,
      password: userDetail.pass,
      // confirmPassword: userDetail.confPass,
      address: userDetail.address,
      gender: userDetail.gender,
      date: userDetail.dateOfBirth
    }
    axios.post(`${BaseApi}/register`, userData)
      .then((res) => {
        console.log(res)
        console.log(userData)
      })
      .catch((error) => {
        console.log(error)
        console.log(userData)
      })

    setUserDetails({
      fName: "", lName: "", email: "", pass: "", confPass: "", address: "", gender: "", dateOfBirth: ""
    });
  }

  const handleSubmitUser = (e) => {
    e.preventDefault();
    userRegistered();
  }

  return (
    <Container>
      <Row>
        <Col lg={"3"} style={{ backgroundColor: "red" }} >Register now to </Col>
        <Col lg={"6"} style={{ backgroundColor: "yellow" }} >
          <Form>
            <Row className="mb-3 mt-3">
              <Form.Group as={Col} controlId="formGridFName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter First Name" name='fName' value={userDetail.fName} onChange={userRegister} />
              </Form.Group>

              <Form.Group as={Col} controlId="formGridLName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter Last Name" name='lName' value={userDetail.lName} onChange={userRegister} />
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlId="formGridEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name='email' value={userDetail.email} onChange={userRegister} />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name='pass' value={userDetail.pass} onChange={userRegister} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" placeholder="Confirm Password" name='confPass' value={userDetail.confPass} onChange={userRegister} />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="formGridAddress1">
              <Form.Label>Address</Form.Label>
              <Form.Control placeholder="Enter your address" name='address' value={userDetail.address} onChange={userRegister} />
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
                  value="Male"
                  checked={userDetail.gender === "Male"}
                  onChange={userRegister}
                />
                <Form.Check
                  type="radio"
                  label="Female"
                  name="gender"
                  id="formHorizontalRadios2"
                  value="Female"
                  checked={userDetail.gender === "Female"}
                  onChange={userRegister}
                />
                <Form.Check
                  type="radio"
                  label="other"
                  name="gender"
                  id="formHorizontalRadios3"
                  value="Other"
                  checked={userDetail.gender === "Other"}
                  onChange={userRegister}
                />
              </Col>
              <Col>
                <Form.Control type="date" name='dateOfBirth' id='dateOfBirth' label='dateOfBirth' value={userDetail.dateOfBirth} onChange={userRegister} />
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="mb-3" onClick={handleSubmitUser} >
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