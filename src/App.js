import './App.css';
import { Container } from 'react-bootstrap';
import HeaderBar from "./fixedComponent/HeaderBar"
import FooterBar from "./fixedComponent/FooterBar"
import Product from "./component/Product"
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import SingleProperty from './component/SingleProperty';
import Login from './component/Login';
import Register from './component/Register';

function App() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/properties'); //remove fetch

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data)
        setProperties(data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Container fluid="xxl">
      <HeaderBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/properties' element={
          <Product properties={properties} loading={loading} errMsg={error} />
        } />
        <Route path='/properties/:id' element={<SingleProperty />} />
      </Routes>
      <FooterBar />
    </Container>
  );
}

export default App;
