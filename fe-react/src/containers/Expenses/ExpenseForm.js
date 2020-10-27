import React, { Component } from 'react';
import { Container, Button, Form,Row, Col } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import axios from '../../axios-api'
import { Redirect } from 'react-router-dom'
import * as moment from 'moment'
class ExpenseForm extends Component {
    _Mounted = false
    
    state = {
        expense : {
            id: '',
            date: moment(new Date()).format('YYYY-MM-DD'),
            type: '',
            supplier: {
                id: '',
                name: ''
            },
            invoice_numb: '',
            invoice_total: 0
        },
        suppliers: [],
        types: [],
        navigate: false,
        validated: false
    }
    componentDidMount(){
        this._Mounted = true
        const id = this.props.match.params.id 
        if (id){
            axios.get('expenses/' + this.props.match.params.id + '/').then(
                res =>{
                    let expense =  res.data
                    expense.type = expense.type.id
                    if(this._Mounted)
                        this.setState({expense: expense})
                } )
        }
        axios.get('expenses/types/').then(
            res => {
                const types = res.data
                if(this._Mounted) 
                    this.setState({types: types})
                if (!id){
                    let expense = {...this.state.expense}
                    if(types.length > 0){
                        expense.type = types[0].id
                        if(this._Mounted) 
                            this.setState({expense: expense})
                    }
                } 
            }
        )
        axios.get('expenses/suppliers/').then(res => {if(this._Mounted) this.setState({suppliers: res.data}) })

    }
    componentWillUnmount(){
        this._Mounted = false
    }
    navigateChangeHandler(){
        if(this._Mounted)
            this.setState({navigate: true})
    }

    dateChangeHandler(ev){
        this.setState({ expense: {...this.state.expense, date: ev.target.value} })
    }
    supplierChangeHandler(supplier){
        if(supplier)
            this.setState({ expense: {...this.state.expense, supplier: supplier} })
    }
    typeChangeHandler(ev){
        var value = ev.target.value
        this.setState({ expense: {...this.state.expense, type: value} })
    }
    invoiceNumChangeHandler(ev){
        var value = ev.target.value
        this.setState({ expense: {...this.state.expense, invoice_numb: value} })
    }
    invoiceTotalChangeHandler(ev){
        var value = ev.target.value
        this.setState({ expense: {...this.state.expense, invoice_total: value} })
    }
    updateExpense(){

        const expense = {...this.state.expense}
        expense.supplier = expense.supplier.id
        const id = this.props.match.params.id 
        if (id){
            axios.put('expenses/' + id + '/', expense)
                .then(_ => this.navigateChangeHandler())
                .catch(e =>  alert(JSON.stringify(e.response.data)));
        }else{
            axios.post('expenses/', expense)
                .then(_ => this.navigateChangeHandler())
                .catch(e => alert(JSON.stringify(e.response.data)));
        }     
    }
    handleSubmit(event){
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
          event.stopPropagation();
        }else{
            this.updateExpense()
        }
        this.setState({validated: true})
    }
    render() {

        if (this.state.navigate) {
            return <Redirect to="/expenses/" push={true} />
        }
  

        return (    
            <Container className="mt-3">
                <Row>
                    <Col/>
                    <Col xs={5}>
                        <Form noValidate validated={this.state.validated} onSubmit={(ev) => this.handleSubmit(ev)}>
                            <Form.Group controlId="formDate">
                                <Form.Label>Data</Form.Label>
                                <Form.Control required type="date"  value={this.state.expense.date} onChange={d => this.dateChangeHandler(d)}/>
                            </Form.Group>
                            <Form.Group controlId="formType">
                                <Form.Label>Tipas</Form.Label>
                                <Form.Control required as="select" value={this.state.expense.type} onChange={ev => this.typeChangeHandler(ev)}>
                                    {
                                        this.state.types.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))
                                    }
                                </Form.Control>                      
                            </Form.Group>
                            <Form.Group controlId="formSupplier">
                                <Form.Label>Tiekėjas</Form.Label>
                                <Typeahead id="formSupplier"
                                    onChange={(selected) => {
                                        if(selected?.length === 1)
                                            this.supplierChangeHandler(selected[0])
                                    }}
                                    onInputChange={(text, _) => this.supplierChangeHandler({id:'', name: text})}
                                    options={this.state.suppliers}
                                    labelKey={'name'}
                                    selected={[this.state.expense.supplier]}
                                    required
                                    />  
                            </Form.Group>
                            <Form.Group controlId="fromInvoiceNo">
                                <Form.Label>Dokumento Numeris</Form.Label>
                                <Form.Control  required type="text" value={this.state.expense.invoice_numb} onChange={(ev) => this.invoiceNumChangeHandler(ev)}/>
                            </Form.Group>
                            <Form.Group controlId="formInvoiceSum">
                                <Form.Label>Suma</Form.Label>
                                <Form.Control required type="number" min="0.01" step="0.01" value={this.state.expense.invoice_total} onChange={(ev) => this.invoiceTotalChangeHandler(ev)}/>
                            </Form.Group>


                            <Button type="submit" variant="dark" className="mr-3" >
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

export default ExpenseForm