import './App.css';
import { Container } from 'react-bootstrap';
import HeaderBar from "./fixedComponent/HeaderBar"
import FooterBar from "./fixedComponent/FooterBar"
import SearchBar from "./component/SearchBar"
import Product from "./component/Product"
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

function App() {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/properties');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProperties(data.properties);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Container className="App" fluid="xxl">
      <HeaderBar />
      <SearchBar />
      <Routes>
    <Route path='/' element={
      <Product properties={properties} loading={loading} errMsg={error} />
    } />
      </Routes>
      <FooterBar />
    </Container>
  );
}

export default App;
