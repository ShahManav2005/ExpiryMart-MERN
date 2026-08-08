export default function InspectionCard({inspection}){
    const product = inspection.productId;

    if(!product){
        return null;  //safety check in case product was deleted but inspection wasn't
    }

    return(
        <div clasName="border rounded p-4 mb-4 flex gap-4">
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
    )
}