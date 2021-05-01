import React, { useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { authenticateUser, isAuthUser } from '../../helpers/auth'
import { useStateValue } from '../../StateProvider/StateProvider';
import axios from 'axios'
import './Cart.css'
import Subtotal from './common/Subtotal';

function Cart() {
    const [store, dispatch] = useStateValue();

    useEffect(() => {
        var user = isAuthUser()
        if (user) {
            dispatch({
                type: 'LOGIN_USER',
                data: user
            })
            axios.post(`http://localhost:8082/api/user/cart/156/get`, { userId: user.id })
                .then(result => {
                    dispatch({
                        type: 'SET_CART',
                        items: result.data.cart
                    })

                })
                .catch(err => {
                    console.log(err.response.data.error)
                })
        } else {
            document.getElementById('signup').classList.add('open')
        }
    }, [])

    const removeToCart = (productId, cartIndex) => {
        var cart = store.cart
        var preventCart = cart
        if (cart[cartIndex].id == productId) {
            cart.splice(cartIndex, 1)
        }
        dispatch({
            type: 'SET_CART',
            items: cart
        })
        axios.post(`http://localhost:8082/api/user/cart/156/set`, { userId: store.user.id, cart })
            .then(result => {
                dispatch({
                    type: 'SET_CART',
                    items: cart
                })
                // alert('removed')
            })
            .catch(err => {
                console.log(err)
                dispatch({
                    type: 'SET_CART',
                    items: preventCart
                })
                // alert('removed-failed')
            })

    }
    return (
        <>
            <div className="cart">
                <div className="left list">
                    {
                        store.cart.length == 0 ? (
                            <div className="emptyCart">
                                <img src="https://m.media-amazon.com/images/G/31/cart/empty/kettle-desaturated._CB424694257_.svg" alt="" />
                                <div className="data">
                                    <span className='a'>Your Cart is empty</span>
                                    <Link to='td'><span className='b'>shop today's deals</span></Link>
                                </div>
                            </div>
                        ) : (

                            store.cart.map((item, index) => (
                                item.productType == 0 ? (
                                    <div key={index} className="item">
                                        <img src={item.coverImg} alt="" />
                                        <div className="content">
                                            <span>{item.name}</span>
                                            <span>Price: {item.price.price} ₹</span>
                                            <button className='danger' onClick={() => removeToCart(item.id, index)}>romove</button>
                                        </div>
                                    </div>
                                ) : item.productType == 1 ? (
                                    <div key={index} className="item">
                                        <img src={item.varient.general.images.length != 0 ? item.varient.general.images[0] : item.coverImg} alt="" />
                                        <div className="content">
                                            <span>{item.name}
                                                <span className='attributes'>{item.varient.varienteAttributes.map((atr, index) => index == 0 && index + 1 == item.varient.varienteAttributes.length ? (<span key={index}>({atr.value})</span>) : index == 0 ? (<span key={index}>({atr.value},</span>) : index + 1 == item.varient.varienteAttributes.length ? (<span key={index}>{atr.value})</span>) : (<span key={index}>{atr.value},</span>))} </span>
                                            </span>
                                            <span>Price: {item.varient.general.price} ₹</span>
                                            <button className='danger' onClick={() => removeToCart(item.id, index)}>romove</button>
                                        </div>
                                    </div>
                                ) : null
                            ))

                        )
                    }
                </div>
                <div className="right checkout">
                    <Subtotal />
                </div>
            </div>
        </>
    );
}

export default Cart;
