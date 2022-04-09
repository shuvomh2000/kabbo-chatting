import React,{useEffect, useState} from 'react'
import {useNavigate } from 'react-router-dom'
import { Dropdown,Modal,Button,Form,Spinner,Accordion,ListGroup } from 'react-bootstrap'
import { getAuth, signOut } from "firebase/auth"
import "../firebaseconfig"
import { getStorage, ref as refer, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getDatabase,ref,set,onValue,remove,push,child,get } from "firebase/database";
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux';




const Admin = (props) => {
  let grpdata = useSelector(item=>item.activegrp.id)
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const storage = getStorage();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose2 = () => setShow2(false);
  const handleShow2 = () => setShow2(true);

  let [users, setUsers] = useState([])
  let [requsers, setRequsers] = useState([])
  let [friends, setFriends] = useState([])
  let [group, setGroup] = useState([])
  let [picupload, setPicupload] = useState('')
  let [imgselect, setImgselect] = useState('')
  let [activeuser, setActiveuser] = useState('')
  let [activeusergrp, setActiveusergrp] = useState('')
  let [activegrp, setActivegrp] = useState('')
  let [grpname, setGrpname] = useState('')
  let [loading, setLoading] = useState(false)
  

  // logout
  let handleLogout = ()=>{
    signOut(auth).then(() => {
      navigate("/Login")
    }).catch((error) => {
     console.log(error)
    });
  }
  
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
              setImgselect(item.val().img)
            }              
            })
            setUsers(userArr)
        });
      },[props.id])


// profile picture change
let handleUploadPicture = (e)=>{
  setPicupload(e.target.files[0])
}
// profile picture upload for chaging
let handleChangePicture = ()=>{
    setLoading(true)
  const storageRef = refer(storage, `userprofile/${auth.currentUser.uid}/${picupload.name}`);
  const uploadTask = uploadBytesResumable(storageRef, picupload);
  uploadTask.on('state_changed', 
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      setShow(false)
      // setLoading(false)
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
    grpName: grpname,
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
              console.log(item.val())
                grpArr.push(item.val())
                let grpinfo ={
                  id:item.key,
                  groupname:item.val().grpName,
                  adminName:item.val().adminName,
                  adminID:item.val().admin,
                }
                grpArr.push(grpinfo)
                setActivegrp(grpinfo)
            })
            setGroup(grpArr)
        });
 },[])

 // group redux
let handleActivegrp = (id)=>{
  setActiveusergrp(id)
  dispatch({type:"ACTIVE_GRP", payload:id})
}
// group add member
 let handleGrpaddMember =(id,name)=>{
  set(ref(db, `group/${grpdata.id}/${id}`),{
    id:id,
    name:name,
  })
 }
return (
    <>
    <div className='admin'>
    <div className='admin_profile'>
    <img className='profile_img'src={imgselect}/>
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
            <Button variant="primary">
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
    <div className='add_friend'>
    <Accordion defaultActiveKey={['0']} alwaysOpen>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Friends</Accordion.Header>
          <Accordion.Body>
            {friends.map(item=>(
            <ListGroup className='friends'>
              {
              item.receiver == auth.currentUser.uid
              ?
              <ListGroup.Item  style={activeuser == item.sender ? active:notactive} onClick={()=>handleActive(item.sender)}>{item.username}</ListGroup.Item>
              :
              item.sender == auth.currentUser.uid
              ?
              <ListGroup.Item style={activeuser == item.id ? active:notactive} onClick={()=>handleActive(item.receiver)}>{item.Reqaceepter}</ListGroup.Item>
              :
              ""
              }
            </ListGroup>
            ))}
            {/* group name */}
            {group.map(item=>(
            <ListGroup className='friends'>
              { item.admin == auth.currentUser.uid
              ?
                  <ListGroup.Item style={activeusergrp == item.id ? active:notactive} onClick={()=>handleActivegrp(activegrp)}>{item.grpName}</ListGroup.Item>
              :
               item.id == auth.currentUser.uid
              ?
                  <ListGroup.Item style={activeusergrp == item.admin ? active:notactive} onClick={()=>handleActivegrp(activegrp)}>{item.grpName}</ListGroup.Item>
              :
              ''
               }
            </ListGroup>     
          ))}
            {/* group name */}
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Friends Request</Accordion.Header>
          <Accordion.Body>
        {requsers.map(item=>(
          <ListGroup className='friends_req'>
          {item.receiver == auth.currentUser.uid
          ?
          <ListGroup.Item className='d-flex justify-content-between'>
            <div>
                <img className='list_img'src={imgselect}/>{item.username}
            </div>
            <div className='icon_aceept'>
                  <Button style={{background:"green"}} onClick={()=>handleAceept(item.sender,item.username)}>A</Button>
                  <Button style={{background:"red"}}>r</Button>
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
            <ListGroup className='add_friends'>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <div>
                    <img className='list_img'src={imgselect}/>{item.username}
                    </div>
                    <div className='icon_send'>
                    <Button onClick={()=>handleSendRequest(item.id,item.username)}>Add</Button>
                    </div>
                  </ListGroup.Item>
            </ListGroup>     
          ))}
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="3" className="group">
          <Accordion.Header>Group</Accordion.Header>
          <Accordion.Body>
            {/*  */}
            <div  className='d-flex'>
            <Form.Control type="text" onChange={handleGroupName} placeholder="write a name"/>
              <Button style={{width:"18%"}} onClick={handleCreateGrp}>
                      ok
              </Button>
            </div>
            <Button variant="primary" onClick={handleShow2}>
        Launch demo modal
      </Button>

            <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>Modal headingbgfbngfng</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose2}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
            {/*  */}
            {group.map(item=>(
            <ListGroup>
              {item.admin == auth.currentUser.uid?
                  <ListGroup>
                        <ListGroup.Item>
                          <div className='icon_send'>
                          {/* inner accordion */}
                          <Accordion>
                              <Accordion.Item eventKey="0">
                                <Accordion.Header onClick={()=>handleActivegrp(activegrp)}>{item.grpName}</Accordion.Header>
                                <Accordion.Body>
                                {friends.map(item=>(
                                      <ListGroup>
                                        {
                                        item.receiver == auth.currentUser.uid 
                                        ?
                                          <div className='d-flex justify-content-around'>
                                            <ListGroup.Item>{item.username}</ListGroup.Item>
                                            <Button className="w-25" onClick={()=>handleGrpaddMember(item.sender,item.username)}>+</Button>
                                          </div>
                                        :
                                        item.sender == auth.currentUser.uid
                                        ?
                                            <div className='d-flex justify-content-around'>
                                              <ListGroup.Item>{item.Reqaceepter}</ListGroup.Item>
                                              <Button className="w-25" onClick={()=>handleGrpaddMember(item.receiver,item.Reqaceepter)}>+</Button>
                                            </div>
                                        :
                                        ''
                                        }
                                      </ListGroup>
                                      ))}
                                </Accordion.Body>
                              </Accordion.Item>
                            </Accordion>
                          {/* inner accordion */}
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