import React,{useState,useEffect,useMemo} from 'react'
import {Button,ButtonGroup,Dropdown, DropdownToggle, DropdownMenu, DropdownItem,Row,Alert,buttonLabel,Modal,ModalBody,ModalHeader,ModalFooter} from 'reactstrap';
import moment from 'moment'
import './dashboard.css'
import socketio from 'socket.io-client'
import api from '../../services/api'


function Dashboard({history}) {
    const [events,setEvents] = useState([]);
    const user = localStorage.getItem('user');
    const userid = localStorage.getItem('userid');
    const [cSelected, setCSelected] = useState([]);
    const [rSelected, setRSelected] = useState("Your Choice");
    const [error,setError] = useState(false);
    const [success,setSuccess] = useState(false);
    const [messagehandler,setMessageHandler] = useState('');
    const [eventsrequests,setEventsRequests] = useState([]);
    const [isdropdown,setIsDropdown] = useState(false);
    const [modal,setModal] = useState(false);
    
    
    
    useEffect(() => {
        getEvents()
    },[])
    
    const socket = useMemo( () => 
        socketio("https://events-site-app-frontend.herokuapp.com/",{query: { user : userid }})
    ,[userid]);

    const toggle = () => setIsDropdown(!isdropdown);

    useEffect(() => {
        console.log(userid);

        socket.on('registration_request',data => (setEventsRequests([...eventsrequests,data])));
    },[eventsrequests,socket])
    
    const getEvents = async(filter) => {

        try {
            const url = filter ? `/dashboard/${filter}` : '/dashboard'
            const response =  await api.get(url, {headers: { user } })
    
            setEvents(response.data.events);    
        } catch (error) {
            history.push('/login');
        }
        
    };


    const filter = (query) =>{
            setRSelected(query);
            getEvents(query)
    }

    const myEventsHandler = async() =>{
        try {
            setRSelected("myevents")
            const response = await api.get('/dashboard/events',{headers: { user } })
            setEvents(response.data.events);
            
        } catch (error) {
            history.push('/login');
        }
    };

    const registrationEventHandler = async(event) => {
        try {
            console.log(event);
            await api.post(`/registration/${event._id}`,{},{headers : { user }});
            setSuccess(true);
            setMessageHandler(`Request for ${event.title} sent Successfully!`)
            setTimeout(() => {
                setSuccess(false);
                setMessageHandler('0');
                filter(null);
            }, 3000);

        } catch (error) {
                setError(true);
                setMessageHandler('Could not send request!')
                setTimeout(() => {
                    setError(false)
                    setMessageHandler('');
                    filter(null);
                }, 3000)
        }
    }

    const deleteEventHandler = async(eventid) => {
            
        try {
            await api.delete(`/events/${eventid}`,{headers: { user }});
            setSuccess(true);
            setMessageHandler('Event Deleted Successfully!')
            setTimeout(() => {
                setSuccess(false);
                setMessageHandler('0');
                filter(null);
            }, 3000);
            
        } catch (error) {
                setError(true);
                setMessageHandler('Could not delete event!')
                setTimeout(() => {
                    setError(false)
                    setMessageHandler('');
                    filter(null);
                }, 3000);
        }
            
    }

    useMemo(() => {
            setModal(true);
    },[eventsrequests])

    const toggleModal = () => {
       setModal(!modal)
    };


    const ApprovalHandler = async(eventid) => {
        try {
            const response =  await api.post(`/registration/${eventid}/approval`,{},{headers : { user }});
            UpdateRequestsList(eventid);
            //if(!eventsrequests)
                //setModal(false);
        } catch (error) {
            console.log(error)
        }
    }

    const RejectionHandler = async(eventid) =>{
            try {
                await api.post(`/registration/${eventid}/reject`,{},{headers: {user}});
                UpdateRequestsList(eventid);
             // if(!eventsrequests)
                    //setModal(false);
            } catch (error) {
                console.log(error)
            }
    }

    const UpdateRequestsList = (eventid) => {
        const newRequests = eventsrequests.filter((event) => event._id !== eventid)
        setEventsRequests(newRequests); 
    }


    return(
        <>
            <div>
                    <Modal isOpen={modal} toggle={toggleModal} className="primary">
                        <ModalHeader toggle={toggleModal}>Requests</ModalHeader>
                    <ModalBody>
                        <ul className="notifications mr-s-7">
                            {
                                eventsrequests.map(request => {
                                    return( 
                                    <li key={request._id}>
                                        <div>
                                            <strong>{request.user.email}</strong> is requesting to join your  
                                            <strong>{request.event.title}</strong>
                                        </div>
                                        <ButtonGroup>
                                            <Button color="secondary" onClick={() => ApprovalHandler(request._id)}>Appove</Button>
                                            <Button color="danger" onClick = {() => RejectionHandler(request._id)}>Reject</Button>
                                        </ButtonGroup>
                                    </li>
                                    )
                                })
                            }
                        </ul>
                    </ModalBody>
                </Modal>
            </div>
        
            
        
        {success ? (
                        <Alert color="success">
                        {messagehandler}
                        </Alert>
                    ) : ""}

        {error ? (      <Alert color="danger">
                        {messagehandler}
                        </Alert>) : ""}

        <h1>All Events</h1>
        <div> 
            <Row>
            <div className="col-sm-6">        
            <Dropdown isOpen={isdropdown} toggle={toggle}>
                    <DropdownToggle color="primary" caret>
                        {rSelected}
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={() => filter(null)} active={rSelected === null}>All Events</DropdownItem>
                        <DropdownItem onClick={() => filter("Swimming")} active={rSelected === "Swimming"}>Swimming</DropdownItem>
                        <DropdownItem onClick={() => filter("Running")} active={rSelected === "Running"}>Running</DropdownItem>
                        <DropdownItem onClick={() => filter("Cycling")} active={rSelected === "Cycling"}>Cycling</DropdownItem>
                    </DropdownMenu>
            </Dropdown>

            </div>
            <div className="col-sm-3 ">
                <Button color = "secondary" className="buttons" onClick = {myEventsHandler} value = "myevent">My Events</Button>
            </div>
            <div className="col-sm-3 buttons">
                <Button color = "success"  value = "new" onClick = {() => history.push('/Events')}>Create New Event</Button>
            </div>
            </Row>
        
        </div>
            <ul className="events-list">
                {
                    events.map((event) => (
                        <li key = {event._id}>
                            <header style = {{backgroundImage: `url(${event.thumbnail_url})`}}>
                            {event.user === userid ? <div><Button color="danger" onClick={() => deleteEventHandler(event._id)}>Delete</Button></div> : ""}
                            </header>
                            <strong>{event.title}</strong>
                            <span>Date: {moment(event.date).format('l')}</span>
                            <span>{event.description}</span>
                            <span>Event Fees: {parseFloat(event.price).toFixed(2)}</span>
                            <Button color="primary" onClick={() => registrationEventHandler(event)}>Registration Request</Button>
                        </li>
                    ))
                }
            </ul>
        </>
    )

    
}

export default Dashboard  





/*<li key={request._id}>
                            <div>
                                <strong>{request.user.email}</strong> is requesting to join your  
                                <strong>{request.event.title}</strong>
                            </div>
                            <ButtonGroup>
                                <Button color="secondary" onClick={() => {}}>Appove</Button>
                                <Button color="danger" onClick = {() => {}}>Reject</Button>
                            </ButtonGroup>
                           

                        </li>*/
