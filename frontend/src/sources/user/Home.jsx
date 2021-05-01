import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, A11y } from 'swiper';
import axios from 'axios'
import { useStateValue } from '../../StateProvider/StateProvider';

import './Home.css'
import 'swiper/swiper.scss';
import 'swiper/components/navigation/navigation.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/scrollbar/scrollbar.scss';
import Product from './common/Product';
import { authenticateUser, isAuthUser } from '../../helpers/auth'

function Home() {
    SwiperCore.use([Autoplay, Navigation, A11y])

    const [store, dispatch] = useStateValue();

    const [state, setState] = useState({
        catList: [],
        subCatList: [],
        productList: [],
    })



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

        if (store.rawdata.length != 0) {
            setState({
                ...state,
                catList: store.rawdata.categories,
                subCatList: store.rawdata.subCategories,
                productList: store.home_products
            })
        }

        if (store.rawdata.length == 0) {
            axios.get(`http://localhost:8082/api/vendor/product/156/getAttribute`)
                .then(result => {
                    dispatch({
                        type: 'SET_ATTR',
                        data: result.data.myAttributes
                    })
                }).catch(err => {
                    console.log(err)
                })
            axios.get('http://localhost:8082/api/vendor/product/156/getRawData')
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
                    fetchProducts()
                })
                .catch(err => {
                    console.log(err)
                })
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
        dispatch({
            type: 'ADD_TO_RAWDATA',
            data: {
                categories: state.catList,
                subCategories: state.subCatList
            }
        })
        state.productList = []
        state.catList.map(cat => {
            let data = {
                'category': cat
            }
            axios.post(`http://localhost:8082/api/vendor/product/156/product/get/category`, data)
                .then(result => {
                    state.productList = state.productList.concat([result.data.myCollection])
                    setState({
                        ...state,
                        productList: state.productList,
                    });
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
        })
    }

    return (
        <>
            <div className="wrapper">
                <Swiper
                    navigation
                    slidesPerView={1}
                    autoplay={{ delay: 3000 }}
                >
                    <SwiperSlide>
                        <img src="https://images-eu.ssl-images-amazon.com/images/G/31/img21/ApparelGW/ATF/under599/Axis/1500X600._CB656596396_.jpg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="https://images-eu.ssl-images-amazon.com/images/G/31/img21/Fashion/Gateway/Flip/GW_HPFF/1500X600-main._CB654554172_.jpg" alt="" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src="https://images-eu.ssl-images-amazon.com/images/G/31/AmazonVideo/2021/X-site/SingleTitle/Hello-Charlie/launch/1500x600_Hero-Tall_JPN._CB656396748_.jpg" alt="" />
                    </SwiperSlide>
                    <div className="overlay"></div>
                </Swiper>
                <div className="content">
                    <div className="row">
                        {state.catList.map((cat, catIndex) => (
                            cat.categoryIndex <= 4 ? (
                                <div className="box-1" key={catIndex}>
                                    <label htmlFor="">{cat.categoryName}</label>
                                    <div className="data">
                                        {
                                            state.subCatList.map((subCat, subCatIndex) => (
                                                subCat.subCategoryIndex <= 4 ? (
                                                    subCat.subCategoryParent == cat._id ? (
                                                        <div key={subCatIndex} className="sub-box-1">
                                                            <span>{subCat.subCategoryName}</span>
                                                            <div className="img">
                                                                <img src={subCat.subCategoryImage} />
                                                            </div>
                                                        </div>
                                                    ) : null
                                                ) : null
                                            ))}
                                    </div>
                                </div>
                            ) : null
                        ))}
                    </div>
                    <div className="row">
                        <div className="add-box">Add - 1</div>
                        <div className="add-box">Add - 2</div>
                        <div className="add-box">Add - 3</div>
                    </div>
                    {
                        state.productList.map((obj, index) => {
                            return obj.myProducts.length == 0 ? null : (
                                <div key={index} className="row-slider a" >
                                    <div className="header">
                                        <div className="label">{obj.category.categoryName}</div>
                                        <div className="right">
                                            <button>view all</button>
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
            </div>
        </>
    );
}

export default Home;
