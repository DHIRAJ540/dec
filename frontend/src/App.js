import './App.css';
import Header from "./component/layout/Header/header"
import Footer from './component/layout/Footer/footer'
import Home from "./component/Home/Home"
import Contact from "./component/layout/Contact.js"
import About from "./component/layout/About.js"
import NotFound from "./component/layout/NotFound.js"
import Products from './component/Product/Products.js'
import Search from './component/Product/Search.js'
import UserOptions from './component/layout/Header/UserOptions.js'
import ProductDetails from './component/Product/ProductDetails'
import Profile from './component/User/Profile.js'
import UpdateProfile from './component/User/UpdateProfile.js'
import UpdatePassword from './component/User/UpdatePassword.js'
import ForgotPassword from './component/User/ForgotPassword.js'
import Cart from './component/Cart/Cart.js'
import Shipping from './component/Cart/Shipping.js'
import ConfirmOrder from './component/Cart/ConfirmOrder.js'
import Payment from "./component/Cart/Payment.js"
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import ResetPassword from './component/User/ResetPassword.js'
import DashBoard from "./component/admin/DashBoard.js"
import ProductList from "./component/admin/ProductList.js"
import NewProduct from "./component/admin/NewProduct"
import UpdateProduct from "./component/admin/UpdateProduct.js"
import ProcessOrder from "./component/admin/ProcessOrder.js"
import OrderList from "./component/admin/OrderList.js"
import UsersList from "./component/admin/UsersList.js"
import UpdateUser from "./component/admin/UpdateUser.js"
import ProductReviews from "./component/admin/ProductReviews.js"
import ProtectedRoute from './component/Route/ProtectedRoute';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"

import WebFont from 'webfontloader'
import React, {useState} from "react"
import LoginSignUp from './component/User/LoginSignUp';
import store from './Store'
import { loadUser } from './actions/userAction';
import {useSelector} from 'react-redux'
import axios from "axios"
import {Elements} from "@stripe/react-stripe-js"
import {loadStripe}  from "@stripe/stripe-js"




function App() {

 

 const {isAuthenticated, user} = useSelector(state => state.user)
 const [stripeApiKey, setStripeApiKey] = useState("")
 
 async function getStripeApiKey() {
   const {data} = await axios.get("/api/v1/stripeapikey")

   
   setStripeApiKey(data.stripeApiKey)
   console.log(stripeApiKey)
 }

  React.useEffect(() => {



    getStripeApiKey()

    WebFont.load({
      google:{
        families:["Roboto", "Droid Sans", "Chilanka"]
      }
    })

    

    store.dispatch(loadUser())
  }, [])

  // window.addEventListener("contextmenu", (e) => e.preventDefault())

  return (
    <Router>
      <Header/>
      {isAuthenticated && <UserOptions user = {user} />}
      <Routes>
        <Route exact path= "/" element = {<Home/>}/>
        <Route exact path= "/product/:id" element = {<ProductDetails />}/>
        <Route exact path= "/products" element = {<Products />}/>
        <Route  path= "/products/:keyword" element = {<Products />}/>
        <Route exact path= "/search" element = {<Search />}/>
        <Route exact path= "/login" element = {<LoginSignUp />}/>
        <Route exact path= "/contact" element = {<Contact />}/>
        <Route exact path= "/about" element = {<About />}/>


        <Route exact path = "/account" element = {
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        } />

        <Route exact path = "/order/confirm" element = {
          <ProtectedRoute>
            <ConfirmOrder/>
          </ProtectedRoute>
        } />

        <Route exact path = "/me/update" element = {
          <ProtectedRoute>
            <UpdateProfile/>
          </ProtectedRoute>
        } />
        <Route exact path = "/password/update" element = {
          <ProtectedRoute>
            <UpdatePassword/>
          </ProtectedRoute>
        } />
        <Route exact path= "/password/forgot" element = {<ForgotPassword />}/>
        <Route exact path= "/password/reset/:token" element = {<ResetPassword />}/>
        <Route exact path= "/cart" element = {<Cart />}/>
        <Route exact path = "login/shipping" element = {
          <ProtectedRoute>
            <Shipping/>
          </ProtectedRoute>
        } />
        

        <Route exact path = "/process/payment" element = {
          <Elements stripe = {loadStripe(stripeApiKey)} >
          <ProtectedRoute>
            <Payment/>
          </ProtectedRoute>
        </Elements>
        } />

        <Route exact path = "/success" element = {
          <ProtectedRoute>
            <OrderSuccess/>
          </ProtectedRoute>
        } />

        <Route exact path = "/orders" element = {
          <ProtectedRoute>
            <MyOrders/>
          </ProtectedRoute>
        } />

       
        

        <Route exact path = "/order/:id" element = {
          <ProtectedRoute>
            <OrderDetails/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/dashboard" element = {
          <ProtectedRoute isAdmin = {true} >
            <DashBoard/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/products" element = {
          <ProtectedRoute isAdmin = {true} >
            <ProductList/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/product" element = {
          <ProtectedRoute isAdmin = {true} >
            <NewProduct/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/product/:id" element = {
          <ProtectedRoute isAdmin = {true} >
            <UpdateProduct/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/orders" element = {
          <ProtectedRoute isAdmin = {true} >
            <OrderList/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/order/:id" element = {
          <ProtectedRoute isAdmin = {true} >
            <ProcessOrder/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/users" element = {
          <ProtectedRoute isAdmin = {true} >
            <UsersList/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/user/:id" element = {
          <ProtectedRoute isAdmin = {true} >
            <UpdateUser/>
          </ProtectedRoute>
        } />

        <Route  exact path = "/admin/reviews" element = {
          <ProtectedRoute isAdmin = {true} >
            <ProductReviews/>
          </ProtectedRoute>
        } />
        
        <Route path = "*" element = { window.location.pathname === "/process/payment" ? null :<NotFound />}/>
        

      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
