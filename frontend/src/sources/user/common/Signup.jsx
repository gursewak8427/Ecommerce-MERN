import React, { useState } from 'react'
import axios from 'axios'
import './Signup.css'
import { authenticateUser, isAuthUser } from '../../../helpers/auth'
import { useStateValue } from '../../../StateProvider/StateProvider';

import firebase from "../firebase/firebase-config.js";

const Signup = (props) => {
    const [store, dispatch] = useStateValue();

    const [number, setNumber] = useState('');
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [pass1, setPass1] = useState('');
    const [pass2, setPass2] = useState('');
    const [loginNum, setLoginNum] = useState('');
    const [loginPass, setLoginPass] = useState('');

    const [fnumber, setFNumber] = useState('');
    const [fcode, setFCode] = useState('');
    const [fpass1, setFPass1] = useState('');
    const [fpass2, setFPass2] = useState('');
    const [captcha, setCaptcha] = useState(false);


    // login
    const setUpRecaptcha = () => {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': (response) => {
            },
            'expired-callback': () => {
                // Response expired. Ask user to solve reCAPTCHA again.
                // ...
            }
        });
    };

    const onSignInSubmit = (e) => {
        document.getElementById('r1').style.display = "none"
        setUpRecaptcha();
        setCaptcha(true)
        let phoneNumber = "+91" + number;
        console.log(phoneNumber);
        let appVerifier = window.recaptchaVerifier
        firebase
            .auth()
            .signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                window.confirmationResult = confirmationResult;
                window.recaptchaVerifier.clear()
                setCaptcha(false)
                document.getElementById('r1').style.display = "block"
                // alert('otp send')
                toggleFields()
            })
            .catch(function (error) {
                document.getElementById('r1').style.display = "block"
                window.recaptchaVerifier.clear()
                setCaptcha(false)
                console.log(error);
                alert('something went wrong - or - change number - or - Network issue')
            });
    };

    // login end

    // toggle number and otp fileds
    const toggleFields = () => {
        document.getElementById('numberField').classList.toggle('closeField')
        document.getElementById('codeField').classList.toggle('openField')
    }
    const toggleFieldsForgot = () => {
        document.getElementById('forgotField').classList.add('open');
        document.getElementById('codeFieldForgot').classList.remove('open');
    }
    const sendCode = () => {
        if (number == '') {
            alert('Number is Required');
        } else {
            onSignInSubmit();
            // ===
        }
    }
    const verifyCode = () => {
        if (code == '') {
            alert('Code Required....')
        } else {

            let otpInput = code;
            let optConfirm = window.confirmationResult;
            // console.log(codee);
            optConfirm
                .confirm(otpInput)
                .then(function (result) {
                    document.getElementById('codeField').classList.toggle('closeField')
                    document.getElementById('passwordField').classList.toggle('openField')
                })
                .catch(function (error) {
                    console.log(error);
                    alert("Incorrect OTP");
                });

        }
    }
    const closeRegister = () => {
        document.getElementById('signup').classList.remove('open')

        // reset fields
        document.getElementById('numberField').classList.remove('closeField')
        document.getElementById('codeField').classList.remove('openField')
        document.getElementById('codeField').classList.remove('closeField')
        document.getElementById('passwordField').classList.remove('openField')
        // and set number to empty
        setNumber('')
        setCode('')
        setPass1('')
        setPass2('')

    }
    const closeLogin = () => {
        document.getElementById('loginField').classList.remove('close');
        document.getElementById('forgotField').classList.remove('open');

        document.getElementById('passwordFieldForgot').classList.remove('open');
        document.getElementById('codeFieldForgot').classList.remove('open');

        document.getElementById('login').classList.remove('open');

        setFNumber('')
        setFCode('')
        setFPass1('')
        setFPass2('')
    }
    const close = () => {
        document.getElementById('r1').style.display = "block"
        console.log('captcha', captcha)
        if (captcha) {
            window.recaptchaVerifier.clear()
            setCaptcha(false)
        }
        closeLogin();
        closeRegister();
    }
    const setPassword = () => {
        let data = { name, number, password: pass1 }

        axios.post(`http://localhost:8082/api/user/auth/156/userSignup`, data)
            .then(result => {
                console.log(result)
                authenticateUser(result, () => {
                    setName('')
                    setNumber('')
                    setPass1('')
                    setPass2('')
                })
                // close signup form
                close();
            })
            .catch(err => {
                console.log(err.response.data.error)
            })

    }
    const openLoginBox = () => {
        closeRegister();
        document.getElementById('login').classList.add('open');
        document.getElementById('loginField').classList.remove('close');
        document.getElementById('forgotField').classList.remove('open');
    }
    const openReigsterBox = () => {
        closeLogin();
        document.getElementById('signup').classList.add('open')
    }
    const openForgotBox = () => {
        document.getElementById('loginField').classList.add('close');
        document.getElementById('forgotField').classList.add('open');
    }
    const openCodeForgot = () => {
        document.getElementById('forgotField').classList.remove('open');
        document.getElementById('codeFieldForgot').classList.add('open');
    }
    const verifyCodeForgot = () => {
        document.getElementById('codeFieldForgot').classList.remove('open');
        document.getElementById('passwordFieldForgot').classList.add('open');
    }
    const setNewPassword = () => {
        alert('New password is now setting....')
    }
    const now_login = () => {
        let data = {
            phone: loginNum,
            password: loginPass,
        }
        axios.post(`http://localhost:8082/api/user/auth/156/userSignin`, data)
            .then(result => {
                authenticateUser(result, () => {
                    setLoginNum('')
                    setLoginPass('')
                })
                dispatch({
                    type: 'LOGIN_USER',
                    data: result.data.user
                })
                axios.post(`http://localhost:8082/api/user/cart/156/get`, { userId: result.data.user.id })
                    .then(results => {
                        dispatch({
                            type: 'SET_CART',
                            items: results.data.cart
                        })
                    })
                    .catch(err => {
                        console.log(err.response.data.error)
                    })

                if (store.cart_pending != '') {
                    var item = store.cart_pending
                    item.userId = result.data.user.id
                    axios.post(`http://localhost:8082/api/user/cart/156/add`, item)
                        .then(result => {
                            dispatch({
                                type: 'ADD_TO_CART',
                                item
                            })
                        })
                        .catch(err => {
                            console.log(err.response.data.error)
                        })
                }


                // close signup form
                close();
            })
            .catch(err => {
                console.log(err.response.data.error)
            })
    }
    return (
        <>
            <div className="signup" id="signup">
                <div className="crose" onClick={close}>X<i className="fa fa-crose"></i></div>


                <div id="numberField">
                    <label htmlFor="" className='main'>Register For <b> <span>S</span>tyle <span>F</span>actory</b></label>
                    <div className="form-field">
                        <label htmlFor="">Enter Your Number</label>
                        <input type="text" value={number} onChange={(e) => setNumber(e.target.value)} />
                    </div>
                    <div id="recaptcha-container"></div>
                    <div className="form-field">
                        <button type="button" id={`r1`} onClick={sendCode}>Send OTP</button>
                    </div>
                    <span className='main'>
                        Already a Member? <span onClick={openLoginBox}>Login Here</span>
                    </span>
                </div>

                <div id="codeField">
                    <label htmlFor="">One Time Password(OTP) Verification <span>{number}<span onClick={toggleFields}> change number?</span></span> </label>
                    <div className="form-field">
                        <label htmlFor="">Enter OTP</label>
                        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <button type="button" onClick={verifyCode}>Verify OTP</button>
                    </div>
                </div>

                <div id="passwordField">
                    <label htmlFor="">Set Password</label>
                    <div className="form-field">
                        <label htmlFor="">Enter username</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="">Enter Password</label>
                        <input type="text" value={pass1} onChange={(e) => setPass1(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="">Enter Confirm Password</label>
                        <input type="text" value={pass2} onChange={(e) => setPass2(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <button type="button" onClick={setPassword} >Set</button>
                    </div>
                </div>

            </div>
            <div className="login" id="login">
                <div className="crose" onClick={close}>X<i className="fa fa-crose"></i></div>

                <div id="loginField">
                    <label htmlFor="" className='main'>Login For <b> <span>S</span>tyle <span>F</span>actory</b></label>
                    <div className="form-field">
                        <label htmlFor="">Enter Your Number</label>
                        <input type="text" value={loginNum} onChange={(e) => setLoginNum(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="">Enter Your Password</label>
                        <input type="text" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <button type="button" onClick={now_login}>Login</button>
                    </div>
                    <span className='main'>
                        <span onClick={openForgotBox}>Forgot password</span>
                        <br />
                        Not an Member? <span onClick={openReigsterBox}>Register Here</span>
                    </span>
                </div>

                <div id="forgotField">
                    <label htmlFor="" className='main'>Forgot Password</label>
                    <div className="form-field">
                        <label htmlFor="">Enter Your Number</label>
                        <input type="text" value={fnumber} onChange={(e) => setFNumber(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <button type="button" onClick={openCodeForgot}>Send Code</button>
                    </div>
                    <span className='main'>
                        Not want to forgot?<span onClick={openLoginBox}> Login Here</span>
                    </span>
                </div>

                <div id="codeFieldForgot">
                    <label htmlFor="">To Forgot, One Time Password(OTP) Verification <span>{fnumber}<span onClick={toggleFieldsForgot}> change number?</span></span> </label>
                    <div className="form-field">
                        <label htmlFor="">Enter OTP</label>
                        <input type="text" value={fcode} onChange={(e) => setFCode(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <button type="button" onClick={verifyCodeForgot}>Verify OTP</button>
                    </div>
                </div>

                <div id="passwordFieldForgot">
                    <label htmlFor="">Set New Password</label>
                    <div className="form-field">
                        <label htmlFor="">Enter New Password</label>
                        <input type="text" value={fpass1} onChange={(e) => setFPass1(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <label htmlFor="">Enter Confirm Password</label>
                        <input type="text" value={fpass2} onChange={(e) => setFPass2(e.target.value)} />
                    </div>
                    <div className="form-field">
                        <button type="button" onClick={setNewPassword} >Set</button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Signup;
