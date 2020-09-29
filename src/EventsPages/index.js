import React, {useState,useMemo,useEffect} from 'react';
import { Button, Form, FormGroup, Label, Input, Container, Alert,ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, ButtonGroup} from 'reactstrap';
import cameraIcon from  '../assets/camera.png';
import api from '../services/api';
import '../EventsPages/events.css'
function Events({history}) {

    const user = localStorage.getItem('user');
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const [price,setPrice] = useState("");
    const [sport,setSport] = useState("Sport Event");
    const [date,setDate] = useState("");
    const [thumbnail,setThumbnail] = useState(null);
    const [error,setError] = useState(false);
    const [errormessage,setErrorMessage] = useState("");
    const [success,setSuccess] = useState(false);
    const [successmessage,setSuccessMessage] = useState("");
    const [dropdownOpen, setOpen] = useState(false);
        
    useEffect(() => {
        if(!user) history.push('/login');
    }, [])
      
    const toggle = () => setOpen(!dropdownOpen);
    
    
    const preview = useMemo(() => {
        return thumbnail ?  URL.createObjectURL(thumbnail) : null;
    },[thumbnail])

    const submitHandler = async (event) => {
        event.preventDefault();
        
        const eventdata = new FormData();

        eventdata.append('thumbnail',thumbnail);
        eventdata.append('sport',sport);
        eventdata.append('title',title);
        eventdata.append('description',description);
        eventdata.append('price',price);
        eventdata.append('date',date);

        try {
            if(title !== "" && 
            description !== "" &&
            price !== "" && 
            sport !== "Sport Event" && 
            date !== "" && 
            thumbnail !== null)
            {
                const response =  await api.post('/event',eventdata,{headers :{user}});
                setSuccess(true);
                const {message} = response.data;
                setSuccessMessage(message);
                setTimeout(() => {
                    setSuccess(false);
                    setSuccessMessage("");
                    history.push('/')
                }, 3000);
                
            }

            else{
                setError(true);
                setErrorMessage("You Might Be Missing Something!")
                setTimeout(() => {
                setError(false);
                setErrorMessage("")
            }, 2000);
        }
    
        } catch (error) {
            Promise.reject(error);
            console.log(error);
        }
        
    }///204550143455439
    console.log(title,description,date,price);




    return (
        <div>
                <Container>
                {error ? (
                        <Alert color="danger">
                            {errormessage}
                        </Alert>
                    ) : ""}

                {success ? (
                        <Alert color="success">
                            {successmessage}
                        </Alert>
                    ) : ""}
                    <Form onSubmit = {submitHandler}>
                    <h1 className="display-3">Create Your Event</h1>   
                        <FormGroup>
                            <Label>Upload a nice image for your event:   </Label>
                            <Label id = "thumbnail" style={{backgroundImage: `url(${preview})`}} className = {thumbnail ? "has-thumbnail" : ""}>
                                <input type = "file" onChange = {event => setThumbnail(event.target.files[0])} />
                                <img src = {cameraIcon} style = {{maxWidth: "60px"}} alt = "Upload here:" />
                            </Label>
                        </FormGroup>
                        <FormGroup>
                            <Label>Title of Event: </Label>
                            <Input  id = "title" type = "text" value = {title} placeholder="Title" onChange = {event => setTitle(event.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Descreption: </Label>
                            <Input  id = "desc" type = "textarea" value = {description} placeholder="Describe your event" onChange = {event => setDescription(event.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Price: </Label>
                            <Input  id = "price" type = "text" value = {price} placeholder="Price" onChange = {event => setPrice(event.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <Label>Date of Event: </Label>
                            <Input  id = "date" type = "date" value = {date} placeholder="Date" onChange = {event => setDate(event.target.value)}/>
                        </FormGroup>
                        <FormGroup>
                            <ButtonDropdown className="mb-sm-2 mt-sm-2" isOpen={dropdownOpen} toggle={toggle}>
                            <Button id="caret"  color="primary" value={sport} on>{sport}</Button>
                                <DropdownToggle caret color="primary" />
                                <DropdownMenu>
                                    <DropdownItem onClick={() => setSport("Swimming")}>Swimming</DropdownItem>
                                    <DropdownItem divider />                                    
                                    <DropdownItem onClick = {() => setSport("Running")}>Running</DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick = {() => setSport("Cycling")}>Cycling</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                        </FormGroup>
                        <FormGroup>
                            <Button className ="submit-btn" color = "success"  value="submit">Create Event</Button>
                        </FormGroup>
                        <FormGroup>
                        <Button className ="secondary-btn" color = "danger"  value = "cancel" onClick = {() => history.push('/')}>Cancel</Button>
                        </FormGroup>
                       
                    </Form>   
                </Container>  
        </div>
    )
}

export default Events
