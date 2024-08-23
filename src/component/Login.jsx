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
  const emailDoesNotMatch = () => toast.error('No user found.')
  const passNotMatch = () => toast.error('Password does not match')
  const emailPassDoesNotMatch = () => toast.error('Email or Password does not match')


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
        navigate("/properties")
      })
      .catch((error) => {
        if (error.response.status == 400) {
          emailDoesNotMatch();
        } else if (error.response.status == 401) {
          passNotMatch();
        } else {
          emailPassDoesNotMatch();
        }

      })
    setUserCheck({
      email: "", password: ""
    })
  }

  const displayPassword = () => {
    hide(!show)
  }

  return (
    <Container>
      <Row>
        <Col lg={"3"}  >
          {/* <RegisterAdvantage /> */}
        </Col>
        <Col lg={"6"} className='text-center' md={12} sm={12} style={{ }}>
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
        <Col lg={"3"}>
          {/* <FeedBack /> */}
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  )
}

export default Login