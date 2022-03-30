import React,{useState} from 'react'
import { Container,Form,Button } from 'react-bootstrap'
import '../firebaseconfig'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";


const Registration = () => {

    let [username,setUsername] =useState('')
    let [errusername,setErrusername] =useState('')

    let [email,setEmail] =useState('')
    let [erremail,setErremail] =useState('')
    
    let [password,setPassword] =useState('')
    let [errpassword,setErrpassword] =useState('')
    
    let [cpassword,setCpassword] =useState('')
    let [errcpassword,setErrcpassword] =useState('')

    let handleName = (e)=>{
        setUsername(e.target.value)
    }
    let handleEmail = (e)=>{
        setEmail(e.target.value)
    }
    let handlePassword = (e)=>{
        setPassword(e.target.value)
    }
    let handleCpassword = (e)=>{
        setCpassword(e.target.value)
    }

    let handleSubmit = (e)=>{
        e.preventDefault()
        if(username == ""){
            setErrusername("Please Give Your Name")
        }else if(email == ''){
            setErremail("please Give Your Email")
        }else if(password ==""){
            setErrpassword("Please Give Your Password")
        }else if(cpassword != password){
            setErrcpassword('Confirm Your Password')
        }
    }

  return (
      <>
    
      <div className='registration'>
      <Container>
        <div>
        <Form className='main_registration'>
            <h1 className='reg_heading'>registration</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control onChange={handleName} type="text" placeholder="Name" />
                {errusername?
                <p className='err'>{errusername}</p>
                :""}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control onChange={handleEmail} type="email" placeholder=" Email" />
                <p>please</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control onChange={handlePassword} type="password" placeholder="Password" />
                <p>please</p>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control onChange={handleCpassword} type="password" placeholder="Re-Type Your Password" />
                <p>please</p>
            </Form.Group>
            <Button onClick={handleSubmit} className='btn' variant="primary" type="submit">
                Submit
            </Button>
            <h3>Already have an account? <a href="login.html">login</a>.</h3>
        </Form>
        </div>
        </Container>
      </div>
      </>
  )
}

export default Registration