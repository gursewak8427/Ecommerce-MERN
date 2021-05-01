import React, { useEffect, useState } from 'react';
import { Redirect, Link, useParams } from 'react-router-dom'
import axios from 'axios'
import ImageUploader from 'react-images-upload'
import { ToastContainer, toast } from 'react-toastify'
import { authenticate, isAuth } from '../../../helpers/auth'

import './AddVarient.css'

function AddVarient({ stateChanger, finalCat, finalSubCat, finalProduct, ...rest }) {
    const [state, setState] = useState({
        finalProduct: finalProduct,
        productType: 0,
        attributes: [],
        varients: [],
        varientList: [],
        pictures: [],
        ppictures: [],
        CoverPictures: [],
        picUrls: [],
        varPrices: [],
        simplePrice: '',
        simpleMrp: '',
        coverImagesList: [],


        // product-detail
        productName: '',
        productBrand: '',
        productShortDisc: '',
        productDisc: '',
        productkeywords: '',
        productStatus: 0,
        simpleImageList: []
    })
    const { id } = useParams()
    useEffect(() => {
        axios.post(`http://localhost:8082/api/vendor/product/156/getProduct?p_id=${state.finalProduct[0]}`)
            .then(result => {
                axios.get(`http://localhost:8082/api/vendor/product/156/getAttribute`)
                    .then(resultAttr => {
                        state.varPrices = []
                        result.data.myProduct.productVarients.map(obj => {
                            state.varPrices.push(obj.general.price)
                        })
                        state.coverImagesList = []
                        result.data.myProduct.CoverImages.map(img => {
                            state.coverImagesList.push(img)
                        })
                        if (id) {
                            setState({
                                ...state,
                                productName: result.data.myProduct.productName,
                                productBrand: result.data.myProduct.productBrand,
                                productShortDisc: result.data.myProduct.ProductShortDisc,
                                productDisc: result.data.myProduct.productDisc,
                                productkeywords: result.data.myProduct.productKeywords,
                                productStatus: result.data.myProduct.productStatus,

                                attributes: resultAttr.data.myAttributes,
                                varients: [],
                                varPrices: [],
                                varPrice: state.varPrices,
                                coverImagesList: state.coverImagesList,
                                varientList: result.data.myProduct.productVarients,
                                productType: result.data.myProduct.productType,
                                simplePrice: result.data.myProduct?.productPricing?.price,
                                simpleMrp: result.data.myProduct?.productPricing?.mrp,
                                simpleImageList: result.data.myProduct.productImages
                            })
                            result.data.myProduct.productStatus == 1 ? (
                                document.getElementById('proActiveStat').checked = true
                            ) : result.data.myProduct.productStatus == 0 ? (
                                document.getElementById('proDeactiveStat').checked = true
                            ) : (
                                document.getElementById('proDeactiveStat').checked = true
                            )
                        } else {
                            setState({
                                ...state,
                                attributes: resultAttr.data.myAttributes,
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                    })
            }).catch(err => {
                console.log(err)
            })
    }, [])
    const onChange = (e) => {
        if (e.target.name == "productType") {
            axios.post(`http://localhost:8082/api/vendor/product/156/updateProductType?p_id=${state.finalProduct[0]}`, { 'pt': e.target.value })
                .then(result => {
                    console.log(result)
                }).catch(err => {
                    console.log(err)
                })
        }
        setState({ ...state, [e.target.name]: e.target.value })
    }
    const setAttr = (e, id) => {
        let new_value = e.target.value
        if (state.varients.length == 0) {
            if (new_value == "") {
                return
            }
            let new_attr = {
                attr_id: id,
                value: new_value
            }
            state.varients.push(new_attr)
            setState({ ...state, varients: state.varients })
            return
        }
        let i = 0
        var status = true
        while (i < state.varients.length) {
            if (state.varients[i].attr_id == id) {
                if (new_value == "") {
                    state.varients.splice(i, 1);
                    return
                }
                state.varients[i].value = new_value
                setState({ ...state, varients: state.varients })
                status = false
                return
            }
            i += 1
        }
        if (status) {
            if (new_value == "") {
                return
            }
            let new_attr = {
                attr_id: id,
                value: new_value
            }
            state.varients.push(new_attr)
            setState({ ...state, varients: state.varients })
        }
    }
    const makeVarient = () => {
        if (state.varients.length == 0) {
            alert('plz select atleast one attribute of variation . . .')
            return
        }
        axios.post(`http://localhost:8082/api/vendor/product/156/insertProductVarient?p_id=${state.finalProduct[0]}`, { varients: state.varients })
            .then(result => {
                setState({
                    ...state,
                    varients: [],
                    varPrices: []
                });
                state.varPrices = []
                result.data.myVarients.map(obj => {
                    state.varPrices.push(obj.general.price)
                })
                setState({ ...state, varPrice: state.varPrices, varientList: result.data.myVarients })
            })
            .catch(err => {
                console.log(err)
            })
    }
    const getAttrName = (id) => {
        for (let i = 0; i < state.attributes.length; i += 1) {
            if (state.attributes[i]._id == id) {
                return state.attributes[i].attribute
            }
        }
    }
    const openGeneral = (id) => {
        document.getElementsByClassName(id)[0].classList.toggle('open')
    }

    const onDrop = picture => {
        setState({
            ...state,
            pictures: picture
        });
    }
    const onImgDrop = picture => {
        setState({
            ...state,
            ppictures: picture
        });
    }
    const onCoverDrop = picture => {
        setState({
            ...state,
            CoverPictures: picture
        });
    }
    const updateVar = (var_id, indexx) => {
        // document.getElementById(`updateVarBtn${var_id}`).disabled = true
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
                    "price": state.varPrice[indexx],
                    "images": state.picUrls,
                    'pt': state.productType
                }
                axios.post(`http://localhost:8082/api/vendor/product/156/updateProductVarient?p_id=${state.finalProduct[0]}&var_id=${var_id}`, data)
                    .then(result => {
                        state.pictures = []
                        setState({
                            ...state,
                            pictures: state.pictures,
                            picUrls: [],
                            varPrice: [],
                            varientList: []
                        });
                        state.varPrices = []
                        result.data.myVarients.map(obj => {
                            state.varPrices.push(obj.general.price)
                        })
                        setState({ ...state, varPrice: state.varPrices, varientList: result.data.myVarients })
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
    const onPriceChange = (e, index) => {
        state.varPrices[index] = e.target.value
        setState({ ...state, varPrice: state.varPrices });

    }
    const saveSimpleProduct = () => {
        let uploadPromises = state.ppictures.map(image => {
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
                    "price": state.simplePrice,
                    "mrp": state.simpleMrp,
                    'pt': state.productType, // pt = product Type :)
                    "images": state.picUrls,
                }
                axios.post(`http://localhost:8082/api/vendor/product/156/updateProductVarient?p_id=${state.finalProduct[0]}`, data)
                    .then(result => {
                        setState({
                            ...state,
                            simplePrice: result.data.myProduct.productPricing.price,
                            simpleMrp: result.data.myProduct.productPricing.mrp,
                            simpleImageList: result.data.myProduct.productImages,
                            picUrls: []
                        });
                    })
                    .catch(err => {
                        console.log(err)
                    })
            })
            .catch(err => {
                console.log(err)
            })
    }
    const uploadCoverImages = () => {
        if (state.CoverPictures.length == 0) {
            alert('plz select atleast one image')
            return
        }
        let uploadPromises = state.CoverPictures.map(image => {
            let data = new FormData();
            data.append('file', image);
            data.append('upload_preset', 'eshoppyzone');
            data.append('cloud_name', 'mycloud8427');
            return axios.post(`https://api.cloudinary.com/v1_1/mycloud8427/image/upload/`, data)
        })
        axios.all(uploadPromises)
            .then(results => {
                console.log(results)
                state.picUrls = []
                results.map(img => {
                    state.picUrls.push(img.data.url)
                    setState({
                        ...state,
                        picUrls: state.picUrls,
                    })
                })
                let data = {
                    "images": state.picUrls,
                }
                axios.post(`http://localhost:8082/api/vendor/product/156/updateCoverImages?p_id=${state.finalProduct[0]}`, data)
                    .then(result => {
                        state.CoverPictures = []
                        state.coverImagesList = []
                        state.picUrls = []
                        result.data.myProduct.CoverImages.map(img => {
                            state.coverImagesList.push(img)
                        })
                        setState({
                            ...state,
                            CoverPictures: state.CoverPictures,
                            coverImagesList: state.coverImagesList
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
    const onUpdate = () => {
        var myProduct = {
            "_id": state.finalProduct[0],
            "parents": {
                "category": finalCat[0],
                "subCategory": finalSubCat[0]
            },
            "productName": state.productName,
            "productBrand": state.productBrand,
            "productShortDisc": state.productShortDisc,
            "productDisc": state.productDisc,
            "productKeywords": state.productkeywords,
            "productStatus": state.productStatus,
        }
        // upload product and get product id
        axios.post(`http://localhost:8082/api/vendor/product/156/updateProduct`, { myProduct })
            .then(result => {
                setState({
                    ...state,
                    productName: result.data.product.productName,
                    productBrand: result.data.product.productBrand,
                    productShortDisc: result.data.product.productShortDisc,
                    productDisc: result.data.product.productDisc,
                    productkeywords: result.data.product.productKeywords,
                    productStatus: result.data.product.productStatus,
                    finalProduct: [result.data.product._id, result.data.product.productName]
                })
                alert('update Successfully')
            })
            .catch(err => {
                console.log(err)
            })
    }
    const deleteVarImage = (pId, varId, imgId) => {
        let data = { pId, varId, imgId }
        // upload product and get product id
        axios.post(`http://localhost:8082/api/vendor/product/156/deleteVarImage`, data)
            .then(result => {
                setState({
                    ...state,
                    varPrice: [],
                    varientList: []
                });
                state.varPrices = []
                result.data.myProduct.productVarients.map(obj => {
                    state.varPrices.push(obj.general.price)
                })
                setState({ ...state, varPrice: state.varPrices, varientList: result.data.myProduct.productVarients })
            })
            .catch(err => {
                console.log(err)
            })
    }
    const deleteSimpleImage = (pId, imgId) => {
        let data = { pId, imgId }
        // upload product and get product id
        axios.post(`http://localhost:8082/api/vendor/product/156/deleteSimpleImage`, data)
            .then(result => {
                setState({
                    ...state,
                    simpleImageList: result.data.myProduct.productImages
                });
            })
            .catch(err => {
                console.log(err)
            })
    }
    return (
        <>
            <h1 className="product_for">{finalCat[1]} / {finalSubCat[1]} / {state.finalProduct[1]}</h1>
            {
                id ? (
                    <div className="form-product form-general">
                        <label htmlFor="productName">[ General details ]</label>
                        <div className="form-area">
                            <label htmlFor="productName">Product Name</label>
                            <input type="text" name="productName" id="productName" value={state.productName} onChange={onChange} />
                        </div>
                        <div className="form-area">
                            <label htmlFor="productBrand">Product Brand</label>
                            <input type="text" name="productBrand" id="productBrand" value={state.productBrand} onChange={onChange} />
                        </div>
                        <div className="form-area">
                            <label htmlFor="productShortDisc">Product Short Discription</label>
                            <input type="text" name="productShortDisc" id="productShortDisc" value={state.productShortDisc} onChange={onChange} />
                        </div>
                        <div className="form-area">
                            <label htmlFor="productDisc">Product Discription</label>
                            <input type="text" name="productDisc" id="productDisc" value={state.productDisc} onChange={onChange} />
                        </div>
                        <div className="form-area">
                            <label htmlFor="productkeywords">Product Keywords <small><i>(#keyword1, #keyword2, ....)</i></small></label>
                            <input type="text" name="productkeywords" id="productkeywords" value={state.productkeywords} onChange={onChange} />
                        </div>
                        <div className="form-area radio">
                            <label htmlFor="">Product Status</label>
                            <div>
                                <input type="radio" value='1' name="productStatus" id="proActiveStat" onChange={onChange} />
                                <label htmlFor="proActiveStat">Active</label>
                            </div>
                            <div>
                                <input type="radio" value='0' name="productStatus" id="proDeactiveStat" onChange={onChange} />
                                <label htmlFor="proDeactiveStat">Deactive</label>
                            </div>
                        </div>
                        <button onClick={onUpdate}>Update</button>
                    </div>
                ) : null
            }
            <div className="form-general">
                <label htmlFor="productName">[ Variations ]</label>
                <div className="generalProduct">
                    <div className="left">
                        <div className="form-area">
                            <label htmlFor="">Product Type</label>
                            <select name="productType" value={state.productType} onChange={onChange}>
                                <option value="0">Simple Product</option>
                                <option value="1">Variable Product</option>
                            </select>
                        </div>
                        {state.productType == 0 ? (
                            <>
                                <div className="form-area mt-50">
                                    {
                                        state.simpleImageList.length == 0 ? (
                                            <p>No Images, Please Upload Images for Product</p>
                                        ) : (
                                            <div className="pImgList">
                                                {
                                                    state.simpleImageList.map((img, i) => (
                                                        <div className="img">
                                                            <div className="delete" onClick={() => { deleteSimpleImage(finalProduct[0], i) }}>x</div>
                                                            <img src={img} alt="" />
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                                <div className="form-area mt-50">
                                    <div className="productImgs">
                                        <ImageUploader
                                            withPreview={true}
                                            onChange={onImgDrop}
                                            imgExtension={['.jpg', '.png']}
                                            maxFileSize={5242880}
                                            buttonText={'Upload New Images'}
                                        />
                                    </div>
                                </div>
                                <div className="form-area mt-50">
                                    <label htmlFor="">MRP</label>
                                    <input type="text" name='simpleMrp' value={state.simpleMrp} onChange={onChange} />
                                </div>
                                <div className="form-area">
                                    <label htmlFor="">Price</label>
                                    <input type="text" name='simplePrice' value={state.simplePrice} onChange={onChange} />
                                </div>
                                <button onClick={saveSimpleProduct}>Save</button>
                            </>
                        ) : state.productType == 1 ? (
                            <>
                                <div className="form-area blackBg">
                                    <label htmlFor="">
                                        <span>
                                            Select Attributes
                                        </span>
                                        <button onClick={makeVarient}>Add Varient</button>
                                    </label>
                                    <div className="data">
                                        {
                                            state.attributes.map((obj) => (
                                                <select key={obj._id} onChange={(e) => { setAttr(e, obj._id) }}>
                                                    <option value="">Select {obj.attribute}</option>
                                                    {
                                                        obj.values.map((value, key) => (
                                                            <option key={key} value={value}>{value}</option>
                                                        ))
                                                    }
                                                </select>
                                            ))
                                        }
                                    </div>
                                </div>

                                <div className="varientList">
                                    {state.varientList.map((obj, index) => (
                                        <div key={obj._id} className="sub-list">
                                            <div className="topList">
                                                <span>
                                                    {
                                                        obj.varienteAttributes.map((a, indexx) => (
                                                            <span key={indexx}>
                                                                {obj.varienteAttributes.length != (indexx + 1) ? (
                                                                    <>
                                                                        {`${a.value}, `}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {`${a.value}`}
                                                                    </>
                                                                )}
                                                            </span>
                                                        ))
                                                    }
                                                </span>
                                                <div className="options" onClick={() => openGeneral(obj._id)}>more</div>
                                            </div>
                                            <div className={`exploreMore general ${obj._id}`}>
                                                <div className="form-area row">
                                                    <div className="left">
                                                        <div className="listImages">
                                                            {
                                                                obj.general.images.length == 0 ? (
                                                                    <p>No Images</p>
                                                                ) : null
                                                            }
                                                            {obj.general.images.map((img, imgIndex) => (
                                                                <div className="img" key={imgIndex}>
                                                                    <div className="delete" onClick={() => { deleteVarImage(finalProduct[0], obj._id, imgIndex) }}>X</div>
                                                                    <img src={img} alt='img' />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="right">
                                                        <ImageUploader
                                                            withPreview={true}
                                                            onChange={onDrop}
                                                            imgExtension={['.jpg', '.png']}
                                                            maxFileSize={5242880}
                                                            buttonText={'Upload New Images'}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-area">
                                                    <label htmlFor="">Varient Price</label>
                                                    <input type="text" name={`varPrice`} onChange={(e) => onPriceChange(e, index)} value={state.varPrice[index]} />
                                                </div>
                                                <div className="form-area">
                                                    <button onClick={() => updateVar(obj._id, index)} id={`updateVarBtn${obj._id}`}>Update</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : null}
                    </div>
                    <div className="right">
                        <ImageUploader
                            withPreview={true}
                            onChange={onCoverDrop}
                            imgExtension={['.jpg', '.png']}
                            maxFileSize={5242880}
                            buttonText={'Upload Cover Images'}
                        />
                        <span onClick={uploadCoverImages}>Upload</span>
                        <div className="CoverImageList">
                            {
                                state.coverImagesList.map((img, index) => (
                                    <div key={index} className="img">
                                        <img src={img} alt={`coverImage`} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddVarient;