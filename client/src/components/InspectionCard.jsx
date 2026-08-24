import {useState} from 'react'
import api from '../api/axios'

export default function InspectionCard({inspection , onDecided}){
    const product = inspection.productId;
    const [loading , setLoading] = useState(false)
    const [error , setError] = useState('');

    if(!product){
        return null;  //safety check in case product was deleted but inspection wasn't
    }

    const handleDecision = async (decision) => {
        setError('')
        setLoading(true)

        try{
            await api.put(`/inspections/${inspection._id}/decision`,{decision})
            onDecided(inspection._id)
        }catch(err){
            setError(err.response?.data?.message || 'Decision failed')
        }finally{
            setLoading(false)
        }
    }

    return(
        <div clasName="border rounded p-4 mb-4 flex gap-4">
            <div className='flex gap-4'>
                {product.images?.[0] && (
                <img src={product.images[0]} alt={product.name} className='w-24 h-24 object-cover rounded' />

            )}

            
            <div className='flex-1'>
                <h3 className='font-bold'>{product.name}</h3>
                <p className='text-sm text-gray-600'>{product.category}</p>
                <p className='text-sm'>Oty : {product.quantity} | ₹{product.price} </p>
                <p className="text-sm">
                    Expiry : {new Date(product.expiryDate).toLocaleDateString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                    Submitted : {new Date(inspection.createdAt).toLocaleDateString()}
                </p>
            </div>
        </div>

        {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

        <div className='flex gap-2 mt-3'>
            <button
             onClick={() => handleDecision('approve')}
             disabled={loading}
             className='bg-green-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50'>
                Approve
             </button>
             <button
                onClick={() => handleDecision('reject')}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
            >
            Reject
            </button>
        </div>
       </div>
    )
}