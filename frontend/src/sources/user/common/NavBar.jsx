import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import main_logo from '../../../assests/logos/main_logo.jpg';
import './NavBar.css'
import Keys from '../../../config/config.json'
import { isAuthUser } from '../../../helpers/auth';
import { useStateValue } from '../../../StateProvider/StateProvider';
import axios from 'axios'


const NavBar = (props) => {
    const [store, dispatch] = useStateValue();
    useEffect(() => {
        let user = isAuthUser()
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
        }
    }, [])
    const openSideBar = () => {
        document.getElementById('menuBtn').classList.toggle('open')
        document.getElementById('sideBar').classList.toggle('open')
        document.getElementById('sideMenu').classList.remove('open')
    }
    const openSideMenu = () => {
        document.getElementById('sideMenu').classList.toggle('open')
        document.getElementById('sideBar').classList.remove('open')
    }
    const signin = () => {
        document.getElementById('signup').classList.add('open')
    }
    return (
        <>
            <div className="top" id="top">
                <nav>
                    <div onClick={openSideBar} id="menuBtn" className="menuBtn">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <Link className='links' to='/'>
                        <div className="mainLogoBox">
                            <img alt='Style Factory' />
                        </div>
                    </Link>
                    <div className="proFileBtn"></div>
                    {/* <div className="locationAccessBox">
                        <i className="fa fa-map-marker-alt" aria-hidden="true" />
                        <span>Hello</span>
                        <span>Select <span >Your</span> address</span>
                    </div> */}
                    <div className="searchBox">
                        <div className='category'>
                            Category
                        <div className='categoryList'>
                                <li>Fruits1</li>
                                <li>Fruits2</li>
                                <li>Fruits3</li>
                            </div>
                        </div>
                        <input type="text" name="" id="mainSearchField" />
                        <i className="fa fa-search" aria-hidden="true" />
                    </div>
                    <div className="accountBox">
                        <span><span >Hello</span> {store.user == '' ? (<span className='signin' onClick={signin}>Sign In</span>) : (<span className='navName'>{store.user.name}</span>)} </span>
                    </div>
                    <Link className='links' to='/orders'>
                        <div className="orderBox">
                            <i className="fa fa-bags-shopping" aria-hidden="true" />
                            <span>Returns</span>
                            <span>& Orders</span>
                        </div>
                    </Link>
                    <Link className='links' to='/cart'>
                        <div className="cartBox">
                            <span>{store.cart.length}</span>
                            <i className="fa fa-shopping-cart" aria-hidden="true" />
                            <span>Cart</span>
                        </div>
                    </Link>
                </nav>

                <div className="toolBar">
                    <span onClick={openSideMenu}>
                        <span>
                            All
                        </span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg" />
                    </span>
                    <span>
                        <span>
                            Best Products
                        </span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg" />
                    </span>
                    <span>
                        <span>
                            women
                        </span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg" />
                    </span>
                    <span>
                        <span>
                            Men
                        </span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg" />
                    </span>
                    <span>
                        <span>
                            Prime
                        </span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg" />
                    </span>
                    <span>
                        <span>
                            etc
                        </span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg" />
                    </span>
                    <span>
                        <span>
                            Offers
                        </span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/83/Circle-icons-phone.svg" />
                    </span>
                </div>
            </div>
        </>
    );
}

export default NavBar;