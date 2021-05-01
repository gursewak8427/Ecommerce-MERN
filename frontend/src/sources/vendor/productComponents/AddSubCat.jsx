import React from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../../helpers/auth'

import './AddSubCat.css'

function AddSubCat() {
    return (
        <>
            <div className="select-cat">
                <h1>Add Sub cat</h1>
            </div>            
        </>
    );
}

export default AddSubCat;
