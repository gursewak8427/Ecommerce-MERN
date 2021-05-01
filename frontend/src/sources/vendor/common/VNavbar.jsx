import React from 'react';

import './VNavbar.css'

function VNavbar() {
    const toggleSide = () => {
        document.getElementsByClassName('sideToggle')[0].classList.toggle('open')
    }
    const toggleProfileMenu = () => {
        document.getElementsByClassName('profileBtn')[0].classList.toggle('open')
    }
    return (
        <>  
            <nav className='v-nav'>
                <div className="sideToggle" onClick={toggleSide}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="profileBtn" onClick={toggleProfileMenu}>
                    <div className="list open">
                        <li><i className="far fa-user"></i><span>Profile</span></li>
                        <li><i className="fas fa-power-off"></i><span>Logout</span></li>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default VNavbar;
