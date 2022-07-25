import React, {Fragment, useEffect, useState} from "react"
import "./NewProduct.css"
import { useSelector, useDispatch } from "react-redux"
import { useAlert } from "react-alert"
import { Button } from "@mui/material"
import SideBar from "./SideBar"
import MetaData from "../layout/MetaData"
import { useNavigate } from "react-router"
import { UPDATE_USER_RESET } from "../../constants/userConstatnts"
import { useParams } from "react-router"
import { getUserDetails, updateUser, clearErrors } from "../../actions/userAction"
import MailOutlineIcon from "@mui/icons-material/MailOutline"
import PersonIcon from "@mui/icons-material/Person"
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import Loader from "../layout/loader/loader"

const UpdateUser = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const params = useParams()

    const {loading, error, user} = useSelector(state => state.userDetails)
    const {loading:updateLoading, error:updateError, isUpdated} = useSelector(state => state.profile)


    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")

    const userId = params.id





    useEffect(() => {

        if(user && user._id !== userId){
            dispatch(getUserDetails(userId))
        } else {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }

        if(error){
            alert.error(error)
            dispatch(clearErrors())
        }

        if(updateError){
            alert.error(updateError)
            dispatch(clearErrors())
        }

        if(isUpdated){
            alert.success("User updated successfully")
            navigate("/admin/users")
            dispatch({type:UPDATE_USER_RESET})
        }
    }, [dispatch, alert, error,navigate, isUpdated, updateError, user, userId])

    const updateUserSubmitHandler = (e) => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set("name", name)
        myForm.set("email", email)
        myForm.set("role", role)





        dispatch(updateUser(userId, myForm))

    }



    return (
        <Fragment>
            <MetaData title = "Update Users" />
            <div className="dashboard">
                <SideBar/>
                <div className="newProductContainer">
                    {loading ? <Loader/> : (
                                            <form className="createProductForm" encType="multiport/form-data" onSubmit={updateUserSubmitHandler} >
                                            <h1>Update User</h1>
                    
                                            <div>
                                                <PersonIcon/>
                                                <input type="text" 
                                                        placeholder="User Name"
                                                        required
                                                        value = {name}
                                                        onChange={(e) => setName(e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <MailOutlineIcon/>
                                                <input type="email" 
                                                        placeholder="email"
                                                        required
                                                        value = {email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                />
                                            </div>
                    
                                            <div>
                                                <VerifiedUserIcon/>
                                                <select value = {role} onChange={(e) => setRole(e.target.value)} >
                                                    <option value="">Choose Role</option>
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                    
                                                    
                                                </select>
                                            </div>
                    
                    
                                            <Button id = "createProductBtn" type="submit" disabled = {updateLoading ? true : false || role === "" ? true : false} >
                                                Update
                                            </Button>
                                            
                    
                                        </form>
                    )}
                </div>
            </div>
        </Fragment>
    )

}

export default UpdateUser