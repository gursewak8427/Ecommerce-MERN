import React, { useState } from 'react';
import { Redirect, Link, useParams, useHistory } from 'react-router-dom'
import axios from 'axios'

import './ProductDetail.css'
import { useEffect } from 'react/cjs/react.development';

function ProductDetail() {
    let history = useHistory();
    const { productId } = useParams()

    const [state, setState] = useState({
        product: [],
        imgList: [],
        bigImg: ''
    })
    const { product } = state
    useEffect(() => {
        if (productId) {
            axios.post(`http://localhost:8082/api/vendor/product/156/getProductWithID`, { id: productId })
                .then(result => {
                    setState({ ...state, product: result.data.myCollection })
                }).catch(err => {
                    console.log(err)
                })
        } else {
            history.push(`/`);
        }
    }, [])
    const setBigImg = img => {
        setState({ ...state, bigImg: img })
    }
    return (
        <>
            <div className="wrapper">
                <div className="productDtl">
                    <div className="box images">
                        <div className="imagesDtl">
                            <div className="list">
                                {
                                    product.productType == 1 && state.imgList.length == 0 ? (
                                        <>
                                        </>
                                    ) : product.productType == 1 && state.imgList.length != 0 ? (
                                        state.imgList.map(img => (
                                            <img src={img} alt="" />
                                        ))
                                    ) : product.productType == 0 ? (
                                        <>
                                            <img onMouseEnter={() => setBigImg(product.CoverImages[0])} src={product.CoverImages[0]} />
                                            {
                                                product.productImages.map(img => (
                                                    <img src={img} onMouseEnter={() => setBigImg(img)} />
                                                ))
                                            }
                                        </>
                                    ) : null
                                }
                            </div>
                            <div className="bigImg">
                                {console.log('img', state.bigImg)}
                                <div className="addToWishList">
                                    <i></i>
                                </div>
                                <img src={state.bigImg} alt="bigImg" />
                            </div>
                        </div>
                        <div className="buttons">
                            <button>Add to cart</button>
                            <button>Buy now</button>
                        </div>
                    </div>
                    <div className="box details">
                        <div className="department">
                            Clothes &#x27A4; Men
                        </div>
                        <div className="name">
                            T-shirt Addidas
                        </div>
                        <div className="pricing">
                            228 Rs. <span>328 Rs.</span>
                            <span className="off">10% off</span>
                        </div>
                        <div className="varients">
                            <div className="rowAttrs">
                                <label htmlFor="">Colors</label>
                                <ul>
                                    <li>Red</li>
                                    <li>Orange</li>
                                    <li>White</li>
                                    <li>Grey</li>
                                    <li>bl ack</li>
                                </ul>
                            </div>
                            <div className="rowAttrs">
                                <label htmlFor="">Size</label>
                                <ul>
                                    <li>S</li>
                                    <li>M</li>
                                    <li>L</li>
                                    <li>X</li>
                                    <li>XL</li>
                                </ul>
                            </div>
                        </div>
                        <div className="productDtlDiv">
                            <label onClick={() => document.getElementsByClassName('productDetail')[0].classList.toggle('active')}><span>Product Details</span> <span>+</span></label>
                            <div className="productDetail">
                                <li><span>Cosdflor: </span><span>Black</span></li>
                                <li><span>ffsdf: </span><span>Bl ackBBl acklackBl ackBl ackBl ackBl ack</span></li>
                                <li><span>Colosadfr: </span><span>Bl ackBBl Bl ackBl ackacklackBl ackBl ackBl ackBl ackBl ackBBl Bl ackBl ackacklackBl ackBl ackBl ackBl ackBl ackBBl Bl ackBl ackacklackBl ackBl ackBl ackBl ackBl ackBBl Bl ackBl ackacklackBl ackBl ackBl ackBl ack</span></li>
                                <li><span>fff: </span><span>Bl aBl ackBBl ackBl acklackBl ackck</span></li>
                                <li><span>Colorss: </span><span>Bl aBl ackcBl ackBl ackkBl aBl ackcBl ackBl ackkBl aBl ackcBl ackBl ackkBl aBl ackcBl ackBl ackk</span></li>
                            </div>
                        </div>
                        <div className="ratingReview">
                            <label>
                                <span>Rating & Reviews</span>
                                <span>
                                    <span className='rate A'>3.5 &#9733;</span>
                                    <span>4,523 ratings and 478 reviews</span>
                                </span>
                                <span>Rate Product</span>
                            </label>
                            <div className="allImages">
                                <label>Images uploaded by customers:</label>
                                <div className="imgs">
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                    <img src="" alt="" />
                                </div>
                            </div>
                            <div className="allReviews">
                                <div className="review">
                                    <span>
                                        <span className="rate A">4.5 &#9733;</span>
                                        <span className="text">Its nice product</span>
                                    </span>
                                    <div className="photos">
                                        <img src="" alt="" />
                                        <img src="" alt="" />
                                        <img src="" alt="" />
                                    </div>
                                    <span>Gursewak Singh</span>
                                </div>
                                <div className="review">
                                    <span>
                                        <span className="rate A">4.5 &#9733;</span>
                                        <span className="text">Its nice producte producte producte producte producte product</span>
                                    </span>
                                    <div className="photos">
                                        <img src="" alt="" />
                                        <img src="" alt="" />
                                        <img src="" alt="" />
                                    </div>
                                    <span>Gursewak Singh</span>
                                </div>
                                <div className="review">
                                    <span>
                                        <span className="rate A">4.5 &#9733;</span>
                                        <span className="text">Its nice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice produnice product</span>
                                    </span>
                                    <div className="photos">
                                        <img src="" alt="" />
                                        <img src="" alt="" />
                                        <img src="" alt="" />
                                    </div>
                                    <span>Gursewak Singh</span>
                                </div>
                                <div className="bottom">All 349 Reviews &#10146;</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductDetail;
