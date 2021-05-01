import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../helpers/auth'

import './VHome.css'

function VHome() {
    return (
        <>
            {!isAuth() ? <Redirect to='/vendor/login' /> : null}
        </>
    );
}

export default VHome;
