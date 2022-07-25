import React, {Fragment, useRef, useState, useEffect} from 'react'
import "./ResetPassword.css"
import Loader from '../layout/loader/loader'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, resetPassword } from '../../actions/userAction'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router'
import MetaData from '../layout/MetaData'
import LockOpenIcon from "@mui/icons-material/LockOpen"
import LockIcon from '@mui/icons-material/Lock'
import { useParams } from 'react-router'

const ResetPassword = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const params = useParams()

   
    const {error, message,  loading} = useSelector(state => state.forgotPassword)

    const [confirmPassword, setConfirmPassword] = useState("")
    const [password, setPassword] = useState("")


    const resetPasswordSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData();

        
        myForm.set("password", password)
        myForm.set("confirmPassword", confirmPassword)

        
        dispatch(resetPassword(params.token, myForm))

    }

      useEffect(() => {

        

          if(error){
              alert.error(error)
              dispatch(clearErrors())
          }
          if(message) {
              alert.success("Password updated successfully")
              
              navigate('/login')

              
          }
      },[dispatch, error, alert,  navigate,  message])

      return (
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <MetaData title="Update Password" />
              <div className="resetPasswordContainer">
                <div className="resetPasswordBox">
                  <h2 className="resetPasswordHeading">Update Profile</h2>
    
                  <form
                    className="resetPasswordForm"
                    
                    onSubmit={resetPasswordSubmit}
                  >
                   
                    
                  
                <div >
                  <LockOpenIcon />
                  <input
                    type="password"
                    placeholder="New Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div >
                  <LockIcon />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                    <input
                      type="submit"
                      value="Update"
                      className="resetPasswordBtn"
                    />
                  </form>
                </div>
              </div>
            </Fragment>
          )}
        </Fragment>
      );

}

export default ResetPassword