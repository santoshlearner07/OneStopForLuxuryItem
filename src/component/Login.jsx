// All required imports
import axios from 'axios';
import React, { useState } from 'react'
import { Button, Col, Container, Form, Row, InputGroup } from 'react-bootstrap'
import BaseApi from '../utils/BaseAPI';
import { useNavigate } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import RegisterAdvantage from './RegisterAdvantage';
import FeedBack from './FeedBack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  // Functions to show error messages for various login scenarios
  const emailDoesNotMatch = () => toast.error('No user found.')
  const passNotMatch = () => toast.error('Password does not match')
  const emailPassDoesNotMatch = () => toast.error('Email or Password does not match')


  const navigate = useNavigate(); // useNavigate() for navigating
  const [userCheck, setUserCheck] = useState({ // State to hold user email and password
    email: "", password: ""
  })
  const [show, hide] = useState(true); // State to toggle password visibility

  // Handle input changes for email and password fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserCheck((prevData) => ({ ...prevData, [name]: value })) // update the state
  }

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();  // Prevent the default form submission behavior
    const userData = {
      email: userCheck.email,
      password: userCheck.password,
    }
    axios.post(`${BaseApi}/login`, userData) // post request
      .then((res) => {
        localStorage.setItem('token', res.data.accessToken) // store token and email in localstorage
        localStorage.setItem('email',userCheck.email)
        navigate("/properties") // Navigate to the properties page
      })
      .catch((error) => {
        if (error.response.status == 400) {
          emailDoesNotMatch(); // Show error for no user found
        } else if (error.response.status == 401) {
          passNotMatch(); // Show error for password mismatch
        } else {
          emailPassDoesNotMatch(); // Show generic error for email/password mismatch
        }
      })
      // Reset user input fields after submission
    setUserCheck({
      email: "", password: ""
    })
  }

  // Toggle the visibility of the password
  const displayPassword = () => {
    hide(!show) // change the state to show or hide the password
  }

  return (
    <Container>
      <Row>
        <Col lg={"3"}  >
          {/* <RegisterAdvantage /> */}
        </Col>
        <Col lg={"6"} className='text-center' md={12} sm={12} style={{ marginBottom:"200px" }}>
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
        <Col lg={"3"} >
          {/* <FeedBack /> */}
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  )
}

export default Login