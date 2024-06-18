import React, { useEffect, useState } from 'react'

function Product(props) {
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  console.log(properties)
  return (
    <div>
      <h1>Properties</h1>
      <ol>
        {properties.map((item, index) => {
          return <div key={index}>
            <li>
              id:- {item.id}
              ----Summary:- {item.summary}
              <br />
              <h1>Price:- {item.price.amount}</h1>
              <br />
              <img src={item.customer.brandPlusLogoUrl} />
            </li>
          </div>
        })}
      </ol>
    </div>
  );
};

export default Product