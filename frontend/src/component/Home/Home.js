import React, { Fragment, useEffect } from 'react'
import { CgMouse } from 'react-icons/cg'
import ProductCard from "./ProductCard"
import Loader from '../layout/loader/loader.js'
import "./Home.css"
import MetaData from '../layout/MetaData'
import {clearErrors, getProduct} from '../../actions/productAction'
import {useSelector, useDispatch} from "react-redux"
import {useAlert} from 'react-alert'
import Logo from "../../images/logo.png"


const Home = () => {

    const alert = useAlert()

    
    const dispatch = useDispatch()
    const {loading, error, products} = useSelector((state) => state.products)

    useEffect(() => {

        if(error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        dispatch(getProduct())
    }, [dispatch, error, alert])

    return(
        <Fragment>
            {loading ? <Loader/>:
                <Fragment>
                <MetaData title = "CARBHEAL"/>
                    <div className="banner">
                        <img src={Logo} alt="logo" />
                        <p>Welcome to CARBHEAL</p>
                        <h1>FIND AMAZING PRODUCTS BELOW</h1>
                        <a href="#container">
                            <button>Scroll <CgMouse/> </button>
                        </a>
                    </div>
                    <h2 className="homeHeading">Featured products</h2>
        
                    <div className="container" id="container">
                        {products && products.map((product) => (
                            <ProductCard product = {product}/>
                        ))}
        
        
        
                    </div>
                    
                </Fragment>
            }
        </Fragment>
    )

}

export default Home