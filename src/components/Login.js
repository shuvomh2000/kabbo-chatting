
import { Link,useNavigate,useLocation} from 'react-router-dom'
import React,{useState} from 'react'
import { Container,Form,Button,Spinner,Modal} from 'react-bootstrap'
import { getAuth, signInWithEmailAndPassword,sendPasswordResetEmail  } from "firebase/auth";
import '../firebaseconfig'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const notify = () => toast(state)
    const notify2 = () => toast("Reset password to your email");
    const auth = getAuth();
    const navigate = useNavigate()
    let {state} = useLocation()
    let [email,setEmail] =useState('')
    let [erremail,setErremail] =useState('')
    let [password,setPassword] =useState('')
    let [errpassword,setErrpassword] =useState('')
    let [resetmail,setResetmail] =useState('')
    let [errresetmail,setErresetmail] =useState('')
    let [notifys,setNotifys] =useState(true)
    let [loading,setLoading] =useState(false)
    let [wrongpassword,setWrongpassword] =useState(false)
    let [forgetpass,setForgetpass] =useState(false)
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let handleEmail = (e)=>{
        setEmail(e.target.value)
    }
    let handlePassword = (e)=>{
        setPassword(e.target.value)
    }
    if(notifys){
        if(state){
            notify()
            setNotifys(false)
        }
    }
   
    let handleSubmit = (e)=>{
        e.preventDefault()
        if(email == ""){
            setErremail("Please Give Your Email")
        }else if(password == ''){
            setErrpassword("please Give Your Password")
        }else{
            setLoading(true)
           
            signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                setEmail('')
                setErremail('')
                setPassword('')
                setErrpassword('')
                setLoading(false)
                navigate("/",{state:"Successfully Login"})
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(errorCode.includes('wrong')){
                    setWrongpassword('Incorrect Passwrod')
                    setLoading(false)
                    setForgetpass(true)
                }
            });
        }
    }

    let handleResetEmail = (e)=>{
        setResetmail(e.target.value)
    }
    
    let handleResetPass = ()=>{
        if(resetmail == ''){
            setErresetmail('Give a email')
        }else{
            sendPasswordResetEmail(auth, resetmail)
            .then(() => {
                setShow(false)
                notify2()
            })
            .catch((error) => {
                console.log(error)
            });
        }
    }

  return (
    <div>
    <>
    <div className='registration'>
    <ToastContainer/>
      <Container>
        <div>
        <Form className='main_registration'>
            <h1 className='reg_heading'>Login</h1>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Control onChange={handleEmail} type="email" placeholder=" Email" value={email} />
                {erremail?
                <p className='err'>{erremail}</p>
                :""}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Control onChange={handlePassword} type="password" placeholder="Password" value={password}  />
                {errpassword?
                <p className='err'>{errpassword}</p>
                :""}
                {wrongpassword?
                <p className='err'>{wrongpassword}</p>
                :""}
            </Form.Group>
            {loading?
            <Button onClick={handleSubmit} className='btn' variant="primary" type="submit">
            <Spinner animation="border" variant="light" />
            </Button>
            :
            <Button onClick={handleSubmit} className='btn' variant="primary" type="submit">
            login
            </Button>
            }
            {forgetpass?<p className='forget'onClick={handleShow}>forget password?</p>:''}

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title className='heading_modal'>password reset</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <Form.Control type="email" onChange={handleResetEmail}  placeholder="Enter email" />
                {errresetmail?<p className='err'>{errresetmail}</p>:''}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="primary" onClick={handleResetPass}>
                    Reset
                </Button>
                </Modal.Footer>
            </Modal>
            <h3>don't have an account? <Link to="/registration">Sign-up</Link></h3>
            
        </Form>
        </div>
        </Container>
      </div>
    </>
    </div>
  )
}

export default Login