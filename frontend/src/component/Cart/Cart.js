import React, {Fragment} from "react"
import "./Cart.css"
import CartItemCard from './CartItemCard.js'
import { useSelector, useDispatch } from "react-redux"
import { addItemsToCart, removeItemsFromCart } from "../../actions/cartAction"
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart"
import { Link } from "react-router-dom"
import { Typography } from "@mui/material"
import { useNavigate } from "react-router"

const Cart = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {cartItems} = useSelector(state => state.cart);
    
    const increaseQuantity = (id, quantity, stock) => {
        
        const newQty = quantity + 1
       
        if(stock <= quantity){
            return
        }

        dispatch(addItemsToCart(id, newQty))
    }

    const decreaseQuantity = (id, quantity) => {
        
        const newQty = quantity - 1
       
        if(quantity <= 1){
            return
        }

        dispatch(addItemsToCart(id, newQty))
    }

    const deleteCartItems = (id) => {
        dispatch(removeItemsFromCart(id))
    }

    const checkoutHandler = () => {
        navigate('/login?redirect=shipping')
    }




    

    return (
        <Fragment>
            {cartItems.length ? <Fragment>
            <div className="cartPage">
                <div className="cartHeader">
                    <p>Product</p>
                    <p>Quantity</p>
                    <p>Subtotal</p>
                </div>
               {cartItems && cartItems.map((item) => (
                    <div className="cartContainer" key = {item.product}>
                    <CartItemCard item = {item} deleteCartItems = {deleteCartItems}/>
                    <div className="cartInput">
                        <button onClick = {() => decreaseQuantity(item.product, item.quantity)}>-</button>
                        <input type="number" readOnly = {true} value = {item.quantity}/>
                        <button onClick = {() => increaseQuantity(item.product, item.quantity, item.stock)}>+</button>
                    </div>
                    <p className="cartSubtotal">{item.price*item.quantity}</p>

                </div>
               ))}
                <div className="cartGrossProfit">
                    <div></div>
                    <div className="cartGrossProfitBox">
                        <p>Gross total</p>
                        <p>{`${cartItems.reduce(
                            (acc, item) => acc + item.quantity * item.price, 0
                        )}`}</p>
                        <div></div>
                        <div onClick = {() => checkoutHandler()} className="checkOutBtn">
                            <button>Check Out</button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment> : <div className="emptyCart">
            <RemoveShoppingCartIcon/>
            <Typography>No product in your cart</Typography>
            <Link to  = "/products">View Products</Link>
        </div> }
        </Fragment>
    )
}

export default Cart