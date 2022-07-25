import React, {useEffect} from "react"
import SideBar from "./SideBar.js"
import "./Dashboard.css"
import { Link } from "react-router-dom"
import { Typography } from "@mui/material"
import {Doughnut, Line} from "react-chartjs-2"
import { useSelector, useDispatch } from "react-redux"
import { useAlert } from "react-alert"
import { getAdminProduct, clearErrors } from "../../actions/productAction.js"
import { getAllOrders } from "../../actions/orderAction.js"
import { getAllUsers } from "../../actions/userAction.js"
// import { Chart as ChartJS, LineElement, PointElement, LinearScale, Title } from 'chart.js';



const DashBoard = () => {

    // ChartJS.register(LineElement, PointElement, LinearScale, Title);


    const dispatch = useDispatch()
    const alert = useAlert()
    // const params = useParams()

    const {error, products} = useSelector(state => state.products)
    const {orders} = useSelector(state => state.allOrders)
    const {users} = useSelector(state => state.allUsers)


    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors())

        }

        dispatch(getAdminProduct())
        dispatch(getAllOrders())
        dispatch(getAllUsers())
    }, [dispatch, alert, error])
   
    let outOfStock = 0

    products && products.forEach((item) => {
        if(item.Stock === 0){
            outOfStock += 1
        }
    })

    let totalAmount = 0

    orders && orders.forEach(item => {
        totalAmount += item.totalPrice
    })

    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets:[
            {
                label:"TOTAL AMOUNT",
                backgroundColor: ["tomato"],
                hoverBackgroundColor: ["rgb(197, 72, 49)"],
                data: [0, totalAmount]

            }
        ]
    }

    const doughnutState = {
        labels: ["Out of Stock", "InStock"],
        datasets: [
          {
            backgroundColor: ["#00A6B4", "#6800B4"],
            hoverBackgroundColor: ["#4B5000", "#35014F"],
            data: [outOfStock,products.length-outOfStock],
          },
        ],
      };

    return(
        <div className="dashboard">
            <SideBar/>
            <div className="dashboardContainer">
                <Typography component = "h1" >Dashboard</Typography>

                <div className="dashboardSummary">
                    <div>
                    <p>
                        Total Amount <br/> {totalAmount}
                    </p>
                    </div>
                <div className="dashboardSummaryBox2">
                    <Link to = "/admin/products" >
                        <p>Products</p>
                        <p>{products && products.length}</p>
                    </Link>
                    <Link to = "/admin/orders" >
                        <p>Orders</p>
                        <p>{orders && orders.length}</p>
                    </Link>
                    <Link to = "/admin/users" >
                        <p>Users</p>
                        <p>{users && users.length}</p>
                    </Link>
                </div>
                </div>

                <div className="lineChart">
                    <Line  data = {lineState} />
                    {/* <Chart type='line' data={lineState} /> */}

                </div>
                <div className="doughnutChart">
                    <Doughnut  data = {doughnutState} />
                    {/* <Chart type='line' data={lineState} /> */}

                </div>
            </div>
        </div>
    )
}

export default DashBoard