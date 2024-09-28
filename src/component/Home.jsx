import React from 'react'
import { NavLink } from 'react-router-dom'
import Agent from '../assessts/Agent.jpeg';
import AddProperty from '../assessts/AddProperty.jpg';
import OwnerProperty from '../assessts/OwnerProperty.jpeg';
import { Col, Row } from 'react-bootstrap';

function Home() {
    return (
        <Row>
            <Col lg={4} >
                <NavLink to={"/properties"} className={'nav-link'} style={{ cursor: "pointer",color:"whitesmoke",fontSize:"25px",fontWeight:"bolder" }} >
                    <img style={{width:"100%",height:"350px",}} src={Agent} alt='Agent Property' /><br />
                    Agent Property
                </NavLink>
            </Col>
            <Col lg={4} >
                <NavLink to={'/addproperty'} className={'nav-link'} style={{ cursor: "pointer",color:"whitesmoke",fontSize:"25px",fontWeight:"bolder" }}>
                    <img style={{width:"100%",height:"350px",}} src={AddProperty} alt='Agent Property' /><br />
                    Add Property
                </NavLink>
            </Col>
            <Col lg={4} >
                <NavLink to={'/ownerproperty'} className={'nav-link'} style={{ cursor: "pointer",color:"whitesmoke",fontSize:"25px",fontWeight:"bolder" }}>
                    <img style={{width:"100%",height:"350px",}} src={OwnerProperty} alt='Agent Property' /><br />
                    Owner's Property
                </NavLink>
            </Col>
        </Row>
    )
}

export default Home