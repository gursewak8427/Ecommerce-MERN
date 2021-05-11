import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import ImageUploader from 'react-images-upload'

import './SelectCat.css'
import { KEYS } from '../../keys';

const SelectCat = ({ stateChanger, ...rest }) => {
    const [state, setState] = useState({
        selectedCategory: undefined,
        selectedCategoryName: '',
        catList: [],
        pictures: [],
        picUrls: [],
        newCategoryName: '',
    })
    useEffect(() => {
        axios.get(`${KEYS.NODE_URL}/api/vendor/product/156/getCategories`)
            .then(result => {
                state.catList = []
                result.data.myCategories.map(cat => {
                    let newCat = {
                        catId: cat._id,
                        catName: cat.categoryName,
                        catImage: cat.categoryImage,
                    }
                    state.catList.push(newCat)
                })
                setState({
                    ...state,
                    catList: state.catList
                });

                // document.getElementById(`updateVarBtn${var_id}`).disabled = false
            })
            .catch(err => {
                // document.getElementById(`updateVarBtn${var_id}`).disabled = false
                console.log(err)
            })
    }, [])
    const onDrop = picture => {
        setState({
            ...state,
            pictures: picture
        });
    }
    const onInputChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }
    const onChange = (e, id) => {
        state.catList.map(cat => (
            cat.catId == e.target.value ? setState({ ...state, [e.target.name]: e.target.value, selectedCategoryName: cat.catName }) : null
        ))

        var i = 0
        while (i < state.catList.length) {
            if (i == id) {
                document.getElementById(`cat_label_${i}`).classList.add('selected')
            } else {
                document.getElementById(`cat_label_${i}`).classList.remove('selected')
            }
            i += 1
        }
    }

    const onSubmit = (e) => {
        if (state.selectedCategory == undefined) {
            alert('please select any one category to furthure pursued...')
            return
        }
        if (true) {
            document.getElementsByClassName('timeLine1')[0].classList.remove('active')
            document.getElementsByClassName('timeLine1')[1].classList.remove('active')

            document.getElementsByClassName('timeLine1')[0].classList.add('done')
            document.getElementsByClassName('timeLine1')[1].classList.add('done')

            document.getElementsByClassName('timeLine2')[0].classList.add('active')
            document.getElementsByClassName('timeLine2')[1].classList.add('active')

            stateChanger(
                {
                    ...state,
                    ['task']: '2',
                    ['selectedCategory']: [state.selectedCategory, state.selectedCategoryName],
                }
            )
        }
    }
    const makeCat = () => {
        if (state.newCategoryName == '') {
            alert('Plese Enter New Category Name')
            return
        }
        let uploadPromises = state.pictures.map(image => {
            let data = new FormData();
            data.append('file', image);
            data.append('upload_preset', 'eshoppyzone');
            data.append('cloud_name', 'mycloud8427');
            return axios.post(`https://api.cloudinary.com/v1_1/mycloud8427/image/upload/`, data)
        })
        axios.all(uploadPromises)
            .then(results => {
                state.picUrls = []
                results.map(img => {
                    state.picUrls.push(img.data.url)
                    setState({
                        ...state,
                        picUrls: state.picUrls,
                    })
                })
                let data = {
                    "newCategoryName": state.newCategoryName,
                    "images": state.picUrls,
                }
                axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/insertCategory`, data)
                    .then(result => {
                        document.getElementsByClassName('addCat')[0].classList.toggle('show')
                        document.getElementsByClassName('add_new')[0].classList.toggle('open')
                        state.catList = []
                        result.data.myCategories.map(cat => {
                            let newCat = {
                                catId: cat._id,
                                catName: cat.categoryName,
                                catImage: cat.categoryImage,
                            }
                            state.catList.push(newCat)
                        })
                        state.pictures = []
                        setState({
                            ...state,
                            catList: state.catList,
                            pictures: state.pictures,
                            picUrls: [],
                            newCategoryName: ''
                        });
                        // document.getElementById(`updateVarBtn${var_id}`).disabled = false
                    })
                    .catch(err => {
                        // document.getElementById(`updateVarBtn${var_id}`).disabled = false
                        console.log(err)
                    })
            })
            .catch(e => {
                console.log('error', e)
                // document.getElementById(`updateVarBtn${var_id}`).disabled = false
            })
    }
    const addNewCat = () => {
        document.getElementsByClassName('addCat')[0].classList.toggle('show')
        document.getElementsByClassName('add_new')[0].classList.toggle('open')
    }
    return (
        <>
            <div className="bottom_btns">
                <button type='button' className='add_new' onClick={addNewCat}>+</button>
                <button type='button' onClick={onSubmit} className='continue_btn' title='continue'><span className={state.selectedCategoryName == '' ? 'hide' : ''}>{state.selectedCategoryName}</span><i className='fa fa-arrow-right'></i></button>
            </div>
            <div className="addCat">
                <div className="form-area">
                    <label htmlFor="">Category Name</label>
                    <input type="text" placeholder={`Type...`} value={state.newCategoryName} name="newCategoryName" onChange={onInputChange} />
                </div>
                <div className="form-area">
                    <ImageUploader
                        withPreview={true}
                        onChange={onDrop}
                        imgExtension={['.jpg', '.png']}
                        maxFileSize={5242880}
                        buttonText={'Upload New Images'}
                        singleImage={true}
                    />
                </div>
                <div className="form-area">
                    <button onClick={makeCat}>Insert New Category</button>
                </div>
            </div>
            <div className="form-area">
                <div className="select">
                    {
                        state.catList.length == 0 ? <span style={{ color: "white", margin: "10px 0" }}>No Category Available, create New Category now from plus(+) sign bottom</span> : null
                    }
                    {
                        state.catList.map((data, index) => (
                            <div key={index} className={`option ${index}`}>
                                <label htmlFor={`selectedCategory${index}`} id={`cat_label_${index}`}>{data.catName}</label>
                                <input type="radio" name="selectedCategory" id={`selectedCategory${index}`} value={data.catId} onChange={(e) => { onChange(e, index) }} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default SelectCat;
