import React, { Fragment, useEffect, useState } from 'react'
import './Products.css'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, getProduct } from '../../actions/productAction'
import MetaData from '../layout/MetaData'
import Loader from '../layout/loader/loader'
import ProductCard from '../Home/ProductCard'
import {useParams} from 'react-router-dom'
import Pagination from 'react-js-pagination'
import Typography from "@mui/material/Typography"
import Slider from '@mui/material/Slider'
import {useAlert} from 'react-alert'

const categories = [
    "Laptop",
    "Footwear",
    "Bottoms",
    "Tops",
    "Attire",
    "Camera",
    "SmartPhones"
]


const Products = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const alert = useAlert()
    
    const {products, loading, error, productsCount, resultPerPage} = useSelector(state => state.products)
    
    const [currentPage, setCurrentPage] = useState(1)
    const [price, setPrice] = useState([0, 30000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)


    const keyword = params.keyword

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    const priceHandler = (event, newPrice) => {
        setPrice(newPrice)
    }

    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }


        dispatch(getProduct(keyword, currentPage, price, category, ratings))
    }, [dispatch, keyword, currentPage, price, category, ratings, error, alert])

    
    return (
       <Fragment>
           {loading ? <Loader/> :
                <Fragment>
                    <MetaData title = "PRODUCTS -- DEC"/>
                    <h2 className = "productsHeading">Products</h2>
                    <div className="products">
                        {products && 
                            products.map((product) => (
                            <ProductCard product = {product} key = {product._id} />            
                        ))}
                    </div>
                    <div className="filterBox">
                        <Typography>Price</Typography>
                        <Slider value  = {price}
                                onChange = {priceHandler}
                                valueLabelDisplay = "auto"
                                aria-labelledby = "range slider"
                                min = {0}
                                max = {30000}
                        />
                        <Typography>Categories</Typography>
                        <ul className = "categoryBox">
                                {categories.map((category) => (
                                    <li className = "category-link"  key = {category} onClick = {() => setCategory(category)}>
                                        {category}
                                    </li>
                                ))}
                        </ul>
                        <fieldset>
                            <Typography component = "legend">Ratings above</Typography>
                            <Slider
                                value = {ratings}
                                onChange = {(e, newRating) => {
                                    setRatings(newRating)
                                }}
                                aria-labelledby = "continious-slider"
                                min = {0}
                                max = {5}
                                valueLabelDisplay = "auto"
                            />
                        </fieldset>
                    </div>
                   {resultPerPage < productsCount  ?
                     <div className="paginationBox">
                     <Pagination
                         activePage = {currentPage}
                         itemsCountPerPage = {resultPerPage}
                         totalItemsCount = {productsCount}
                         onChange = {setCurrentPageNo}
                         nextPageText = "Next"
                         prevPageText = "Prev"
                         firstPageText = "First"
                         lastPageText = "Last"
                         itemClass = "page-item"
                         linkClass = "page-link"
                         activeClass = "pageItemActive"
                         activeLinkClass = "pageLinkActive"
                     />
                 </div>   : ""
                }
                </Fragment>

           }
       </Fragment>
    )
}

export default Products