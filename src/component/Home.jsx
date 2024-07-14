import React from 'react'
import { NavLink } from 'react-router-dom'

function Home() {
    return (
        <div>
            <NavLink to={"/properties"} >
                <button>Go to Property</button>
            </NavLink>
        </div>
    )
}

export default Home