import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [form , setForm] = useState({email : '' , passwrod : ''})
    const [error , setError] = useState('');
    const {login} = useAuth();
    const navigate = useNavigate();

    const handelChange = (e) => setForm({...form, [e.target.name] : e.target.value})

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try{
            const data = await login(form);
            navigate(`/${data.role}/dashbord`);
        }catch(err){
            setError(err.response?.data?.message || 'Login failed')
        }
    }

    return(
        <form onSubmit={handleSubmit} className='max-w-sm mx-auto mt-10 space-y-3'>
            <h2 className='text-x1 font-bold'>Login</h2>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            <input name='email' type='email' placeholder='Email' onChange={handelChange} className='border p-2 w-full' required/>
            <input name='password' type='password' placeholder='Passwrod' onChange={handelChange} className='border p-2 w-full' required/>
            <button type='submit' className='bg-blue-600 text-white px-4 py-4 w-full'>Login</button>
        </form>
    )
}