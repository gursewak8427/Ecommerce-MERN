import React, { useCallback } from 'react';

import './SideBar.css'

const SideBar = (props) => {
    const openSideBar = () => {
        document.getElementById('menuBtn').classList.toggle('open')
        document.getElementById('sideBar').classList.toggle('open')
        document.getElementById('sideMenu').classList.remove('open')
    }
    const openSideMenu = () => {
        document.getElementById('sideMenu').classList.toggle('open')
        document.getElementById('sideBar').classList.remove('open')
    }
    return (
        <>
            <aside id="sideBar" className=''>
                <div className="data">
                   {/* data.... */}
                </div>
                <div className="clickAble" onClick={openSideBar}>
                </div>
            </aside>

            <aside id="sideMenu" className=''>
                <div className="data">
                    <li className='list' id='list1' onClick={()=>document.getElementById('list1').classList.toggle('open')}>
                        <label htmlFor="">Cat-1</label>
                        <ul>
                            <li>sub-cat-1</li>
                            <li>sub-cat-2</li>
                            <li>sub-cat-3</li>
                        </ul>
                    </li>
                    <li className='list' id='list2' onClick={()=>document.getElementById('list2').classList.toggle('open')}>
                        <label htmlFor="">Cat-2</label>
                        <ul>
                            <li>sub-cat-1</li>
                            <li>sub-cat-2</li>
                            <li>sub-cat-3</li>
                        </ul>
                    </li>
                    <li className='list' id='list3' onClick={()=>document.getElementById('list3').classList.toggle('open')}>
                        <label htmlFor="">Cat-3</label>
                        <ul>
                            <li>sub-cat-1</li>
                            <li>sub-cat-2</li>
                            <li>sub-cat-3</li>
                        </ul>
                    </li>
                </div>
                <div className="clickAble" onClick={openSideMenu}></div>
            </aside>

        </>
    );
}

export default SideBar