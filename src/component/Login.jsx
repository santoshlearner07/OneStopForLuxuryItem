import axios from 'axios';
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row, InputGroup } from 'react-bootstrap'
import BaseApi from '../utils/BaseAPI';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import RegisterAdvantage from './RegisterAdvantage';
import FeedBack from './FeedBack';
function Login() {
  const navigate = useNavigate();
  const [userCheck, setUserCheck] = useState({
    email: "", password: ""
  })
  const [show, hide] = useState(true);
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
        localStorage.setItem('token', res.data.accessToken)
        console.log(res)
        navigate("/properties")
      })
      .catch((error) => {
        console.log(error)
      })
    setUserCheck({
      email: "", password: ""
    })
  }

  const displayPassword = () => {
    hide(!show)
  }

  return (
    <Container style={{ backgroundColor: "black" }} >
      <Row>
        <Col lg={"3"} style={{ backgroundColor: "green" }} >
          <RegisterAdvantage />
        </Col>
        <Col lg={"6"} className='text-center' md={12} sm={12} style={{ backgroundColor: "red" }}>
          <Form>
            <Form.Group className="mb-3" controlid="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name='email' value={userCheck.email} onChange={handleChange} />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Label>Password</Form.Label>
            <InputGroup className="mb-3" controlid="formBasicPassword">
              <Form.Control type={show ? 'password' : 'text'} placeholder="Password" name='password' value={userCheck.password} onChange={handleChange} />
              <InputGroup.Text id="basic-addon1">
                {" "}
                <div onClick={() => displayPassword()} >
                  {show ? <FaEyeSlash /> : <FaEye />}
                </div>
              </InputGroup.Text>
            </InputGroup>
            <Button className='mb-2' variant="primary" type="submit" onClick={handleSubmit} >
              Submit
            </Button>
          </Form>
        </Col>
        <Col lg={"3"} style={{ backgroundColor: "yellow" }} >
          <FeedBack />
        </Col>
      </Row>
    </Container>
  )
}

export default Login