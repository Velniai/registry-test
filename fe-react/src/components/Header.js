import React from 'react';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {Link} from 'react-router-dom';
const Header = () => {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand as={Link} to="/">Registras</Navbar.Brand>
        <Nav className="mr-auto"> 
          <Nav.Link as={Link} to="/">Pagrindinis</Nav.Link>
          <Nav.Link as={Link} to='/expense-types/'>Išlaidų tipai</Nav.Link>
          <Nav.Link as={Link} to="/expenses/">Išlaidos</Nav.Link>
        </Nav>
      </Navbar>
    );
}

export default Header;