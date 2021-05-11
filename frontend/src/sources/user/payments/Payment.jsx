import React, { useEffect, useState } from 'react';
import { GoogleComponent } from 'react-google-location'
import { useStateValue } from '../../../StateProvider/StateProvider';
import { useHistory } from "react-router-dom";
import axios from 'axios'
import './Payment.css'
import { KEYS } from '../../keys';

const Payment = (props) => {
    let history = useHistory();
    const API_KEY = 'AIzaSyAb34F6xmw0e6-MBpAdNSvc6iUGNumDKdQ'

    const [store, dispatch] = useStateValue();

    const [state, setState] = useState({
        place: null,
    })

    useEffect(() => {
        if (store.currentOrder.length == 0) { history.push(`/`) }
    }, [])

    const options = {
        key: 'rzp_test_GwXSBqi5xr4Ca2',
        amount: parseInt(store?.currentOrder[0]?.orderAmount) * 100,
        name: 'Style Factory',
        description: 'Best of Luck',
        image: 'https://cdn.razorpay.com/logos/7K3b6d18wHwKzL_medium.png',
        handler: function (response) {
            console.log('success')
            var ordr = store.currentOrder[0]
            ordr.orderPayment = {
                paymentType: 2,
                paymentDetail: {
                    TransitionId: 'abcdefghij'
                }
            }
            // order to database
            axios.post(`${KEYS.NODE_URL}/api/user/order/156/add`, { userId: store.user.id, order: ordr })
                .then(result => {

                    // decrease quantity of products
                    ordr.items.map(item => {
                        let var_id = item.productType == 1 ? item.varient._id : 0
                        axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/setQty?p_id=${item.id}&var_id=${var_id}`, { 'pt': item.productType, 'qty': item.itemQty }).catch(err => console.log(err))
                    })
                    dispatch({ type: 'SET_ORDERS', orders: result.data.orders })
                    // empty cart after order
                    axios.post(`${KEYS.NODE_URL}/api/user/cart/156/set`, { userId: store.user.id, cart: [] })
                        .then(result => {
                            dispatch({ type: 'SET_CART', items: [] })
                            dispatch({ type: 'SET_CURRENT_ORDER', order: [] })
                            history.push(`/orders`);
                        })
                        .catch(err => console.log(err))

                })
                .catch(err => {
                    console.log(err.response.data.error)
                })

            // alert(response.razorpay_payment_id);
            // alert(response.razorpay_order_id);
            // alert(response.razorpay_signature)
        },
        prefill: {
            name: 'Gaurav',
            contact: '9999999999',
            email: 'demo@demo.com'
        },
        notes: {
            address: 'some address'
        },
        theme: {
            color: '#09c28a',
            hide_topbar: false
        }
    };
    const orderCOD = () => {
        var ordr = store.currentOrder[0]
        ordr.orderPayment = {
            paymentType: 1,
            paymentDetail: 'nothing'
        }
        axios.post(`${KEYS.NODE_URL}/api/user/order/156/add`, { userId: store.user.id, order: ordr })
            .then(result => {

                // decrease quantity of products
                ordr.items.map(item => {
                    let var_id = item.productType == 1 ? item.varient._id : 0
                    axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/setQty?p_id=${item.id}&var_id=${var_id}`, { 'pt': item.productType, 'qty': item.itemQty }).catch(err => console.log(err))
                })
                dispatch({ type: 'SET_ORDERS', orders: result.data.orders })
                // empty cart after order
                axios.post(`${KEYS.NODE_URL}/api/user/cart/156/set`, { userId: store.user.id, cart: [] })
                    .then(result => {
                        dispatch({ type: 'SET_CART', items: [] })
                        dispatch({ type: 'SET_CURRENT_ORDER', order: [] })
                        history.push(`/orders`);
                    })
                    .catch(err => console.log(err))

            })
            .catch(err => {
                console.log(err)
            })
    }
    const openPayModal = () => {
        let order = store.currentOrder
        order[0].orderAddress = state.place
        // Set Current Order
        dispatch({ type: 'SET_CURRENT_ORDER', order })

        var rzp1 = new window.Razorpay(options);
        rzp1.on('payment.failed', function (response) {
            console.log('failed')
            // alert(response.error.code);
            // alert(response.error.description);
            // alert(response.error.source);
            // alert(response.error.step);
            // alert(response.error.reason);
            // alert(response.error.metadata.order_id);
            // alert(response.error.metadata.payment_id);
        });
        rzp1.open();
    };
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <>
            <div className="addressContainer">
                <h3>Address of Order's Delivery</h3>
                <div className="right">
                    <GoogleComponent
                        apiKey={API_KEY}
                        language={'en'}
                        country={'country:in'}
                        coordinates={true}
                        onChange={(e) => { setState({ ...state, place: e }) }}
                    />
                    {(state.place == null) || (state?.place?.place == "") ? <button className='disabled' onClick={openPayModal}>Checkout</button> : <button onClick={openPayModal}>Checkout</button>}
                    {(state.place == null) || (state?.place?.place == "") ? <button className='disabled' onClick={orderCOD}>CASH ON DELIVERY</button> : <button onClick={orderCOD}>CASH ON DELIVERY</button>}
                </div>
            </div>
        </>
    );
};

export default Payment