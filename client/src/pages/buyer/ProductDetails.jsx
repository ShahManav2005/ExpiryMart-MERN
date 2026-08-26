import { useState , useEffect } from "react";
import { useParams } from "react-router-dom";
import api from '../../api/axios'
import { riskStyle , riskLabel } from "../../utils/riskBadge";
import {useCart} from'../../context/CartContext'

export default function ProductDetail() {
    const {id} = useParams();
    const {addToCart} = useCart();
    const[product , setProduct] = useState(null);
    const[loading , setLoading] = useState(true);
    const[error , setError] = useState('');
    const[added , setAdded] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try{
                const {data} = await api.get(`/products/public/${id}`)
                setProduct(data);
            }catch(err){
                setError('Product not found')
            }finally{
                setLoading(false)
            }
        }
        fetchProduct()
    } , [id])

    if(loading) return <p className="text-center mt-10">Loading...</p>
    if(error) return <p className="text-center mt-10 text-red-500">{error}</p>

    const {pricing} = product

    const handleAddToCart = () => {
        addToCart(product , pricing)
        setAdded(true);
        setTimeout(() => setAdded(false), 1500)
    }

    return(
        <div className="max-w-2wl mx-auto mt-10 px-4">
            {product.images?.[0] && (
                <img src={product.images[0]} alt={product.name} className="w-full h-64 object-cover rounded mb-4" />
            )}

            <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <span className= {`px-2 py-1 rounded text-xs ${riskStyle[pricing.riskLevel]}`}>
                    {riskLabel[pricing.riskLevel]}
                </span>
            </div>

            <p claasName='text-gray-600 mb-2'>{product.category}</p>

            <div className='flex items-center gap-3 mb-2'>
                {pricing.discountPercent > 0 && (
                    <span className='text-gray-400 line-through'>₹{product.price}</span>
                )}

                <span className="text-xl font-bold">₹{pricing.discountedPrice}</span>
                {pricing.discountPercent > 0 && (
                    <span className='text-green-600 text-sm'>{pricing.discountPercent}% off</span>
                )}
            </div>

            <p className="text-sm text-gray-600 mb-1">Quatinty available : {product.quantity}</p>
            <p className="text-sm text-gray-600 mb-4">
                Expires : {new Date(product.expriryDate).toLocaleDateString()} ({pricing.daysLeft} days left)
            </p>

            <button
                onClick={handleAddToCart}
                className="bg-blue-600 text-white px-4 py-2 rounded w-full mt-2"
            >
                {added ? 'Added ✓' : 'Add to Cart'}
            </button>
        </div>
    )
}