import React, { Component } from 'react';
import axios from '../../axios-api'
import { Container, Form, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class ExpenseTypes extends Component {
    state = {
        expenses_types : []
    }
    linkStyle = {
        color: 'white'
    }
    componentDidMount(){
        axios.get('expenses/types/').then(res => this.setState({expenses_types: res.data}))
        
    }
    render () {
        return (
            <Container>
                <Button as={Link} to='create' variant="dark" className="my-3"> Pridėti</Button>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Pavadinimas</th>
                            <th>Aktyvus</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        this.state.expenses_types.map(exp => (
                            <tr key={exp.id}>
                                <td><Link style={this.linkStyle} to={exp.id + '/edit'}>{exp.name}</Link></td>
                                <td><Form.Check checked={exp.active}/></td>
                            </tr>     
                        ))
                    }
                    </tbody>
                </Table>
           </Container>

        );
    }
}

export default ExpenseTypes