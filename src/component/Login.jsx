import axios from 'axios';
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import BaseApi from '../utils/BaseAPI';

function Login() {

  const [userCheck, setUserCheck] = useState({
    email: "", password: ""
  })

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserCheck((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: userCheck.email,
      password: userCheck.password,
    }
    axios.post(`${BaseApi}/login`, userData)
      .then((res) => {
        console.log(res)
        console.log(userData)
      })
      .catch((error) => {
        console.log(error)
        console.log(userData)
      })
    setUserCheck({
      email: "", password: ""
    })
  }

  return (
    <Container>
      <Row>
        <Col className='text-center' lg={5} md={4} sm={3} style={{ marginLeft: "25%" }}>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name='email' value={userCheck.email} onChange={handleChange} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name='password' value={userCheck.password} onChange={handleChange} />
            </Form.Group>
            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group> */}
            <Button variant="primary" type="submit" onClick={handleSubmit} >
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login