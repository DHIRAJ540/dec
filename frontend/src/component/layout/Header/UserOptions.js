import React, {Fragment, useState} from 'react'
import './Header.css'
import {SpeedDial, SpeedDialAction} from '@mui/material'
import DashBoardIcon from '@mui/icons-material/Dashboard'
import PersonIcon from "@mui/icons-material/Person"
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import BackDrop from '@mui/material/Backdrop'
import {  useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import {logout} from '../../../actions/userAction'

const UserOptions = ({user}) => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()

    const [open, setOpen] = useState(false)

    const {cartItems} = useSelector(state => state.cart)

    const avatarUrl = user.avatar.url
    // console.log(avatarUrl)

    const options = [
        {icon:<ListAltIcon/>, name:"Orders", func:orders},
        {icon:<PersonIcon/>, name:"Profile", func:account},
        {icon:<ShoppingCartIcon style = {{color: cartItems.length ? "tomato" : "unset"}}/>, name:`
        Cart(${cartItems.length})`, func:cart},
        {icon:<ExitToAppIcon/>, name:"Logout", func:logoutUser}

    ]

    if(user.role === "admin") {
        options.unshift({icon:<DashBoardIcon/>, name:"Dashboard", func:dashboard})
    }

    function dashboard() {
        navigate('/admin/dashboard')
    }

    function orders() {
        navigate("/orders")
    }

    function account() {
        navigate("/account")
    }

    function cart() {
        navigate("/Cart")
    }

    function logoutUser() {
        dispatch(logout())
        navigate("/")
        alert.success("Logout successfully")
    }


    return (
        <Fragment>
            <BackDrop open = {open} style = {{zIndex:"10"}}/>
            <SpeedDial
                ariaLabel = "speed dial"
                onClose = {() => setOpen(false)}
                onOpen = {() => setOpen(true)}
                open = {open}
                style = {{zIndex:"11"}}
                icon = {<img
                    className = "speedDialIcon"
                    src = { user.avatar.url ? user.avatar.url : '/Profile.png'}
                    alt = "Profile"
                />}
                direction ="down"
                className = "speedDial"
                
            >
                {options.map((item) => (
                    <SpeedDialAction icon = {item.icon} tooltipTitle = {item.name} onClick = {item.func} key = {item.name} tooltipOpen = {window.innerWidth < 600 ? true : false}/>
                ))}
            </SpeedDial>
        </Fragment>
    )
}

export default UserOptions