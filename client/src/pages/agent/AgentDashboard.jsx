import {useState , useEffect} from 'react'
import api from '../../api/axios'
import InspectionCard from '../../components/InspectionCard'

export default function AgentDashboard() {
    const [inspections , setInspections ] = useState([])
    const [loading , setLoading] = useState(null)
    const [error , setError] = useState('')

    const fetchInspections = async () => {
        try{
            const {data} = await api.get('/inspections/pending')
            setInspections(data);
        }catch(err){
            setError('Failed to load inspection queue')
        }finally{
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchInspections()
    } , [])

    const handleDecided = (inspectionId) => {
    setInspections(inspections.filter((i) => i._id !== inspectionId));
    }

    return(
        <div className='max-w-2x1 mx-auto mt-10 px-4'>
            <h1 className='text-2xl font-bold mb-6'>Agent DashBoard</h1>
            <h3 className='font-bold text-lg mb-2'>Pending Inspections ({inspections.length})</h3>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className='text-red-500'>{error}</p>
            ) : inspections.length === 0 ? (
                <p className='text-gray-500'>No pending inspections right now.</p>
            ) : (
                inspections.map((inspection) => (
                    <InspectionCard key={inspection._id} inspection={inspection}  onDecided={handleDecided}/>
                ))
            )}
        </div>
    )
}