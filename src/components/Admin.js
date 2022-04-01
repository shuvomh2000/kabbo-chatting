import React,{useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'
import { Dropdown,Modal,Button,Form,Spinner,Accordion,ListGroup } from 'react-bootstrap'
import { getAuth, signOut } from "firebase/auth"
import "../firebaseconfig"
import { getStorage, ref as refer, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase,ref,set,onValue,remove } from "firebase/database";



const Admin = (props) => {
  const auth = getAuth();
  const db = getDatabase();
  const navigate = useNavigate()
  const storage = getStorage();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [users, setUsers] = useState([])
  let [requsers, setRequsers] = useState([])
  let [imgselect, setImgselect] = useState('')
  let [loading, setLoading] = useState(false)
  let [updatepicture, setUpdatepicture] = useState('')
// from database
let userArr = []
      useEffect(()=>{
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
            snapshot.forEach(item=>{
             if(props.id !== item.key){
              userArr.push(item.val())
             }
            //  else{
            //   setUpdatepicture(item.val().img)
            // }              
            })
            setUsers(userArr)
        });
      },[props.id])

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
  const storageRef = refer(storage, `adminPicture${imgselect.name}`);
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
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
           set(ref(db, 'users/' + auth.currentUser.uid), {
             username: props.username,
             email: props.email,
             id: props.id,
             img: downloadURL 
           });
      });
    }
  );
}
// friend request send
  let handleSendRequest = (id,name)=>{
    set(ref(db, 'SendRequests/'+auth.currentUser.uid), {
      ReqReceiver:name,
      username: auth.currentUser.displayName,
      receiver: id,
      sender: auth.currentUser.uid,
    });
    remove(ref(db, 'users/'+id))
  }
//  request accept
let reqArr = []
      useEffect(()=>{
        const db = getDatabase();
        const userRef = ref(db, 'SendRequests/');
        onValue(userRef, (snapshot) => {
            snapshot.forEach(item=>{
              reqArr.push(item.val())
            })
            setRequsers(reqArr)
        });
 },[])

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
              <Modal.Title>Change Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body><Form.Control type="file" onChange={handleUploadPicture}/></Modal.Body>
            <Modal.Footer>
            {loading?
            <Button variant="primary" onClick={handleChangePicture}>
             <Spinner animation="border" variant="light" />
          </Button>
            :
            <Button variant="primary" onClick={handleChangePicture}>
                Upload
            </Button>
            }
            </Modal.Footer>
        </Modal>
        {/*pic modal end */}
      </Dropdown.Menu>
    </Dropdown>
    </div>
    <div className='acas'>

    </div>
    <div className='add_friend'>
    <Accordion defaultActiveKey={['0']} alwaysOpen>
  <Accordion.Item eventKey="0">
    <Accordion.Header>Friends</Accordion.Header>
    <Accordion.Body>
      1
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="1">
    <Accordion.Header>Friends Request</Accordion.Header>
    <Accordion.Body>
   {requsers.map(item=>(
     <ListGroup>
     {item.receiver == auth.currentUser.uid
     ?

     <ListGroup.Item>
      <div>
          <img className='list_img'src={props.img}/>{item.username}
          </div>
          <div className='icon_aceept'>
            <Button>A</Button>
            <Button>r</Button>
      </div>
     </ListGroup.Item>
    
     :
     item.sender == auth.currentUser.uid
     
     ?
     <ListGroup.Item>{item.reqSenderName}</ListGroup.Item>
     :
     ""
     }
   </ListGroup>
   ))}
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="2">
    <Accordion.Header>Add Freind</Accordion.Header>
    <Accordion.Body>
    {users.map(item=>(
       <ListGroup>
            <ListGroup.Item className="log_user">
              <div>
              <img className='list_img'src={props.img}/>{item.username}
              </div>
              <div className='icon_send'>
              <Button onClick={()=>handleSendRequest(item.id,item.username)}>Add</Button>
              </div>
            </ListGroup.Item>
       </ListGroup>     
    ))}
    </Accordion.Body>
  </Accordion.Item>
  <Accordion.Item eventKey="3">
    <Accordion.Header>Group</Accordion.Header>
    <Accordion.Body>

    </Accordion.Body>
  </Accordion.Item>
</Accordion>
    </div>
    </div>
    </>
  )
}

let active ={
  color: "red" 
}
let notactive ={
  color: "#000" 
}

export default Admin