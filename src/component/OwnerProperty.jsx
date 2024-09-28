import axios from 'axios'
import React, { useEffect, useState } from 'react'
import BaseApi from '../utils/BaseAPI'
import { Card } from 'react-bootstrap';

function OwnerProperty() {
    const [ownerHouses, setOwnerHouses] = useState();
    useEffect(() => {
        axios.get(`${BaseApi}/properties/usergetproperty`)
            .then((res) => {
                console.log(res.data)
                setOwnerHouses(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    // console.log(ownerHouses)

    return (
        <div>
            <Card>
                {ownerHouses && ownerHouses.map((item, index) => {
                    return (
                        <div>
                            {item.displayAddress}-{item.latitude}-{item.longitude}
                        </div>
                    )
                })}
            </Card>
        </div>
    )
}

export default OwnerProperty