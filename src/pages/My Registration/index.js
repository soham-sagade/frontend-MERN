import React,{useState,useEffect} from 'react'
import {Button,ButtonGroup} from 'reactstrap'
import api from '../../services/api'
import moment from 'moment'
import './styles.css'
function MyRegistrations() {

    const user = localStorage.getItem('user');
    const [myevents,setMyEvents] = useState([]);

    const getMyRequests = async() => {
        const response = await api.get('/registration/',{ headers: { user } } )
        setMyEvents(response.data);
    }

    useEffect(() => {
        getMyRequests();
    },[])


    const AcceptHandler = async(eventid) => {
        try {
            const response =  await api.post(`/registration/${eventid}/approval`,{},{headers : { user }});
            getMyRequests();
        } catch (error) {
            console.log(error)
        }
    }

    const RejectHandler = async(eventid) => {
        try {
            const response =  await api.post(`/registration/${eventid}/reject`,{},{headers : { user }});    
            getMyRequests();
        } catch (error) {
            console.log(error);
        }
    }

    const isApproved = (approved) => approved ? "Approved" : "Rejected";

    return (
        <div>
            <ul className="eventsrequests">
            {
                myevents.map((event) => {
                    return(
                    <li key={event._id}>
                        <div><strong>{event.eventTitle}</strong></div>
                        <div className="events"> 
                            <span>Event Date: {moment(event.eventDate).format('l')}</span>
                            <span>Event Price: ${parseFloat(event.eventPrice).toFixed(2)}</span>
                            <span>Email: {event.userEmail}</span>
                            <span className={event.approved === undefined ? "Pending" : isApproved(event.approved)}>Status:
                                <span> {event.approved === undefined ? "Pending" : isApproved(event.approved)}</span>
                            </span>
                        </div>
                        <ButtonGroup>
                            <Button disabled={event.approved === undefined ? false : true} color="secondary" onClick={() => AcceptHandler(event._id)}>Accept</Button>
                            <Button disabled={event.approved === undefined ? false : true} color="danger" onClick={() => RejectHandler(event._id)}>Reject</Button>
                        </ButtonGroup>
                    </li>
                )
                })
            }
            </ul>
        </div>
    )
}

export default MyRegistrations
