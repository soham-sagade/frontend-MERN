import React from 'react';
import Routes from './routes';
import Navigate from './pages/NavbarComponent/Navbar'
import { Container } from 'reactstrap';
import './App.css'
import { BrowserRouter } from 'react-router-dom';
import {ContextWrapper} from './user-context'

function App() {
  return (
    <>
    <ContextWrapper>
        <BrowserRouter>
            <Navigate />
          <Container>
            <div className = "content container">
              <Routes />
            </div>
          </Container> 
          </BrowserRouter>
    </ContextWrapper>
    </> 
  );
}

export default App;
