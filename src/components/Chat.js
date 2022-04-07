import { Button,Form,Card } from 'react-bootstrap'
import { getAuth } from "firebase/auth"
import React ,{useState,useEffect} from 'react'
import { getDatabase,ref,set,onValue,remove,push } from "firebase/database";
import "../firebaseconfig"
import { useSelector } from 'react-redux';


const Chat = () => {
  const auth = getAuth();
  const db = getDatabase()
  let userdata = useSelector(item=>item.activeuser.id)
  let grpdata = useSelector(item=>item.activegrp.id)

  let [msg, setMsg] = useState('')
  let [usermsg, setUsermsg] = useState([])
  let [grpmsg, setGrpmsg] = useState([])
  // let [automsgsend,setAutomsgsend] = useState(false)


  // input target
  let handleMsg = (e)=>{
    setMsg(e.target.value)
  }

  // massage send(out)
  let handleSendMsg = (e)=>{
    console.log(e)
    set(push(ref(db, 'messages/')), {
      msg: msg,
      name: auth.currentUser.displayName,
      receiver: userdata,
      sender: auth.currentUser.uid
  })
  // setAutomsgsend(!automsgsend) 
  setMsg('')
  }
  
  // massage In
  let msgArr = []
  useEffect (()=>{
    const db = getDatabase();
    const userRef = ref(db, 'messages/');
    onValue(userRef, (snapshot) => {
    snapshot.forEach(item=>{
      msgArr.push(item.val())
    })
    setUsermsg(msgArr)
    })
    },[userdata])


  // group massage In
  let grpmsgArr = []
  useEffect (()=>{
    const db = getDatabase();
    const userRef = ref(db, 'messages/');
    onValue(userRef, (snapshot) => {
    snapshot.forEach(item=>{
      grpmsgArr.push(item.val())
    })
    setGrpmsg(grpmsgArr)
    })
    },[grpdata])


  return (
    <>
    <div className='Chat'>
    {usermsg.map(item=>(
    item.receiver == userdata || item.sender == userdata
     ?
     <Card style={item.sender == auth.currentUser.uid?receiver:sender}>
     <Card.Body>
       <Card.Title>{item.name}</Card.Title>
       <Card.Text>
         {item.msg}
       </Card.Text>
     </Card.Body>
   </Card>
   :
   ''
   ))}
    {grpmsg.map(item=>(
      item.id == auth.currentUser.uid || item.admin == auth.currentUser.uid
     ?
     <Card style={item.admin == auth.currentUser.uid?receiver:sender}>
     <Card.Body>
       <Card.Title>{item.name}</Card.Title>
       <Card.Text>
         {item.msg}
       </Card.Text>
     </Card.Body>
   </Card>
   :
   ''
   ))}
    <div className='footer'>
      <Button onClick={handleSendMsg}  className='file_btn'>s</Button>
      <Form.Control onChange={handleMsg} className='file_input' type="text" placeholder=" write a massage" value={msg} />
    </div>
    </div>
    </>
  )
}

let sender = {
  width: "400px",
  marginRight: "auto",
}

let receiver = {
  width: "300px",
  marginLeft: "auto"
}


export default Chat