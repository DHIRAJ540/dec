import React, {Fragment, useEffect, useState} from "react"
import "./NewProduct.css"
import { useSelector, useDispatch } from "react-redux"
import { updateProduct, clearErrors, getProductDetails } from "../../actions/productAction"
import { useAlert } from "react-alert"
import { Button } from "@mui/material"
import SideBar from "./SideBar"
import MetaData from "../layout/MetaData"
import AccountTreeIcon from "@mui/icons-material/AccountTree"
import DescriptionIcon from "@mui/icons-material/Description"
import StorageIcon from "@mui/icons-material/Storage"
import SpellcheckIcon from "@mui/icons-material/Spellcheck"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import { UPDATE_PRODUCT_RESET } from "../../constants/productConstant"
import { useNavigate } from "react-router"
import { useParams } from "react-router"


const UpdateProduct = () => {
    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const params = useParams()

    const productId = params.id

    const {error, product} = useSelector(state => state.productDetails)

    const {loading, error: updateError, isUpdated} = useSelector(state => state.product)

    const [name, setName] = useState("")
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [stock, setStock] = useState("")
    const [images, setImages] = useState([])
    const [oldImages, setOldImages] = useState([])
    const [imagesPreview, setImagesPreview] = useState([])


    const categories = [
        "Laptop",
        "Footwear",
        "Bottoms",
        "Tops",
        "Attire",
        "Camera",
        "SmartPhones"
    ]

    useEffect(() => {

        


        if(product && product._id !== productId){
            dispatch(getProductDetails(productId))
        } else {
            setName(product.name)
            setPrice(product.price)
            setStock(product.Stock)
            setDescription(product.description)
            setCategory(product.category)
            setOldImages(product.images)
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
            alert.success("Product updated successfully")
            navigate("/admin/products")
            dispatch({type:UPDATE_PRODUCT_RESET})
        }
    }, [dispatch, alert, error,navigate, isUpdated, productId, product, updateError])

    const updateProductSubmitHandler = (e) => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set("name", name)
        myForm.set("price", price)
        myForm.set("description", description)
        myForm.set("category", category)
        myForm.set("Stock", stock)

        images.forEach(image => {
            myForm.append("images", image)
        })

        dispatch(updateProduct(productId, myForm))

    }

    const createProductsImagesChange = (e) => {
        const files = Array.from(e.target.files)

        setImages([])
        setImagesPreview([])
        setOldImages([])

        files.forEach(file => {
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.readyState === 2){
                    setImagesPreview((old) =>[...old, reader.result])
                    setImages((old) => [...old, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }


    return (
        <Fragment>
            <MetaData title = "Create Product" />
            <div className="dashboard">
                <SideBar/>
                <div className="newProductContainer">
                    <form className="createProductForm" encType="multiport/form-data" onSubmit={updateProductSubmitHandler} >
                        <h1>Create Product</h1>

                        <div>
                            <SpellcheckIcon/>
                            <input type="text" 
                                    placeholder="Product Name"
                                    required
                                    value = {name}
                                    onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <AttachMoneyIcon/>
                            <input type="number" 
                                    placeholder="Price"
                                    required
                                    value = {price}
                                    onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <DescriptionIcon/>
                            <textarea 
                                    placeholder="Product Description"
                                    required
                                    value = {description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    cols={30}
                                    rows={1}
                            />
                        </div>
                        <div>
                            <AccountTreeIcon/>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} >
                                <option >Choose Category</option>
                                {categories.map((data) => (
                                    <option key = {data} value = {data} >{data}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <StorageIcon/>
                            <input type="number" 
                                    placeholder="Stock"
                                    required
                                    value = {stock}
                                    onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                        <div id="createProductFormFile">
                            <input type="file" name="avatar" accept="image/*" multiple onChange={createProductsImagesChange} />
                        </div>
                        <div id="createProductFormImage">
                            { oldImages && oldImages.map((image, index) => (
                                <img src={image.url} alt="Old product preview" key = {index} />
                            ))}
                        </div>
                        <div id="createProductFormImage">
                            {imagesPreview.map((image, index) => (
                                <img src={image} alt="Product preview" key = {index} />
                            ))}
                        </div>
                        <Button id = "createProductBtn" type="submit" disabled = {loading ? true : false} >
                            UPDATE
                        </Button>
                        

                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProduct