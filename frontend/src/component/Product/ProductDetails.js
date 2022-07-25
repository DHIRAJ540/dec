import React, { Fragment, useEffect, useState } from 'react'
import Carousel from 'react-material-ui-carousel'
import './ProductDetails.css'
import {useSelector, useDispatch} from 'react-redux'
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReactStars from "react-rating-stars-component"
import ReviewCard from './ReviewCard.js'
import Loader from '../layout/loader/loader'
import {useAlert} from 'react-alert'
import MetaData from '../layout/MetaData'
import { addItemsToCart } from '../../actions/cartAction'
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material"
import { Rating } from '@mui/material'
import { NEW_REVIEW_RESET } from '../../constants/productConstant'

const ProductDetails = () => {

    const alert = useAlert()
    

    const dispatch = useDispatch()
    const params = useParams()
    // console.log(params)



    const {product, loading, error}  = useSelector(state => state.productDetails)
    const {success, error : reviewError} = useSelector(state => state.newReview)

    // console.log(product)

    const options = {
        
        value:product.ratings,
        
       
        readOnly:true,
        precision:0.5
    }

    const [quantity, setQuantity] = useState(1)
    const [open, setOpen] = useState(false)
    const [comment, setComment] = useState("")
    const [rating, setRating] = useState(0)

    const submitReviewToggle = () => {
        open ? setOpen(false) : setOpen(true)
    }

    const reviewSubmitHandler = () => {
        const myForm = new FormData

        myForm.set("rating", rating)
        myForm.set("comment", comment)
        myForm.set("productId", params.id)

        dispatch(newReview(myForm))

        setOpen(false)
    }

    const increaseQuantity = () => {
        if(product.Stock > quantity){
            const qty = quantity + 1
            setQuantity(qty)
        }
    }

    const decreaseQuantity = () => {
        if(quantity > 1) {
            const qty = quantity - 1
            setQuantity(qty)
        }
    }

    const addToCartHandler = () => {
        dispatch(addItemsToCart(params.id, quantity))
        alert.success("Item added to cart")
    }


    useEffect(()=> {
        // console.log(match)
        if(error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if(reviewError) {
            alert.error(reviewError)
            dispatch(clearErrors())
        }
        if(success){
            alert.success("Review submitted successfully")
            dispatch({type: NEW_REVIEW_RESET})
        }

        dispatch(getProductDetails(params.id))
    }, [dispatch, params.id, error, alert, success, reviewError])

    return (
       <Fragment>
           {loading ? <Loader/> :  <Fragment>
            <MetaData title = {`${product.name} --DEC`} />
            <div className="ProductDetails">
                <div >
                    <Carousel className = "carousel">
                        {product.images && 
                            product.images.map((item ,i) => (
                                <img src={item.url} key = {i} alt={`${i} slides`} className="CarouselImage" />
                            ))
                        }
                    </Carousel>
                </div>
                <div >
                    <div className="detailsBlock-1">
                        <h2>{product.name}</h2>
                        <p>Product # {product._id}</p>
                    </div>
                    <div className="detailsBlock-2">
                        <Rating {...options}/>
                        <span className='detailsBlock-2-span' >{`${product.numOfReviews} reviews`}</span>
                    </div>
                    <div className="detailsBlock-3">
                        <h1>&#x20B9; {product.price}</h1>
                        <div className="detailsBlock-3-1">
                            <div className="detailsBlock-3-1-1">
                                <button onClick = {decreaseQuantity}>-</button>
                                <input readOnly = "true" type="number" value = {quantity}/>
                                <button onClick = {increaseQuantity}>+</button>
                            </div>
                            <button disabled = {product.Stock < 1 ? true : false} onClick = {addToCartHandler}>Add to Cart</button>
                        </div>
                        <p>
                            Status: 
                            <b className = {product.Stock < 1 ? "redColor" : "greenColor"}>
                                {product.Stock < 1 ? "Out of Stock" : "In Stock"}
                            </b>
                        </p>
                    </div>
                    <div className="detailsBlock-4">
                        Description : <p>{product.description}</p>
                    </div>
                    <button onClick = {submitReviewToggle} className="submitReview">submit review</button>
                </div>
            </div>
            <h3 className="reviewsHeading">REVIEWS</h3>

            <Dialog aria-labelledby='simple-dialog-title' open = {open} onClose={submitReviewToggle} >
                    <DialogTitle>Submit Review</DialogTitle>
                    <DialogContent className = "submitDialog" >
                        <Rating onChange = {(e) => setRating(e.target.value)  } value = {rating} size = "large" />
                        <textarea className='submitDialogTextArea' cols='30' rows = "5" value = {comment} onChange={(e) => setComment(e.target.value)} >


                        </textarea>
                        <DialogActions>
                            <Button onClick = {submitReviewToggle} color='secondary' >Cancel</Button>
                            <Button color='primary' onClick={reviewSubmitHandler}>Submit</Button>

                        </DialogActions>
                    </DialogContent>
            </Dialog>

            {product.reviews && product.reviews[0] ? (
                <div className="reviews">
                    {product.reviews && product.reviews.map((review) => <ReviewCard review = {review}/>)}
                </div>
            ) : (
                <p className="noReviews">No reviews yet</p>
            )}
        </Fragment>}
       </Fragment>
    )
}

export default ProductDetails