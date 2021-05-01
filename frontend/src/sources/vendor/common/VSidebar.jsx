import React, { useEffect, useState } from 'react';
import { Redirect, Link, Router, Route } from 'react-router-dom'

import './VSidebar.css'

function VSidebar() {
    const [state, setState] = useState({
        index: 1,
    })
    const setIndex = id => {
        setState({ ...state, index: id })
    }
    useEffect(() => {
        let URL = window.location.pathname
        // URL = URL.split('/')
        // if (URL[2] == 'dashborad') {
        //     setState({ ...state, index: 1 })
        // }
        // if ((URL[2] == 'product')) {
        //     setState({ ...state, index: 2 })
        // }
        // if (URL[2] == 'attr') {
        //     setState({ ...state, index: 3 })
        // }
        // if (URL[2] == 'manage') {
        //     setState({ ...state, index: 4 })
        // }
    })
    return (
        <>
            <div className='aside'>
                <div className="data">
                    <div className="logo">
                        Style Factory
                    </div>
                    <Link to='/vendor/dashboard' onClick={() => setIndex(1)}>
                        <li className={state.index == 1 ? 'active' : ''}>
                            <i className="fas fa-home"></i>
                            <span>Dashboard</span>
                        </li>
                    </Link>
                    <Link to='/vendor/product' onClick={() => setIndex(2)}>
                        <li className={state.index == 2 ? 'active' : ''}>
                            <i className="fas fa-home"></i>
                            <span>Product</span>
                        </li>
                    </Link>
                    <Link to='/vendor/attr' onClick={() => setIndex(3)}>
                        <li className={state.index == 3 ? 'active' : ''}>
                            <i className="fas fa-home"></i>
                            <span>Attribute</span>
                        </li>
                    </Link>
                    <Link to='/vendor/manage' onClick={() => setIndex(4)}>
                        <li className={state.index == 4 ? 'active' : ''}>
                            <i className="fas fa-home"></i>
                            <span>Management</span>
                        </li>
                    </Link>
                    <Link to='/vendor/orders' onClick={() => setIndex(5)}>
                        <li className={state.index == 5 ? 'active' : ''}>
                            <i className="fas fa-home"></i>
                            <span>Orders</span>
                        </li>
                    </Link>
                </div>
            </div>
        </>
    );
}

export default VSidebar;
