
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditUser = ({setRefechData ,user, onClose }) => {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    onClose();
  };

  const { _id: userId, email: initialEmail, address: initialAddress, mobileNo: initialMobileNo } = user;
  const [email, setEmail] = useState(initialEmail);
  const [address, setAddress] = useState(initialAddress);
  const [mobileNo, setMobileNo] = useState(initialMobileNo);

  const handleSaveChanges = async () => {
    try {
      const response = await axios.put(`http://localhost:8000/edit-user/${userId}`, {
        email,
        address,
        mobileNo,
      });
  
      console.log('Full response:', response);
      if(response.status && response.status == 200){
        setRefechData(true)
      }
      // const updatedUserData = await axios.get('http://localhost:8000/get-user');
     
      //   const updatedUser = updatedUserData.data.find(user => user._id === userId);

       
      //   setEmail(updatedUser.email);
      //   setAddress(updatedUser.address);
      //   setMobileNo(updatedUser.mobileNo);

  
      if (response.data.success) {
        toast.success(response.data.msg || 'User updated successfully');
  
      } else {
        toast.error(response.data.msg || 'Error updating user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user');
    } finally {
      handleClose();
    }
  };

 
  

  return (
    <div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                style={{ color: 'black' }}
                placeholder="Enter email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicTextarea">
              <Form.Label>Address</Form.Label>
              <Form.Control
                as="textarea"
                style={{ color: 'black' }}
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicTextarea">
              <Form.Label>MobileNo</Form.Label>
              <Form.Control
                as="textarea"
                style={{ color: 'black' }}
                placeholder="Enter mobile no."
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose} style={{ color: 'black' }}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges} style={{ color: 'black' }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditUser;















// import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Form from 'react-bootstrap/Form';
// import Modal from 'react-bootstrap/Modal';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const EditUser = ({ user, onClose }) => {
//   const [show, setShow] = useState(true);
  
//   const handleClose = () => {
//     setShow(false);
//     onClose();
//   };

//   const saveChanges = async () => {
//     try {
     
//       const response = await axios.get('http://localhost:8000/get-user');

//       console.log('Users:', response.data);
//     } catch (error) {
   
//       console.error('Error fetching users:', error.message);
//     }
//     handleClose();
//   };

  
  
//   const { _id: userId, email: initialEmail, address: initialAddress, mobileNo: initialMobileNo } = user;
//   const [email, setEmail] = useState(initialEmail);
//   const [address, setAddress] = useState(initialAddress);
//   const [mobileNo, setMobileNo] = useState(initialMobileNo);


//   return (
//     <div>
//       <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//           <Modal.Title>Edit User</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3" controlId="formBasicEmail">
//               <Form.Label>Email address</Form.Label>
//               <Form.Control
//                 type="email"
//                 style={{ color: 'black' }}
//                 placeholder="Enter email"
//                 autoFocus
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formBasicTextarea">
//               <Form.Label>Address</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 style={{ color: 'black' }}
//                 placeholder="Enter address"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3" controlId="formBasicTextarea">
//               <Form.Label>MobileNo</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 style={{ color: 'black' }}
//                 placeholder="Enter mobile no."
//                 value={mobileNo}
//                 onChange={(e) => setMobileNo(e.target.value)}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button onClick={handleClose} style={{ color: 'black' }}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={saveChanges} style={{ color: 'black' }}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default EditUser;