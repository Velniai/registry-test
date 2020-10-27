import React, { Component } from 'react';
import { Container, Button, Form, Col, Row } from 'react-bootstrap';
import axios from '../../axios-api'
import { Redirect } from 'react-router-dom'
class ExpenseTypeForm extends Component {
    state = {
        expense_type : {
            id: '',
            name: '',
            active: false
        },
        navigate: false
    }
    navigateChangeHandler(){
        this.setState({navigate: true})
    }

    nameChangeHandler(event){
        this.setState({ expense_type: {...this.state.expense_type, name: event.target.value} })
    }
    activeChangeHandler(event){
        this.setState({ expense_type: {...this.state.expense_type, active: event.target.checked} })
    }

    updateExpenseType(){
        const id = this.props.match.params.id 
        if (id){
            axios.put('expenses/types/' + this.props.match.params.id + '/', this.state.expense_type)
                .then(_ => this.navigateChangeHandler())
                .catch(e =>  alert(JSON.stringify(e.response.data)));
        }else{
            const t = this.state.expense_type;
            axios.post('expenses/types/', {name: t.name, active: true})
                .then(_ => this.navigateChangeHandler())
                .catch(e => alert(JSON.stringify(e.response.data)));
        }
  
       
    }
    componentDidMount(){
        const id = this.props.match.params.id 
        if (id){
            axios.get('expenses/types/' + this.props.match.params.id + '/').then(res => this.setState({expense_type: res.data}))
        }

    }
    render() {
        
        if (this.state.navigate) {
          return <Redirect to="/expense-types/" push={true} />
        }

        var isActive = this.state.expense_type.active;

        let activeCheckBox = null
        if (!this.props.isNew){
            activeCheckBox =    
                <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Aktyvus" onChange={(event) => this.activeChangeHandler(event)} checked={isActive} />
                </Form.Group> 

        }
        return (    
        <Container className="mt-3">
            <Row>
                <Col/>
                <Col xs={5}>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Pavadinimas</Form.Label>
                            <Form.Control type="text" onChange={(event) => this.nameChangeHandler(event)} value={this.state.expense_type.name}/>
                        </Form.Group>
                        {activeCheckBox}
                
                        <Button variant="dark" className="mr-3" onClick={() => this.updateExpenseType()}>
                            Saugoti
                        </Button>
                        <Button variant="outline-dark" onClick={() => this.navigateChangeHandler()}>
                            Uždaryti
                        </Button>
                    </Form>
                </Col>
                <Col/>
            </Row>
        </Container> )
    }

}

export default ExpenseTypeForm