import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, A11y } from 'swiper';
import axios from 'axios'
import { useStateValue } from '../../StateProvider/StateProvider';
import { KEYS } from '../keys'
import { authenticateUser, isAuthUser, setCookie } from '../../helpers/auth'
import Product from './common/Product';
import { ToastContainer, toast } from 'react-toastify';

import './Home.css'
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';

function Home() {
    let history = useHistory();
    SwiperCore.use([Autoplay, Navigation, A11y])

    const [store, dispatch] = useStateValue();

    const [state, setState] = useState({
        catList: [],
        subCatList: [],
        productList: [],
    })

    useEffect(() => {
        dispatch({
            type: 'SET_LOADING'
        })

        // seeding will be put here for testing...
        // axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/seedProducts`)
        //     .then(result => {
        //         console.log(result.data.message)
        //     }).catch(err => {
        //         console.log(err)
        //     })
        //  return
        // end seeding testing...


        axios.get(`${KEYS.NODE_URL}/api/vendor/product/156/getAttribute`)
            .then(result => {
                dispatch({
                    type: 'SET_ATTR',
                    data: result.data.myAttributes
                })
            }).catch(err => {
                console.log(err)
            })

        let user = isAuthUser()
        if (user) {
            dispatch({
                type: 'LOGIN_USER',
                data: user
            })
            axios.post(`${KEYS.NODE_URL}/api/user/cart/156/get`, { userId: user.id })
                .then(result => {
                    dispatch({
                        type: 'SET_CART',
                        items: result.data.cart
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        }
        if (store.sliderList.length == 0) {
            axios.get(`${KEYS.NODE_URL}/api/vendor/general/156/getSlider`).then(result => {
                dispatch({
                    type: 'SET_SLIDERS',
                    sliders: result.data.finalData
                })
            }).catch(err => console.log(err))
        }
        if (store.rawdata.length == 0) {
            axios.get(`${KEYS.NODE_URL}/api/vendor/product/156/getRawData`)
                .then(result => {
                    state.catList = []
                    state.subCatList = []
                    state.catList = result.data.myRawData.categories
                    state.subCatList = result.data.myRawData.subCategories
                    setState({
                        ...state,
                        catList: state.catList,
                        subCatList: state.subCatList,
                    });
                    sortCat()
                    sortSubCat()
                    fetchProducts(state.catList)
                })
                .catch(err => {
                    console.log(err.response)
                })
        } else {
            if (store.home_products.length == 0) {
                state.catList = store.rawdata.categories
                state.subCatList = store.rawdata.subCategories
                setState({
                    ...state,
                    catList: state.catList,
                    subCatList: state.subCatList,
                });
                fetchProducts(state.catList)
            } else {
                state.catList = store.rawdata.categories
                state.subCatList = store.rawdata.subCategories
                state.productList = store.home_products
                dispatch({
                    type: 'UNSET_LOADING'
                })
                setState({
                    ...state,
                    catList: state.catList,
                    subCatList: state.subCatList,
                    productList: state.productList,
                });
            }
        }
    }, [])

    function sortCat() {
        var catList = state.catList
        for (let j = 0; j < catList.length; j += 1) {
            for (let i = 0; i < catList.length - j; i += 1) {
                if (catList[i + 1]) {
                    if (catList[i].categoryIndex > catList[i + 1].categoryIndex) { swapingCat(i, i + 1) }
                }
            }
        }
        function swapingCat(a, b) {
            let Temp = state.catList[a]
            state.catList[a] = state.catList[b]
            state.catList[b] = Temp
            setState({ ...state, catList: state.catList })
        }
    }

    function sortSubCat() {
        var subCatList = state.subCatList
        for (let j = 0; j < subCatList.length; j += 1) {
            for (let i = 0; i < subCatList.length - j; i += 1) {
                if (subCatList[i + 1]) {
                    if (subCatList[i].subCategoryIndex > subCatList[i + 1].subCategoryIndex) { swapingSubCat(i, i + 1) }
                }
            }
        }
        function swapingSubCat(a, b) {
            let Temp = state.subCatList[a]
            state.subCatList[a] = state.subCatList[b]
            state.subCatList[b] = Temp
            setState({ ...state, subCatList: state.subCatList })
        }
    }

    function fetchProducts() {
        // store raw data to redux store
        if (store.rawdata.length == 0) {
            dispatch({
                type: 'ADD_TO_RAWDATA',
                data: {
                    categories: state.catList,
                    subCategories: state.subCatList
                }
            })
        }
        state.productList = []
        state.catList.map(cat => {
            if (cat.categoryStatus == 1) {
                let data = {
                    category: cat,
                    const: 1,
                    limit: 5
                }
                axios.post(`${KEYS.NODE_URL}/api/vendor/product/156/product/get/category`, data)
                    .then(result => {
                        state.productList = []
                        state.productList = state.productList.concat([result.data.myCollection])
                        setState({
                            ...state,
                            productList: state.productList,
                        });
                        dispatch({
                            type: 'UNSET_LOADING'
                        })
                        dispatch({
                            type: 'ADD_TO_HOME_PRODUCTS',
                            data: {
                                products: result.data.myCollection
                            }
                        })
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        })
    }
    const goToCategory = cat => {
        let newCat = {
            _id: cat._id,
            categoryName: cat.categoryName,
            categoryIndex: cat.categoryIndex
        }
        history.push(`/c/${JSON.stringify(newCat)}/-1`);
    }
    const goToSubCat = (cat, sc) => {
        let newCat = {
            _id: cat._id,
            categoryName: cat.categoryName,
            categoryIndex: cat.categoryIndex
        }
        history.push(`/c/${JSON.stringify(newCat)}/${sc._id}`);
    }
    const goToLink = link => {
        history.push(link);
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
                        <>
                            <Swiper
                                navigation
                                slidesPerView={1}
                                autoplay={{ delay: 3000 }}
                            >
                                {
                                    store.sliderList.map((slide, index) => (
                                        <SwiperSlide key={index}>
                                            <img className='pc' src={slide.image[0]} alt="" onClick={() => goToLink(slide.link)} />
                                            <img className='mob' src={slide.image[1]} alt="" onClick={() => goToLink(slide.link)} />
                                        </SwiperSlide>
                                    ))
                                }
                                <div className="overlay"></div>
                            </Swiper>
                            <div className="content">
                                <div className="row">
                                    {state.catList.map((cat, catIndex) => (
                                        cat.categoryIndex <= 4 && cat.categoryStatus == 1 ? (
                                            <div className="box-1" key={catIndex}>
                                                <label htmlFor="">{cat.categoryName}</label>
                                                <div className="data">
                                                    {
                                                        state.subCatList.map((subCat, subCatIndex) =>
                                                            subCat.subCategoryIndex <= 4 && subCat.subCategoryStatus == 1 ?
                                                                subCat.subCategoryParent == cat._id ?
                                                                    <div key={subCatIndex} className="sub-box-1" onClick={() => goToSubCat(cat, subCat)}>
                                                                        <span>{subCat.subCategoryName}</span>
                                                                        <div className="img">
                                                                            <img src={subCat.subCategoryImage} />
                                                                        </div>
                                                                    </div> : null : null
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        ) : null
                                    ))}
                                </div>
                                {/* <div className="row">
                                    <div className="add-box">Add - 1</div>
                                    <div className="add-box">Add - 2</div>
                                    <div className="add-box">Add - 3</div>
                                </div> */}
                                {
                                    state.productList.map((obj, index) => {
                                        return obj.myProducts.length == 0 ? null : (
                                            <div key={index} className="row-slider a" >
                                                <div className="header">
                                                    <div className="label">{obj.category.categoryName}</div>
                                                    <div className="right">
                                                        <button onClick={() => goToCategory(obj.category)}>view all</button>
                                                    </div>
                                                </div>

                                                <div className="items">
                                                    {
                                                        obj.myProducts.map((product, productIndex) => {
                                                            return ((product.productPricing == undefined || product.productPricing.price == "") && (product.productType == 0) || (product.productStatus == 0)) ? null : (
                                                                <Product
                                                                    key={productIndex}
                                                                    product={product}
                                                                    productIndex={productIndex}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </>
    );
}

export default Home;
