import React, {Fragment, useEffect} from "react"
import { DataGrid } from "@mui/x-data-grid"
import "./ProductList.css"
import { useSelector, useDispatch } from "react-redux"

import { Link } from "react-router-dom"
import { useAlert } from "react-alert"
import { Button } from "@mui/material"
import MetaData from "../layout/MetaData"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import SideBar from "./SideBar"
import { useNavigate } from "react-router"
// import { DELETE_PRODUCT_RESET } from "../../constants/productConstant"
import { deleteOrder, getAllOrders, clearErrors } from "../../actions/orderAction"
import { DELETE_ORDER_RESET } from "../../constants/orderConstant"
// import { useParams } from "react-router"

const OrderList = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    // const params = useParams()

    const {error, orders} = useSelector(state => state.allOrders)
    const {error: deleteError, isDeleted} = useSelector(state => state.order)

    const deleteOrderHandler = (id) => {
        dispatch(deleteOrder(id))
    }

    useEffect(() => {
        if(error){
            alert.error(error)
            dispatch(clearErrors())

        }

        if(deleteError){
            alert.error(error)
            dispatch(clearErrors())

        }

        if(isDeleted){
            alert.success("Order deleted successfully")
            navigate("/admin/orders")
            dispatch({type: DELETE_ORDER_RESET})
            
        }

        dispatch(getAllOrders())
    }, [dispatch, alert, error, deleteError, isDeleted, navigate])

    const columns = [
        {field: "id", headerName: "Order ID", minWidth: 300, flex : 1},
        {field: "status", headerName: "Status", minWidth: 150, flex: 0.5,
    
        cellClassName: (params) => {
            return params.getValue(params.id, "status") === "Delivered" ? "greenColor" : "redColor"
        }
    
    },
        {field: "itemsQty", headerName: "Item Qty", type: "number", minWidth: 270, flex:0.4},
        {field: "amount", headerName: "Amount", type: "number", minWidth: 270, flex:0.5},
        {
            field: "actions",
            headerName: "Actions",
            minWidth: 150,
            type:"number",
            flex:0.3,
            sortable:false,
            renderCell: (params) => {
                return (
                    <Fragment>
                        <Link to = {`/admin/order/${params.getValue(params.id, "id")}`} >
                            <EditIcon/>
                        </Link>
                        <Button onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))} >
                            <DeleteIcon/>
                        </Button>
                    </Fragment>
                )
            }
        },
    ]



    const rows = [];

    orders && orders.forEach(item => {
        rows.push({
            id: item._id,
            itemQty: item.orderItems.length,
            amount: item.totalprice,
            status: item.orderStatus
        })
    })

    return (
        <Fragment>
            <MetaData title = {"ALL ORDERS -Admin"} />
            <div className="dashboard">
                <SideBar/>
                <div className="productListContainer">
                    <h1 id="productListHeading">ALL ORDERS</h1>
                    <DataGrid 
                        rows = {rows}
                        columns = {columns}
                        pageSize = {10}
                        disableSelectionOnClick
                        className="productListTable"
                        autoHeight
                    />
                </div>
            </div>
        </Fragment>
    )


}

export default OrderList