import React, { useEffect, useState } from 'react';
import { useStateValue } from '../../../StateProvider/StateProvider';
import axios from 'axios'
import { useHistory } from "react-router-dom";

const Subtotal = props => {
    let history = useHistory();
    const [store, dispatch] = useStateValue();

    const continueToOrder = () => {
        const randomString = Math.random().toString(36).substring(2, 12);
        var nowTiming = new Date();
        // 1 = COD, 2 = UPI
        var paymentType = 1
        var payment
        if (paymentType == 1) {
            payment = {
                paymentType: 1,
                paymentDetail: 'abc'
            }
        }
        if (paymentType == 2) {
            payment = {
                paymentType: 2,
                paymentDetail: {
                    TransitionId: 'abcdefghij'
                }
            }
        }
        let order = {
            // order-id = userId + numberOfOrders + randomString
            orderId: store.orders.length + store.user.id + randomString,
            items: store.cart,
            orderStatus: 1,
            orderPayment: payment,
            orderTime: nowTiming.toUTCString(),
            orderAddress: []
        }

        // Set Current Order
        dispatch({ type: 'SET_CURRENT_ORDER', order: [order] })

        if(store.currentOrder.length == 1){
            history.push(`payment/${order.orderId}`);
        }

        
    }

    return (
        <div className="box subtotal">
            <div className="total">
                Subtotal: ({store.cart.length} items) <span>{store.cartTotal} Rs</span>
            </div>
            <button className='checkoutBtn' onClick={continueToOrder}>Continue</button>
        </div>
    )
}

export default Subtotal