import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { authenticate, isAuth } from '../../../helpers/auth'
import ImageUploader from 'react-images-upload'

import './SelectSubCat.css'

const SelectSubCat = ({ stateChanger, cat, ...rest }) => {
    const [state, setState] = useState({
        selectedCategory: cat,
        selectedSubCategory: undefined,
        selectedSubCategoryName: '',
        pictures: [],
        picUrls: [],
        newSubCategoryName: '',
        subCatList: []
    })
    useEffect(() => {
        axios.get(`http://localhost:8082/api/vendor/product/156/getSubCategories?parent=${cat[0]}`)
            .then(result => {
                state.subCatList = []
                result.data.mySubCategories.map(subCat => {
                    let newSubCat = {
                        subCatId: subCat._id,
                        subCatName: subCat.subCategoryName,
                        subCatParent: subCat.subCategoryParent,
                        subCatImage: subCat.subCategoryImage,
                    }
                    state.subCatList.push(newSubCat)
                })
                setState({
                    ...state,
                    subCatList: state.subCatList
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

        state.subCatList.map(subCat => subCat.subCatId == e.target.value ? setState({ ...state, [e.target.name]: e.target.value, selectedSubCategoryName: subCat.subCatName }) : null)

        let i = 0
        while (i < state.subCatList.length) {
            i == id ? document.getElementById(`subCat_label_${i}`).classList.add('selected') : document.getElementById(`subCat_label_${i}`).classList.remove('selected')
            i += 1
        }

    }

    const onSubmit = (e) => {
        if (state.selectedSubCategory == undefined) {
            alert('please select any one sub category to furthure pursued...')
            return
        }
        if (true) {
            document.getElementsByClassName('timeLine2')[0].classList.remove('active')
            document.getElementsByClassName('timeLine2')[1].classList.remove('active')

            document.getElementsByClassName('timeLine2')[0].classList.add('done')
            document.getElementsByClassName('timeLine2')[1].classList.add('done')

            document.getElementsByClassName('timeLine3')[0].classList.add('active')
            document.getElementsByClassName('timeLine3')[1].classList.add('active')

            stateChanger(
                {
                    ...state,
                    ['task']: '3',
                    ['selectedSubCategory']: [state.selectedSubCategory, state.selectedSubCategoryName],
                }
            )
        }
    }

    const makeCat = () => {
        if (state.newSubCategoryName == '') {
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
                    "newSubCategoryName": state.newSubCategoryName,
                    "parent": cat[0],
                    "images": state.picUrls,
                }
                axios.post(`http://localhost:8082/api/vendor/product/156/insertSubCategory`, data)
                    .then(result => {
                        document.getElementsByClassName('addCat')[0].classList.toggle('show')
                        document.getElementsByClassName('add_new')[0].classList.toggle('open')
                        state.subCatList = []
                        result.data.mySubCategories.map(subCat => {
                            let newSubCat = {
                                subCatId: subCat._id,
                                subCatName: subCat.subCategoryName,
                                subCatParent: subCat.subCategoryParent,
                                subCatImage: subCat.subCategoryImage,
                            }
                            state.subCatList.push(newSubCat)
                        })
                        state.pictures = []
                        setState({
                            ...state,
                            subCatList: state.subCatList,
                            pictures: state.pictures,
                            picUrls: [],
                            newSubCategoryName: ''
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
    const addNewSubCat = () => {
        document.getElementsByClassName('addCat')[0].classList.toggle('show')
        document.getElementsByClassName('add_new')[0].classList.toggle('open')
    }
    return (
        <>
            <h1 className="product_for">{cat[1]} /</h1>
            <div className="bottom_btns">
                <button type='button' className='add_new' onClick={addNewSubCat} title={`Add New Subcategory to ${cat[1]}`}>+</button>
                <button type='button' onClick={onSubmit} className='continue_btn' title={state.selectedSubCategory ? `Continue with ${state.selectedSubCategoryName}` : `Please Select SubCategory`}><span className={state.selectedSubCategoryName == '' ? 'hide' : ''}>{state.selectedSubCategoryName}</span><i className='fa fa-arrow-right'></i></button>
            </div>
            <div className="addCat">
                <div className="form-area">
                    <label htmlFor="">Sub Category Name</label>
                    <input type="text" placeholder={`Type...`} value={state.newSubCategoryName} name="newSubCategoryName" onChange={onInputChange} />
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
                    <button onClick={makeCat}>Insert New Sub Category</button>
                </div>
            </div>
            <div className="form-area">
                <div className="select">
                    {
                        state.subCatList.map((data, index) => (
                            <div key={index} className={`option ${index}`}>
                                <label htmlFor={`selectedSubCategory${index}`} id={`subCat_label_${index}`}>{data.subCatName}</label>
                                <input type="radio" name="selectedSubCategory" id={`selectedSubCategory${index}`} value={data.subCatId} onChange={(e) => { onChange(e, index) }} />
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    );
}

export default SelectSubCat;
