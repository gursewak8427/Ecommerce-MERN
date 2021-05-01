import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../helpers/auth'

import './VProfile.css'

function VProfile() {
    return (
        <>  
            {!isAuth() ? <Redirect to='/vendor/login' /> : null}
            <div className="v-wrapper">
                I am in profile
            </div>
        </>
    );
}

export default VProfile;
