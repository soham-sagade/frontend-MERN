import React,{ useState,useContext } from 'react'
import api from '../../services/api'
import { Button, Form, FormGroup, Label, Input,Alert } from 'reactstrap';
import Navigate from '../NavbarComponent/Navbar';
import {UserContext} from '../../user-context'
function Login({ history }) {

    const [email, SetEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState(false);
    const [errormessage,setErrormessage] = useState(false);
    const { setIsLogged } = useContext(UserContext);

    const handleSubmit = async event => {
        event.preventDefault();
        

        const response = await api.post('login',{email,password});

        const userId = response.data.userid || false;
        const user = response.data.user || false;

        try {
            if(userId && user)
            {
                localStorage.setItem('userid',userId);
                localStorage.setItem('user',user);
                setIsLogged(true);
                history.push('/');
            }
    
            else
            {
                const {message} = response.data;
                setError(true);
                setErrormessage(message);
                setTimeout(() => {
                    setError(false);
                    setErrormessage("");
                }, 3000);
            }
                
        } catch (error) {
            setError(true)
            setErrormessage("Error, Server returned and unexpected error!")
        }

        
    }
    return (
        <div>
            {error ? (
                        <Alert color="danger">
                            {errormessage}
                        </Alert>
                    ) : ""}

            <Form onSubmit = {handleSubmit}>
                <h1>Login</h1>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
                    <Label for="exampleEmail" className="mr-sm-2" />
                    <Input type="email" name="email" id="exampleEmail" placeholder="Email" onChange = {event => SetEmail(event.target.value)}/>
                </FormGroup>
                <FormGroup className="mb-2 mr-sm-2 mb-sm-4">
                    <Label for="examplePassword" className="mr-sm-2" />
                    <Input type="password" name="password" id="examplePassword" placeholder="Password" onChange = {event => setPassword(event.target.value)} />
                </FormGroup>
                <FormGroup id = "submitbutton">
                    <Button className = "submit-btn">Submit</Button>
                </FormGroup>
                <FormGroup >
                    <Button onClick = {() => history.push('/registration')} className = "secondary-btn">Create New Account</Button>
                </FormGroup>
             </Form>
        </div>
    )
}

export default Login  




