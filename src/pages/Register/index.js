import React,{ useState,useContext } from 'react'
import api from '../../services/api'
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import {UserContext} from '../../user-context'


function Register({ history }) {

    const [email, SetEmail] = useState("");
    const [password,setPassword] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname,setLastname] = useState("");
    const [error,setError] = useState(false);
    const [errormessage,setErrorMessage] = useState("");
    const { setIsLogged } = useContext(UserContext);

    

    const handleSubmit = async event => {
        event.preventDefault();
        
        
        if(email !== "" && password !== "" && firstname !== "" && lastname !== "")
        {
            const response = await api.post('user/register',{firstname,lastname,email,password});
            const user = response.data.user || false;  
            const userid = response.data.userid || false; 
            console.log(user,userid);
        if(user && userid)
        {   
            localStorage.setItem('user',user);
            localStorage.setItem('userid',userid);   
            setIsLogged(true);         
            history.push('/');
        }
        else
        {
            const {message} = response.data;
            setError(true);
            setErrorMessage(message);
            setTimeout(() => {
                setError(false);
                setErrorMessage("");
            }, 3000);
        }

    }
    else
    {
            const message = "Please fill out all the details!";
            setError(true);
            setErrorMessage(message);
            setTimeout(() => {
                setError(false);
                setErrorMessage("");
            }, 3000);


    }
       
        
    }
    return (
        <div className = "container">
            {error ? (
                <Alert color="danger">{errormessage}</Alert>
            ): ""}

            
            <Form onSubmit = {handleSubmit}>
                <h1>Create New Account</h1>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="exampleEmail" className="mr-sm-2" />
                    <Input type="firstname" name="firstname" id="exampleFirstname" placeholder="Firstname" onChange = {event => setFirstname(event.target.value)}/>
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="examplePassword" className="mr-sm-2" />
                    <Input type="lastname" name="lastname" id="exampleLastname" placeholder="Lastname" onChange = {event => setLastname(event.target.value)} />
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="exampleEmail" className="mr-sm-2" />
                    <Input type="email" name="email" id="exampleEmail" placeholder="Email" onChange = {event => SetEmail(event.target.value)}/>
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="exampleEmail" className="mr-sm-2" />
                    <Input type="password" name="password" id="examplePassword" placeholder="Password" onChange = {event => setPassword(event.target.value)}/>
                </FormGroup>
                <FormGroup>
                    <Button style={{marginTop: "30px"}}  className="submit-btn" color="success">Submit</Button>
                </FormGroup>
                <FormGroup>
                    <Button  className="secondary-btn" onClick = {() => history.push('/login')}>Login Instead?</Button>
                </FormGroup>
             </Form>
        </div>
    )
}

export default Register 




