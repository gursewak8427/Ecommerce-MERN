import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../../helpers/auth'

import './AddCat.css'

function AddCat() {
    return (
        <>
            <div className="select-cat">
                <h1>Add cat</h1>
            </div>            
        </>
    );
}

export default AddCat;
