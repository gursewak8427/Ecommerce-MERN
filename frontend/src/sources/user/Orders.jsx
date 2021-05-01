import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { authenticateUser, isAuthUser } from '../../helpers/auth'
import { useStateValue } from '../../StateProvider/StateProvider';
import axios from 'axios'
import './Orders.css'

function Orders() {
    const [store, dispatch] = useStateValue();

    const [myOrder, setMyOrder] = useState([])

    useEffect(() => {
        var user = isAuthUser()
        if (user) {
            dispatch({
                type: 'LOGIN_USER',
                data: user
            })
            axios.post(`http://localhost:8082/api/user/order/156/get`, { userId: user.id })
                .then(result => {
                    dispatch({
                        type: 'SET_ORDERS',
                        orders: result.data.orders
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            document.getElementById('signup').classList.add('open')
        }
    }, [])

    const seeDetail = (index, orderId) => {
        // setting hover/clicked effect
        let d = document.getElementsByClassName('order')
        for(let i = 0; i < d.length; i++){
            d[i].classList.remove('active')
        }
        document.getElementsByClassName(`ordr${orderId}`)[0].classList.add('active')

        if (store.orders[index].orderId == orderId) {
            setMyOrder([index, orderId])
        }
    }

    return (
        <>
            <div className="orders">
                <div className="left list">
                    {
                        store.orders.length == 0 ? (
                            <div className="emptyOrder">
                                <img src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB424694257_.svg" alt="" />
                                <div className="data">
                                    <span className='a'>Your Haven't any order</span>
                                    <Link to='td'><span className='b'>shop today's deals</span></Link>
                                </div>
                            </div>
                        ) : (
                            store.orders.map((order, index) => (
                                <div key={index} className={`order ordr${order.orderId}`}>
                                    <div className="top">
                                        <span>{order.orderTime}</span>
                                        <span className='status' onClick={() => seeDetail(index, order.orderId)}>{
                                            order.orderStatus == 1 ? <span className="a">Pending</span> :
                                                order.orderStatus == 2 ? <span className="b">Processing</span> :
                                                    order.orderStatus == 3 ? <span className="c">Shipping</span> :
                                                        order.orderStatus == 4 ? <span className="d">Delivered</span> : null
                                        }</span>
                                    </div>
                                    <div className="items">
                                        {order.items.map(item => (
                                            item.productType == 0 ? (
                                                <div key={item.id} className="item">
                                                    <img src={item.coverImg} alt="" />
                                                    <div className="content">
                                                        <span>{item.name}</span>
                                                        <span>Price: {item.price.price} ₹</span>
                                                    </div>
                                                </div>
                                            ) : item.productType == 1 ? (
                                                <div key={item.id} className="item">
                                                    <img src={item.varient.general.images.length != 0 ? item.varient.general.images[0] : item.coverImg} alt="" />
                                                    <div className="content">
                                                        <span className='name'>{item.name}
                                                            <span className='attributes'>{item.varient.varienteAttributes.map((atr, index) => index == 0 && index + 1 == item.varient.varienteAttributes.length ? (<span key={index}>({atr.value})</span>) : index == 0 ? (<span key={index}>({atr.value},</span>) : index + 1 == item.varient.varienteAttributes.length ? (<span key={index}>{atr.value})</span>) : (<span key={index}>{atr.value},</span>))} </span>
                                                        </span>
                                                        <span>Price: {item.varient.general.price} ₹</span>
                                                    </div>
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
                <div className="right orderDetail">
                    <div className="box">
                        {
                            myOrder.length == 0 ? (
                                'Here is your order detail'
                            ) : (
                                <>
                                    {store.orders[myOrder[0]].orderId == myOrder[1] ? (
                                        <>  
                                            <span>Order Id: <span>{store.orders[myOrder[0]].orderId}</span></span>
                                            <div className="content">
                                            <div className={`line ${store.orders[myOrder[0]].orderStatus == 1 ? 'one' : store.orders[myOrder[0]].orderStatus == 2 ? 'two' : store.orders[myOrder[0]].orderStatus == 3 ? 'three' : store.orders[myOrder[0]].orderStatus == 4 ? 'four' : '' }`}><span></span></div>
                                            <div className="data">
                                                <li className={`mb-80 ${store.orders[myOrder[0]].orderStatus >= 1 ? 'active-1 now' : ''}`}>Ordered</li>
                                                <li className={`mb-80 ${store.orders[myOrder[0]].orderStatus >= 2 ? 'active-2 now' : ''}`}>Processing</li>
                                                <li className={`mb-80 ${store.orders[myOrder[0]].orderStatus >= 3 ? 'active-3 now' : ''}`}>Shiping</li>
                                                <li className={`${store.orders[myOrder[0]].orderStatus >= 4 ? 'active-4 now' : ''}`}>Delivered</li>
                                            </div>
                                            </div>
                                        </>
                                    ) : null}
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default Orders;
