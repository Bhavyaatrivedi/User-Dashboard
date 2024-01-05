import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {React, useState, useEffect} from 'react';
import axios from 'axios';
import './style.css'
import { Form, Dropdown } from 'react-bootstrap';



const AddCompany = () => {
    const [selectUsers, setSelectUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);


    const dropDownShow = () => { 
        setIsOpen(!isOpen); 
    }; 
 

      const[formData, setFormData] = useState({
        name: '',
        email: '',
        aadhar: '',
        pan: '',
        gst: '',
        address: '',
        selectedUser : ''
    });

     
  const handleChange = (e) =>{
        setFormData({...formData, [e.target.name]: e.target.value})
    }

 


    const handleSubmit = async(e) =>{
        try{
            const url = 'http://localhost:8000/add-company';
            const response = await axios.post(url , formData);

            if(response.data.created){
             
                setFormData({
                    name: '',
                    email: '',
                    aadhar: '',
                    pan: '',
                    gst: '',
                    address: '',
                    selectedUser: '',
                })
                toast.success('Company added!');
                console.log("added");
            }

            else{
                console.error('Error adding company:', response.data.errors);
                console.log("error")
                toast.error(`Error adding company: ${response.data.errors}`);
            }

        }catch(error){
            console.error('Error creating user:', error);
            console.log("erorr", error)
            toast.error('Error creating user');
        }
    }

    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get('http://localhost:8000/get-user');
            setSelectUsers(response.data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };
    
        fetchUsers();
      }, []);


    return (
        <div style={{ marginTop: '60px' , marginLeft: '30px', marginRight: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '8px'}}>
     
     
            <ToastContainer position="top-right" autoClose={5000}/>
                <form onSubmit={handleSubmit}>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Name
                </label>
                <input
                    className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    type="text"     
                    name="name"
                    placeholder="Enter the name of company"
                    value={formData.name} onChange={handleChange} required 
                />
                </div>


                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    type="text"     
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email} onChange={handleChange} required 
                />
                </div>



                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gst">
                    GST No.
                </label>
                <input
                    className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    type="text"      
                    name="gst"
                    placeholder="Enter your gst no."
                    value={formData.gst} onChange={handleChange} required
                />
                </div>

                

                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="aadhar">
                    Aadhar No.
                </label>
                <input
                    className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    type="text"      
                    name="aadhar"
                    placeholder="Enter your aadhar no."
                    value={formData.aadhar} onChange={handleChange} required
                />
                </div>

                

                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gst">
                    PAN No.
                </label>
                <input
                    className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    type="text"      
                    name="pan"
                    placeholder="Enter your pan no."
                    value={formData.pan} onChange={handleChange} required
                />
                </div>

            
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                    Address
                </label>
                <input
                    className="w-full border rounded py-2 px-3 focus:outline-none focus:border-blue-500"
                    type="address"
                    id="address"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address} onChange={handleChange} required 
                />
                </div>

   
        

                <div className="mb-4" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="custom-dropdown" style={{ flex: '1' }}>
                    <button
                    className="custom-dropdown-toggle blue-button"
                    type="button"
                    id="multiSelectDropdown"
                    onClick={dropDownShow}
                    >
                    Select User <span className={`arrow ${isOpen ? 'up' : 'down'}`}></span>
                    </button>
                    {isOpen && (
                <div className={`custom-dropdown-menu ${isOpen ? 'show' : ''}`} aria-labelledby="multiSelectDropdown">
                {selectUsers.map((user) => (
                  <Form.Check
                    className="custom-checkbox"
                    key={user._id}
                    type="checkbox"
                    id={`user_${user._id}`}
                    label={user.email}
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => {
                      if (selectedUsers.includes(user._id)) {
                        setSelectedUsers(selectedUsers.filter((id) => id !== user._id));
                      } else {
                        setSelectedUsers([...selectedUsers, user._id]);
                      }
                    }}
                  />
                ))}
              </div>
                    )}
                </div>
                <div style={{ marginLeft: '20px', width: '50%' }}>
                    <h2 style={{ fontSize: '16px' }}>Selected User:</h2>
                    <p>
                    {selectedUsers.map((userId) => (
                        <span key={userId}>{selectUsers.find((user) => user._id === userId)?.email}, </span>
                    ))}
                    </p>


                </div>
                </div>
            
                <button
                    className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                >
                    Add company
                </button>

            </form>

    </div>
  );
  
}

export default AddCompany