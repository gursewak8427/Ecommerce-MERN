import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../../helpers/auth'

import './VAttributes.css'

function VAttributes() {
    const [state, setState] = useState({
        attributes: [],
        attr: '',
        val: ''
    })
    useEffect(() => {
        axios.get(`http://localhost:8082/api/vendor/product/156/getAttribute`)
            .then(result => {
                setState({ ...state, attributes: result.data.myAttributes })
            }).catch(err => {
                console.log(err)
            })
    }, [])
    const onSubmit = () => {
        document.getElementById('attrAddBtn').disabled = true
        let newAttr = {
            attribute: state.attr,
            values: state.val
        }
        axios.post(`http://localhost:8082/api/vendor/product/156/insertAttribute`, newAttr)
            .then(result => {
                setState({ ...state, attributes: result.data.myAttributes })
                document.getElementById('attrAddBtn').disabled = false
            }).catch(err => {
                console.log(err)
                document.getElementById('attrAddBtn').disabled = false
            })
    }
    const removeAttr = id => {
        axios.post(`http://localhost:8082/api/vendor/product/156/deleteAttribute`, { id })
            .then(result => {
                setState({ ...state, attributes: result.data.myAttributes })
                console.log(result.data.myAttributes)
            }).catch(err => {
                console.log('err', err)
            })
    }
    const onChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }
    return (
        <>
            {!isAuth() ? <Redirect to='/vendor/login' /> : null}
            <div className="v-wrapper">
                <div className="design"></div>
                <div className="v-product">
                    <h1 className="label">Attributes / Variation-types</h1>
                    <div className="attribute-content">
                        <div className="left">
                            <div className="form-area">
                                <label htmlFor="">New Attribute</label>
                                <input type="text" name="attr" value={state.attr} onChange={onChange} placeholder="For example : colors" />
                            </div>
                            <div className="form-area">
                                <label htmlFor="">Values</label>
                                <input type="text" name="val" value={state.val} onChange={onChange} placeholder="value1, value2, value3 etc..." />
                            </div>
                            <div className="form-area">
                                <button onClick={onSubmit} id="attrAddBtn">Add</button>
                            </div>
                        </div>
                        <div className="right">
                            {
                                (state.attributes).map((obj, index) => (
                                    <div key={index} className="attr-list">
                                        <span className='first'>
                                            <span>{obj.attribute}</span>
                                            <span onClick={() => { removeAttr(obj._id) }}>Remove</span>
                                        </span>
                                        <span>
                                            <span>
                                                {
                                                    obj.values.toString().replace(/,/g, ', ')
                                                }</span>
                                            <span>Update</span>
                                        </span>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VAttributes;
