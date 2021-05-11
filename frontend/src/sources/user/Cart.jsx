import React, { useEffect, useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import { authenticateUser, isAuthUser } from '../../helpers/auth'
import { useStateValue } from '../../StateProvider/StateProvider';
import axios from 'axios'
import './Cart.css'
import Subtotal from './common/Subtotal';
import { KEYS } from '../keys'
import { ToastContainer, toast } from 'react-toastify';

function Cart() {
    const [state, setState] = useState({
        actualItemQty: []
    })
    const [store, dispatch] = useStateValue();

    useEffect(() => {
        window.scroll(0,0)
        dispatch({
            type: 'SET_LOADING'
        })
        var user = isAuthUser()
        if (user) {
            dispatch({
                type: 'LOGIN_USER',
                data: user
            })
            axios.post(`${KEYS.NODE_URL}/api/user/cart/156/get`, { userId: user.id })
                .then(result => {
                    state.actualItemQty = []
                    result.data.cart.map(item => {
                        let var_id = item.productType == 1 ? item.varient._id : 0
                        axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/getQty?p_id=${item.id}&var_id=${var_id}`, { 'pt': item.productType })
                            .then(results => {
                                state.actualItemQty.push(results.data.qty)
                            }).catch(err => {
                                console.log(err)
                            })
                    })
                    setState({
                        ...state,
                        actualItemQty: state.actualItemQty
                    })
                    dispatch({
                        type: 'SET_CART',
                        items: result.data.cart
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            document.getElementById('signup').classList.add('open')
            dispatch({
                type: 'UNSET_LOADING'
            })
        }
        if (store.rawdata.length == 0) {
            axios.get(`${KEYS.NODE_URL}/api/vendor/product/156/getRawData`)
                .then(result => {
                    sorting(result.data.myRawData.categories, result.data.myRawData.subCategories)
                }).catch(err => console.log(err))
        }else{
            dispatch({
                type: 'UNSET_LOADING'
            })
        }
    }, [])


    function sorting(catList, subCatList) {
        for (let j = 0; j < catList.length; j += 1) {
            for (let i = 0; i < catList.length - j; i += 1) {
                if (catList[i + 1]) {
                    if (catList[i].categoryIndex > catList[i + 1].categoryIndex) { swapingCat(i, i + 1) }
                }
            }
        }
        function swapingCat(a, b) {
            let Temp = catList[a]
            catList[a] = catList[b]
            catList[b] = Temp
        }
        for (let j = 0; j < subCatList.length; j += 1) {
            for (let i = 0; i < subCatList.length - j; i += 1) {
                if (subCatList[i + 1]) {
                    if (subCatList[i].subCategoryIndex > subCatList[i + 1].subCategoryIndex) { swapingSubCat(i, i + 1) }
                }
            }
        }
        function swapingSubCat(a, b) {
            let Temp = subCatList[a]
            subCatList[a] = subCatList[b]
            subCatList[b] = Temp
        }
        dispatch({
            type: 'ADD_TO_RAWDATA',
            data: {
                categories: catList,
                subCategories: subCatList
            }
        })
        dispatch({
            type: 'UNSET_LOADING'
        })
    }

    const removeToCart = (productId, cartIndex) => {
        document.getElementById('shortLoading').style.display = 'block'
        let objs = document.getElementsByClassName('cartItemRemoveBtn')
        for (let i = 0; i < objs.length; i++) {
            objs[i].disabled = true
        }

        var cart = store.cart
        var preventCart = cart
        if (cart[cartIndex].id == productId) {
            cart.splice(cartIndex, 1)
        }
        axios.post(`${KEYS.NODE_URL}/api/user/cart/156/set`, { userId: store.user.id, cart })
            .then(result => {
                let objs = document.getElementsByClassName('cartItemRemoveBtn')
                for (let i = 0; i < objs.length; i++) {
                    objs[i].disabled = false
                }
                dispatch({
                    type: 'SET_CART',
                    items: cart
                })
                document.getElementById('shortLoading').style.display = 'none'
                toast.success('Removed Successfull')
            })
            .catch(err => {
                let objs = document.getElementsByClassName('cartItemRemoveBtn')
                for (let i = 0; i < objs.length; i++) {
                    objs[i].disabled = false
                }
                toast.error('Something Wrong')
                document.getElementById('shortLoading').style.display = 'none'
                dispatch({
                    type: 'SET_CART',
                    items: preventCart
                })
                // alert('removed-failed')
            })
    }
    const increaseQty = index => {
        let tempCart = store.cart
        tempCart[index].itemQty != state.actualItemQty[index] ? tempCart[index].itemQty += 1 : null
        dispatch({
            type: 'SET_CART',
            items: tempCart
        })
    }
    const decreaseQty = index => {
        let tempCart = store.cart
        tempCart[index].itemQty != 1 ? tempCart[index].itemQty -= 1 : null
        dispatch({
            type: 'SET_CART',
            items: tempCart
        })
    }
    const setCart = () => {
        document.getElementById('shortLoading').style.display = 'block'
        axios.post(`${KEYS.NODE_URL}/api/user/cart/156/set`, { userId: store.user.id, cart: store.cart })
            .then(result => {
                document.getElementById('shortLoading').style.display = 'none'
                toast.success('Updated Successfull')
                dispatch({
                    type: 'SET_CART',
                    items: store.cart
                })
            })
            .catch(err => {
                document.getElementById('shortLoading').style.display = 'none'
                dispatch({
                    type: 'SET_CART',
                    items: store.cart
                })
            })
    }


    return (
        <>
            <div className="wrapper">
                <ToastContainer />
                {
                    store.loading ? (
                        <div className="loadingContainer">
                            <img src="https://motiongraphicsphoebe.files.wordpress.com/2018/10/giphy.gif" alt="Loading..." />
                        </div>
                    ) : (

                        <div className="cart">
                            {
                                !isAuthUser() ?
                                    <div className="loginFirst">
                                        <img src="https://borlabs.io/wp-content/uploads/2019/09/blog-wp-login.png" alt="" />
                                        <span className='a'>Please Signin/ Signup</span>
                                    </div>
                                    : (
                                        <>
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
                                                                    <div className="top">
                                                                        <div className="left">
                                                                            <img src={item.coverImg} alt="" />
                                                                        </div>
                                                                        <div className="contentCart">
                                                                            <span>{item.name}</span>
                                                                            <span>Price: {item.price.price} ₹</span>
                                                                            <span className='itemQty'>
                                                                                <div className="decQty" onClick={() => decreaseQty(index)}>-</div>
                                                                                <input type="text" value={item.itemQty} readOnly />
                                                                                <div className="incQty" onClick={() => increaseQty(index)}>+</div>
                                                                                <button className='update' onClick={() => setCart()}>update</button>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bottom">
                                                                        <button className='danger' className='cartItemRemoveBtn' onClick={() => removeToCart(item.id, index)}>romove</button>
                                                                    </div>
                                                                </div>
                                                            ) : item.productType == 1 ? (
                                                                <div key={index} className="item">
                                                                    <div className="top">
                                                                        <div className="left">
                                                                            <img src={item.varient.general.images.length != 0 ? item.varient.general.images[0] : item.coverImg} alt="" />
                                                                        </div>
                                                                        <div className="contentCart">
                                                                            <span className='nn'>
                                                                                <span>
                                                                                    {item.name}
                                                                                </span>
                                                                                <span className='attributes'>{item.varient.varienteAttributes.map((atr, index) => index == 0 && index + 1 == item.varient.varienteAttributes.length ? (<span key={index}>({atr.value})</span>) : index == 0 ? (<span key={index}>({atr.value},</span>) : index + 1 == item.varient.varienteAttributes.length ? (<span key={index}>{atr.value})</span>) : (<span key={index}>{atr.value},</span>))} </span>
                                                                            </span>
                                                                            <span>Price: {item.varient.general.price} ₹</span>
                                                                            <span className='itemQty'>
                                                                                <div className="decQty" onClick={() => decreaseQty(index)}>-</div>
                                                                                <input type="text" value={item.itemQty} readOnly />
                                                                                <div className="incQty" onClick={() => increaseQty(index)}>+</div>
                                                                                <button className='update' onClick={() => setCart()}>update</button>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bottom">
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
                                        </>
                                    )
                            }
                        </div>
                    )
                }
            </div>
        </>
    );
}

export default Cart;
