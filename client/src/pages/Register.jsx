import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const [form, setForm] = useState({
        name: '', email: '', password: '', role: 'buyer', phone: '', shopName: '', address: '',
    })
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handelChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handelSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await register(form);
            navigate(`/${data.role}/dashboard`)
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        }
    }

    return (
        <form onSubmit={handelSubmit} className='max-w-sm mx-auto mt-10 space-y-3'>
            <h2 className='text-xl font-bold'>Register</h2>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <input name='name' placeholder='Name' onChange={handelChange} className='border p-2 w-full' required />
            <input name='email' type='email' placeholder='Email' onChange={handelChange} className='border p-2 w-full' required />
            <input name='password' type='password' placeholder='Password' onChange={handelChange} className='border p-2 w-full' required />
            <select name="role" onChange={handelChange} className='border p-2 w-full'>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="agent">Agent</option>
            </select>
            {form.role === 'seller' && (
                <input name='shopName' placeholder='Shop Name' onChange={handelChange} className='border p-2 w-full' />
            )}
            {(form.role === 'seller' || form.role === 'buyer') && (
                <input name='address' placeholder='Address' onChange={handelChange} className='border p-2 w-full' required />
            )}
            <input name='phone' placeholder='Phone' onChange={handelChange} className='border p-2 w-full' />
            <button type='submit' className='bg-blue-600 text-white px-4 py-4 w-full'>Register</button>
        </form>
    )
}