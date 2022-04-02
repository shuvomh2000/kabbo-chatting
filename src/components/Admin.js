import React,{useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'
import { Dropdown,Modal,Button,Form,Spinner,Accordion,ListGroup } from 'react-bootstrap'
import { getAuth, signOut } from "firebase/auth"
import "../firebaseconfig"
import { getStorage, ref as refer, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase,ref,set,onValue,remove,push } from "firebase/database";
import { useDispatch } from 'react-redux'



const Admin = (props) => {
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const storage = getStorage();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let [users, setUsers] = useState([])
  let [requsers, setRequsers] = useState([])
  let [friends, setFriends] = useState([])
  let [group, setGroup] = useState([])
  let [imgselect, setImgselect] = useState('')
  let [activeuser, setActiveuser] = useState('')
  let [testing, setTesting] = useState('')
  let [grpname, setGrpname] = useState('')
  let [loading, setLoading] = useState(false)
  let [updatepicture, setUpdatepicture] = useState('')
  let [test, setTest] = useState('')

  
// log in users
let userArr = []
      useEffect(()=>{
        const userRef = ref(db, 'users/');
        onValue(userRef, (snapshot) => {
            snapshot.forEach(item=>{
             if(props.id !== item.key){
              userArr.push(item.val())
             }
             else{
              setUpdatepicture(item.val().img)
            }              
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
        setTest(downloadURL)
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
  }
//  request array
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

// request accept
let handleAceept = (id,name)=>{
  set(ref(db, 'accept/'+id), {
    Reqaceepter:auth.currentUser.displayName,
    username: name,
    receiver: auth.currentUser.uid,
    sender: id,
  });
  remove(ref(db, 'SendRequests/'+id))
}

// friend list
let frndArr = []
      useEffect(()=>{
        const db = getDatabase();
        const userRef = ref(db, 'accept/');
        onValue(userRef, (snapshot) => {
            snapshot.forEach(item=>{
              frndArr.push(item.val())
            })
            setFriends(frndArr)
        });
 },[])

// redux
let handleActive = (id)=>{
  setActiveuser(id)
  dispatch({type:"ACTIVE_USER", payload:id})
}

// group name
let handleGroupName = (e)=>{
  setGrpname(e.target.value)
}

// create new grp
 let handleCreateGrp = ()=>{
  setLoading(true)
  set(push(ref(db, 'group/')), {
    name: grpname,
    adminName: auth.currentUser.displayName,
    admin: auth.currentUser.uid
  })
    setLoading(false)
    setShow(false)
 }

//  group array
let grpArr = []
      useEffect(()=>{
        const db = getDatabase();
        const userRef = ref(db, 'group/');
        onValue(userRef, (snapshot) => {
            snapshot.forEach(item=>{
                grpArr.push(item.val())
                setTesting(item.key)
            })
            setGroup(grpArr)
        });
 },[])

 // group redux
let handleActivegrp = (id)=>{
  dispatch({type:"ACTIVE_GRP", payload:id})
}
// group add member
 let handleGrpaddMember =(id,name)=>{
  set(ref(db, 'addGrpMember/'+ auth.currentUser.uid), {
    Reqaceepter:auth.currentUser.displayName,
    username: name,
    receiver: auth.currentUser.uid,
    sender: id,
  });
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
            {friends.map(item=>(
            <ListGroup>
              {
              item.receiver == auth.currentUser.uid
              ?
              <ListGroup.Item style={activeuser == item.sender ? active:notactive} onClick={()=>handleActive(item.sender)}>{item.username}</ListGroup.Item>
              :
              // item.sender == auth.currentUser.uid
              // ?
              // <ListGroup.Item style={activeuser == item.id ? active:notactive} onClick={handleActive(item.receiver)}>{item.Reqaceepter}</ListGroup.Item>
              // :
              ""
              }
            </ListGroup>
            ))}
            {/* group name */}
            {group.map(item=>(
            <ListGroup>
              {item.admin == auth.currentUser.uid?
                  <ListGroup.Item className="log_user" onClick={()=>handleActivegrp(testing)}>{item.name}</ListGroup.Item>
                  :""}
            </ListGroup>     
          ))}
            {/* group name */}
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
                  <Button onClick={()=>handleAceept(item.sender,item.username)}>A</Button>
                  <Button>r</Button>
            </div>
          </ListGroup.Item>
          :
            ''
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
            {/*  */}
            <Form.Control type="text" onChange={handleGroupName} placeholder="write a name"/>
              <Button onClick={handleCreateGrp}>
                      create
              </Button>
            {/*  */}
            {group.map(item=>(
            <ListGroup>
              {item.admin == auth.currentUser.uid?
                  <ListGroup>
                        <ListGroup.Item className="log_user">
                          {/* <div>
                          <img className='list_img'src={props.img}/>
                          {item.name}
                          </div> */}
                          <div className='icon_send'>
                          {/* <Button>Add Member</Button> */}
                          <Accordion>
                              <Accordion.Item eventKey="0">
                                <Accordion.Header>{item.name}</Accordion.Header>
                                <Accordion.Body>
                                {friends.map(item=>(
                                      <ListGroup>
                                        {
                                        item.receiver == auth.currentUser.uid
                                        ?
                                        <ListGroup.Item>{item.username}<Button onClick={()=>handleGrpaddMember(item.id,item.username)}>+</Button></ListGroup.Item>
                                        :
                                        ""
                                        }
                                      </ListGroup>
                                      ))}
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          </div>
                        </ListGroup.Item>
                  </ListGroup>
                  :""}
            </ListGroup>     
          ))}
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