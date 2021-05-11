import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../helpers/auth'
import { useStateValue } from '../../StateProvider/StateProvider';

import './VOrders.css'
import { KEYS } from '../keys';

function VOrders() {
    const [store, dispatch] = useStateValue();

    useEffect(() => {
        axios.post(`${KEYS.NODE_URL}/api/vendor/order/156/get`, { userId: 1 })
            .then(result => {
                dispatch({
                    type: 'SET_VORDERS',
                    orders: result.data.orders
                })
            })
            .catch(err => {
                console.log(err)
            })
    }, [])


    const toggleField = index => {
        document.getElementsByClassName(`dtl${index}`)[0].classList.toggle('active')
    }

    const changeStatus = (e, index, orderId) => {
        let userId = store.vendorOrders[index][0]
        if (store.vendorOrders[index][1].orderId == orderId) {
            store.vendorOrders[index][1].orderStatus = e.target.value
            dispatch({
                type: 'SET_VORDERS',
                orders: store.vendorOrders
            })
        }
        axios.post(`${KEYS.NODE_URL}/api/vendor/order/156/changeStatus`, { userId, orders: store.vendorOrders })
            .then(result => {
                let userOrders = result.data.usserOrders
                userOrders.map(order => (
                    order.orderId == orderId ? order.orderStatus = e.target.value : null
                ))
                axios.post(`${KEYS.NODE_URL}/api/vendor/order/156/changeStatus/user`, { userId, orders: userOrders })
                    .then(results => {
                        // console.log(results)
                    })
                    .catch(errs => {
                        console.log(errs)
                    })

            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <>
            {!isAuth() ? <Redirect to='/vendor/login' /> : null}
            <div className="v-wrapper">
                <div className="design"></div>
                <div className="v-product">
                    <h1 className="label">My Orders</h1>
                    <div className="vorders">
                        {
                            store.vendorOrders.length == 0 ? 'No Any Order Yet' : null
                        }
                        {
                            store.vendorOrders.map((order, index) => (
                                <div key={index} className="order">
                                    <div className={`content con${index}`} onClick={() => toggleField(index)}>
                                        <span className='index'>{index + 1}</span>
                                        <span className='id'>{order[1].orderId}</span>
                                        <span className='pricing'>({order[1].items.length} items) {order[1].orderAmount} Rs</span>
                                        <span className='payment'>{order[1].orderPayment.paymentType == 1 ? 'COD' : 'UPI'}</span>
                                        <span className='timing'>{order[1].orderTime}</span>
                                    </div>
                                    <div className={`details dtl${index}`}>
                                        <div className="status">
                                            <select name="status" defaultValue={order[1].orderStatus} onChange={(e) => changeStatus(e, index, order[1].orderId)}>
                                                <option value="1">Pending</option>
                                                <option value="2">Processing</option>
                                                <option value="3">Shipping</option>
                                                <option value="4">Delivered</option>
                                                <option value="5">Canceled</option>
                                            </select>
                                        </div>
                                        <div className="items">
                                            {
                                                order[1].items.map(item => (
                                                    item.productType == 0 ? (
                                                        <div key={item.id} className="item">
                                                            <img src={item.coverImg} alt="" />
                                                            <div className="content">
                                                                <span>{item.name}</span>
                                                                <span>Qty: {item.itemQty}</span>
                                                                <span>Price: {item.price.price} ₹</span>
                                                            </div>
                                                        </div>
                                                    ) : item.productType == 1 ? (
                                                        <div key={item.id} className="item">
                                                            <img src={item.varient.general.images.length != 0 ? item.varient.general.images[0] : item.coverImg} alt="" />
                                                            <div className="content">
                                                                <span>{item.name}
                                                                    <span className='attributes'>{item.varient.varienteAttributes.map((atr, index) => index == 0 && index + 1 == item.varient.varienteAttributes.length ? (<span key={index}>({atr.value})</span>) : index == 0 ? (<span key={index}>({atr.value},</span>) : index + 1 == item.varient.varienteAttributes.length ? (<span key={index}>{atr.value})</span>) : (<span key={index}>{atr.value},</span>))} </span>
                                                                </span>
                                                                <span>Qty: {item.itemQty}</span>
                                                                <span>Price: {item.varient.general.price} ₹</span>
                                                            </div>
                                                        </div>
                                                    ) : null
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default VOrders;
