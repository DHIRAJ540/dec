import React from "react"
import playStore from "../../../images/playstore.png"
import appStore from '../../../images/Appstore.png'
import './Footer.css'

const Footer = () => {
    return (
        <footer id="footer">
            <div className="leftFooter">
                <h4>DOWNOLAD OUR APP</h4>
                <p>Download app for ios and android mobile phone</p>
                <img src={playStore} alt="playstore" />
                <img src={appStore} alt="appstore" />

            </div>
            <div className="midFooter">
                <h1>DEC</h1>
                <p>High quality is our first priority</p>
                <p>Copyrights 2021 &copy; Dhiraj subudhi</p>
            </div>
            <div className="rightFooter">
                <h4>Follow us on</h4>
                <a href="linkedin.com/in/dhiraj-subudhi-850365194/">Instagram</a>
                <a href="linkedin.com/in/dhiraj-subudhi-850365194/">Twitter</a>
                <a href="linkedin.com/in/dhiraj-subudhi-850365194/">Facebook</a>
            </div>
        </footer>
    )
}

export default Footer