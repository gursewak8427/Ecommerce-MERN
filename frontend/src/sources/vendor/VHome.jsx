import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../helpers/auth'

import './VHome.css'

function VHome() {
    return (
        <>
            {!isAuth() ? <Redirect to='/vendor/login' /> : null}
            <div className="v-wrapper">
                <div className="design"></div>
                <div className="v-product white">
                    <div className="vHeader">
                        <div className="img">
                            <img src="https://miro.medium.com/max/1400/1*6jWG2WdKhOHvcmf0_o8mNA.gif" alt=""/>
                        </div>
                        <h1>Manage your website</h1>
                        <h2>Documentation</h2>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VHome;
