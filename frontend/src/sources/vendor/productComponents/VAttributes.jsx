import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../../helpers/auth'

import './VAttributes.css'
import { KEYS } from '../../keys';

function VAttributes() {
    const [state, setState] = useState({
        attributes: [],
        attr: '',
        val: '',
        updatedAttrId: undefined,
        newPushVal: '',
        error: []
    })
    useEffect(() => {
        axios.get(`${KEYS.NODE_URL}/api/vendor/product/156/getAttribute`)
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
        axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/insertAttribute`, newAttr)
            .then(result => {
                setState({ ...state, attr: '', val: '', attributes: result.data.myAttributes })
                document.getElementById('attrAddBtn').disabled = false
            }).catch(err => {
                console.log(err)
                document.getElementById('attrAddBtn').disabled = false
            })
    }
    const removeAttr = id => {
        axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/deleteAttribute`, { id })
            .then(result => {
                console.log(result)
                if (result.data?.error) {
                    state.error = []
                    result.data?.error.map(obj => {
                        state.error.push(obj)
                    })
                    setState({ ...state, error: state.error })
                } else {
                    setState({ ...state, attributes: result.data.myAttributes })
                }
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
    const pushNew = id => {
        setState({
            ...state,
            updatedAttrId: id,
            newPushVal: ''
        })
        document.getElementsByClassName('newPush')[0].classList.add('active')
    }
    const closeNewPush = () => {
        setState({
            ...state,
            updatedAttrId: undefined,
            newPushVal: ''
        })
        document.getElementsByClassName('newPush')[0].classList.remove('active')
    }
    const addNewPush = () => {
        let data = {
            id: state.updatedAttrId,
            value: state.newPushVal
        }
        axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/pushNewAttribute`, data)
            .then(result => {
                if (result.data.myAttributes == 0) {
                    alert('value is already present')
                } else {
                    setState({ ...state, attributes: result.data.myAttributes, updatedAttrId: undefined, newPushVal: '' })
                    document.getElementsByClassName('newPush')[0].classList.remove('active')
                }
            }).catch(err => {
                console.log('err', err)
            })
    }
    const deleteThisAttrValue = (id, index) => {
        axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/getAttributeWithId`, { id })
            .then(result => {
                let myAtr = result.data.myAttribute
                if (myAtr.numProduct[index].length == 0) {
                    myAtr.values.splice(index, 1)
                    myAtr.numProduct.splice(index, 1)
                    axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/setAttributes`, { id, attribute: myAtr })
                        .then(results => {
                            setState({ ...state, attributes: results.data.myAttribute })
                        }).catch(err => {
                            console.log(err)
                        })
                } else {
                    alert('This Value is used in product. If you want to delete first delete those product varient')
                }
            }).catch(err => {
                console.log(err)
            })
    }
    const closeErrorDiv = () => {
        setState({
            ...state,
            error: []
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
                                state.error.length != 0 ? (
                                    <div className="divError">
                                        <span className='crs' onClick={closeErrorDiv}>X</span>
                                        {
                                            state.error.map((error, index) => (
                                                    <span key={index}>
                                                        <b>Error:</b> "{error[0]}" is used in Product Id's : {error[1].map(err => <span>{err},</span>)}
                                                        <br/>
                                                        <i>First Delete These Products or Varient</i>
                                                    </span>
                                            )
                                            )
                                        }
                                    </div>
                                ) : null
                            }
                            {
                                (state.attributes).map((obj, index) => (
                                    <div key={index} className="attr-list">
                                        <span className='first'>
                                            <span>{obj.attribute}</span>
                                            <span onClick={() => { removeAttr(obj._id) }}>Remove</span>
                                        </span>
                                        <span>
                                            <span>
                                                {obj.values.map((val, index) => <span key={index} onClick={() => deleteThisAttrValue(obj._id, index)} className='atr'>{val},</span>)}
                                            </span>
                                            <span onClick={() => pushNew(obj._id)}>New</span>
                                        </span>
                                    </div>
                                ))
                            }

                        </div>
                        <div className="newPush">
                            <div className="crose" onClick={() => closeNewPush()}>X</div>
                            <input type="text" name='newPushVal' onChange={onChange} value={state.newPushVal} placeholder='Add New Value' />
                            <button onClick={addNewPush}>Add New</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default VAttributes;
