import React,{useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'
import { Dropdown,Modal,Button,Form,Spinner } from 'react-bootstrap'
import { getAuth, signOut } from "firebase/auth"
import "../firebaseconfig"
import { getStorage, ref as refer, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase,ref,set,onValue } from "firebase/database";



const Left = (props) => {
  const auth = getAuth();
  const navigate = useNavigate()
  const storage = getStorage();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [imgselect, setImgselect] = useState('')
  let [loading, setLoading] = useState(false)

// from database
userArr = []
useEffect(()=>{
    const db = getDatabase();
    const userRef = ref(db, 'users/');
    onValue(userRef, (snapshot) => {
      snapshot.forEach(item=>{
        if(){
            userArr.push(item.val())
        }
      })
    });  
    
},[])

// logout
  let handleLogout = ()=>{
    signOut(auth).then(() => {
      navigate("/Login")
    }).catch((error) => {
     console.log(error)
    });
  }
// profile picture change
let handleUploadPicture = (e)=>{
  setImgselect(e.target.files[0])
}
// profile picture upload for chaging
let handleChangePicture = ()=>{
    setLoading(true)
  const storageRef = refer(storage, `adminPicture${imgselect}`);
  const uploadTask = uploadBytesResumable(storageRef, imgselect);
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
    if(progress == 100){
        setShow(false)
        setLoading(false)
    }
    }, 
    (error) => {
      console.log(error)
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.refer).then((downloadURL) => {
        console.log('File available at', downloadURL);
        const db = getDatabase();
              set(ref(db, 'users/'+auth.currentUser.uid), {
                  username: props.username,
                  id: props.id,
                  email: props.email,
                  img: downloadURL
              });
      });
    }
  );
}


  return (
    <>
    <div className='admin'>
    <div className='admin_profile'>
    <img className='profile_img'src={props.img}/>
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {props.username}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1" onClick={handleShow}>change picture</Dropdown.Item>
        <Dropdown.Item href="#/action-2" onClick={handleLogout}>log out</Dropdown.Item>
        {/*pic modal start */}
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body><Form.Control type="file" onChange={handleUploadPicture}/></Modal.Body>
            <Modal.Footer>
            {loading?
            <Button variant="primary" onClick={handleChangePicture}>
             <Spinner animation="border" variant="light" />
          </Button>
            :
            <Button variant="primary" onClick={handleChangePicture}>
                Change Profile Picture
            </Button>
            }
            </Modal.Footer>
        </Modal>
        {/*pic modal end */}
      </Dropdown.Menu>
    </Dropdown>
    </div>
    </div>
    </>
  )
}

export default Left