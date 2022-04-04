import React, { useState} from 'react'
import {useNavigate,useLocation} from 'react-router-dom'
import { Row,Col } from 'react-bootstrap';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import '../firebaseconfig'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Admin from './Admin'
import Chat from './Chat'

const Home = () => {
    const auth = getAuth()
    const notify = () => toast(state);
    const navigate = useNavigate()
    let {state} = useLocation()

    // let [notifys,setNotifys] = useState(true)
    let [name,setName] = useState('')
    let [id,setId] = useState('')
    let [email,setEmail] = useState('')
    let [img,setImg] = useState('')
    let [time,setTime] = useState('')
    
    // if(notifys){
    //     if(state){
    //         notify()
    //         setNotifys(false)
    //     }
    // }

    onAuthStateChanged(auth, (user) => {
        if (user) {
          setName(user.displayName)
          setId(user.uid)
          setEmail(user.email)
          setImg(user.photoURL)
          setTime(user.metadata.creationTime)
        } else {
            navigate("/login")
        }
      })

  return (
    <>
    <div className='home'>
    {/* <ToastContainer/> */}
    <Admin username={name} email={email} img={img} id={id}/>
    <Chat/>
    </div>

    </>
  )
}

export default Home