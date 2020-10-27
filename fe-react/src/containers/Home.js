import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from '../axios-api'

class ExpenseTypes extends Component {
    state = {
        this_month: 0
    }
    componentDidMount(){
        axios.get('expenses/this-month/')
            .then(res => this.setState({this_month: res.data['month_expenses']})) 
    }
    render () {
        return (
            <Container >
                <div className="text-center"> 
                    <h1>Įmonės našumas</h1>
                    <h2>Šio mėnesio išlaidos: <Link to={'/expenses/'}>{this.state.this_month}</Link></h2>
                    <Link  to={'/expenses/create/'}> <Button variant="dark"> Pridėti išlaidas</Button></Link>
                </div>   
           </Container>

        );
    }
}

export default ExpenseTypes