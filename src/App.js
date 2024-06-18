import './App.css';
import { Container } from 'react-bootstrap';
import HeaderBar from "./fixedComponent/HeaderBar"
import FooterBar from "./fixedComponent/FooterBar"
import SearchBar from "./component/SearchBar"
import Product from "./component/Product"
import { useEffect, useState } from 'react';
import axios from 'axios';


function App() {
  return (
    <Container className="App" fluid="xxl">
      <HeaderBar />
      <SearchBar />
      <Product />
      <FooterBar />
    </Container>
  );
}

export default App;
