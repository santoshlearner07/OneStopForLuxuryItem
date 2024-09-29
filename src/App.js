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
import BG from "./assessts/BG.jpg"
import AuthCheck from './auth/AuthCheck';
import AddProperty from './component/AddProperty';
import OwnerProperty from './component/OwnerProperty';
import ListedProperties from './component/ListedProperties';

function App() {
// State to store fetched property data, loading status, and error messages
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true); // Indicates if the data is being fetched
  const [error, setError] = useState(null); // Stores error message, if any, during fetching

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/properties/get'); // Fetching property data from the API

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`); // Throwing error if the response is not OK
        }

        const data = await response.json();
        setProperties(data);
        setLoading(false);
      } catch (error) {
        // setError(error);
        setError(`Maintenance break. Come back after some time.`)
        setLoading(false);
      }
    };

    fetchProperties(); // calling the function to fetch data
  }, []);// [] runs only once when the component mounts

  return (
    <div className='App'  >

      <Container>
        <HeaderBar /> {/* Displaying the header bar */}

        {/* Defining the routes for the app */}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/addproperty' element={<AddProperty />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/ownerproperty' element={<OwnerProperty />} />
          <Route path='/ownproperties' element={<ListedProperties />} />
          <Route path='/properties' element={
            <Product properties={properties} loading={loading} errMsg={error} />
          } />
          <Route path='/properties/:id' element={<SingleProperty />} />
        </Routes>
        <FooterBar /> {/* Displaying the footer bar */}
      </Container>
    </div>
  );
}

export default App;
