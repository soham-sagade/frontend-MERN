import React, { useState,useEffect,useContext } from 'react'
import {Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavLink,
   } from 'reactstrap';
    import {Link} from 'react-router-dom';
    import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
    import {faSwimmer} from '@fortawesome/free-solid-svg-icons';
import {UserContext} from '../../user-context'
        
 
    const Navigate = () => {
    const [isOpen,setIsOpen] = useState(false)
    const [url,setUrl] = useState("");
    const { isLogged,setIsLogged } = useContext(UserContext);
    const user = localStorage.getItem('user');

    console.log(isLogged)
   
    const logoutHandler = () =>
    {
        localStorage.removeItem('user');
        localStorage.removeItem('userid');
        setIsLogged(false)
    }

    useEffect(() => {
        if(user) setIsLogged(true);
    })
    


    const toggle = () => {
        setIsOpen(!isOpen)
    }


    return isLogged ?
        (<div>
            
        <Navbar color="light" light expand="md">
            <NavbarBrand style = {{color: "orangered"}}>Sportinger <FontAwesomeIcon icon = {faSwimmer} /></NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>    
            <Nav className="mr-auto">
            </Nav> 
                <NavLink>
                    <Link to="/events">Create Event</Link>
                </NavLink>
                <NavLink>
                    <Link to ="/myregistration">My Registrations</Link>                    
                </NavLink>
                <NavLink>
                    <Link to ="/login" onClick={logoutHandler}>Logout</Link>                    
                </NavLink>
            </Collapse>
        </Navbar>
    </div>)
    :
    (<Navbar color="light" light expand="md">
        <NavbarBrand style = {{color: "orangered"}}>Sportinger <FontAwesomeIcon icon = {faSwimmer} /></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>    
            <Nav className="mr-auto" nav>
            </Nav> 
        </Collapse>
    </Navbar>)

}

export default Navigate
