import React,{useState} from 'react'
import { Container,Form,Button,Spinner} from 'react-bootstrap'
import '../firebaseconfig'
import { getAuth, createUserWithEmailAndPassword,updateProfile,sendEmailVerification } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { Link,useNavigate} from 'react-router-dom'



const Registration = () => {
    const navigate = useNavigate()
    let [username,setUsername] =useState('')
    let [errusername,setErrusername] =useState('')
    let [email,setEmail] =useState('')
    let [erremail,setErremail] =useState('')
    let [password,setPassword] =useState('')
    let [errpassword,setErrpassword] =useState('')
    let [cpassword,setCpassword] =useState('')
    let [errcpassword,setErrcpassword] =useState('')
    let [loading,setLoading] =useState(false)
    let [sameemail,setSameemail] =useState('')

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
        }else if(cpassword == '' || cpassword != password){
            setErrcpassword("Re-Type Your Password")
        }else{
            setLoading(true)
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, email, password)
            .then((user) => {
                updateProfile(auth.currentUser, {
                    displayName: username,
                    photoURL: "https://www.alaska.edu/_resources/images/placeholders/profile.png"
                  }).then(() => {
                        const db = getDatabase();
                        set(ref(db, 'users/' + auth.currentUser.uid), {
                            username: username,
                            email: email,
                            id: user.user.uid,
                            img: user.user.photoURL 
                        }).then(() =>{
                            setUsername('')
                            setErrusername('')
                            setEmail('')
                            setErremail('')
                            setErremail('')
                            setPassword('')
                            setErrpassword('')
                            setCpassword('')
                            setErrcpassword('')
                            sendEmailVerification(auth.currentUser)
                            setLoading(false)
                            navigate("/login",{state:"Account Created Successfully"})
                        })


                  }).catch((error) => {
                      console.log(error)
                  });

                
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode.includes("already")){
                    setSameemail("Email Already Use")
                    setLoading(false)
                }
            });
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
                <Form.Control onChange={handleName} type="text" placeholder="Name" value={username} />
                {errusername?
                <p className='err'>{errusername}</p>
                :""}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control onChange={handleEmail} type="email" placeholder=" Email" value={email} />
                {erremail?
                <p className='err'>{erremail}</p>
                :""}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control onChange={handlePassword} type="password" placeholder="Password" value={password} />
                {errpassword?
                <p className='err'>{errpassword}</p>
                :""}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control onChange={handleCpassword} type="password" placeholder="Re-Type Your Password" value={cpassword}/>
                {errcpassword?
                <p className='err'>{errcpassword}</p>
                :""}
                {sameemail?
                <p className='err'>{sameemail}</p>
                :""}
            </Form.Group>
            {loading?
            <Button onClick={handleSubmit} className='btn' variant="primary" type="submit">
            <Spinner animation="border" variant="light" />
            </Button>
            :
            <Button onClick={handleSubmit} className='btn' variant="primary" type="submit">
            sign-up
            </Button>
            }
           
            <h3>Already have an account? <Link to="/login">Login</Link></h3>
            
        </Form>
        </div>
        </Container>
      </div>
      </>
  )
}

export default Registration