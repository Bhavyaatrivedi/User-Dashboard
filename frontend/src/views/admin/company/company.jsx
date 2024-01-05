import {React, useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



const Company = () => {
    const [companies, setCompanies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('http://localhost:8000/get-company');
                setCompanies(response.data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };

        fetchCompanies();
    }, []);

    const handleAddCompany = async () => {
        try {
   
          const response = await axios.get('http://localhost:8000/get-user');
      
          
          console.log('Users:', response.data);
      
         
          navigate('/admin/add-company');
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };
      

  return (
    <div>
         
        <button
          className="bg-green-500 text-white py-1 px-2 rounded mb-2"
          style={{ marginTop: '10px' }}
          onClick={handleAddCompany}>
            Add Company
        </button>
    
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: 'white', borderRadius: '16px' }}>
        <thead>
            <tr>
                <th style={{ padding: '10px' }} className="text-left">S.No.</th>
                <th style={{ padding: '10px' }} className="text-left">Email</th>
                <th style={{ padding: '10px' }} className="text-left">Name</th>
                <th style={{ padding: '10px' }} className="text-left">Address</th>
                <th style={{ padding: '10px' }} className="text-left">Gst No.</th>
                <th style={{ padding: '10px' }} className="text-left">PAN No.</th>
                <th style={{ padding: '10px' }} className="text-left">Aadhar No.</th>
            </tr>
        </thead>
        <tbody>
            {companies.map((company, index) => (
                <tr key={company._id}>
                    <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{index + 1}.</td>
                    <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{company.email}</td>
                    <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{company.name}</td>
                    <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{company.address}</td>
                    <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{company.gst}</td>
                    <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{company.pan}</td>
                    <td style={{ padding: '10px', }} className="text-sm font-bold text-navy-700 dark:text-white">{company.aadhar}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
  )
}

export default Company