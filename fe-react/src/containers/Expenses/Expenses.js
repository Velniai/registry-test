import querystring from 'querystring'
import React, { Component } from 'react';
import axios from '../../axios-api'
import { Container, Col, Row, Form, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Chart } from "react-google-charts";
class Expenses extends Component {
    _Mounted = false
    
    state = {
        expenses : [],
        types: [],
        loading: false,
        chartData: [],
        selectedType: '-1',
        selectedDate: '-1',
    }

    linkStyle = {
        color: 'white'
    }

    componentWillUnmount(){
        this._Mounted = false 
    }
    componentDidMount(){
        this.loadExpenses() 
        
        axios.get('expenses/types/').then((res) => { if (this._Mounted) this.setState({types: res.data})})
    }
    loadExpenses(filters){
        let queryString = {};

        if(filters){
            const type = filters.type
            const date = filters.date
    
            if(date !== "-1")
                queryString['date'] = date
            if(type !== "-1")
                queryString['type'] = type
    
        }

        let url = '/expenses/' + '?'+ querystring.stringify(queryString)
        this._Mounted = true 
        axios.get(url).then(res => 
            {
                if (this._Mounted){
                    this.setState({loading: true})
                    this.setState({expenses: res.data})
                }
        
                this.calculateChartDate([...res.data]) 
            }
        )
    }
    selectedTypeChangedHandler(ev){
        const value = ev.target.value
        if(this._Mounted)
            this.setState({ selectedType: value })

        this.loadExpenses({ type: value, date: this.state.selectedDate})
    }
    selectedDateChangedHandler(ev){
        const value = ev.target.value
        if(this._Mounted)
            this.setState({ selectedDate: value })

        this.loadExpenses({ type: this.state.selectedType, date: value})
    }


    calculateChartDate(expenses){
        let tempObject = {}
        expenses.forEach(e => {
            if(!tempObject[e.type.name])
                tempObject[e.type.name] = parseFloat(e.invoice_total)
            else
                tempObject[e.type.name] += parseFloat(e.invoice_total)
        })
        let chartData =  [ ['Tipas', 'Išlaidos']]
        for (const property in tempObject) {
            chartData.push([property, tempObject[property]])

        }    
        if (this._Mounted){
            this.setState({chartData: chartData })     
            this.setState({loading: false})    
        } 
    }
    deleteClickHandler(id){
       if(window.confirm("Ar tikrai norite ištrinti?")){
           axios.delete('expenses/'+id + '/')
           .then(() => {
               const expenses = [...this.state.expenses]
               const idx = expenses.findIndex(e => e.id === id)
               expenses.splice(idx, 1)
               if (this._Mounted)
                this.setState({expenses: expenses})

               this.calculateChartDate([...expenses])
           })
       }
    }

    render () {
        let chart =  (<div>Kraunasi...</div>)
        if(!this.state.loading)
            chart = 
            (
                <Chart
                    width={'750px'}
                    height={'550px'}
                    chartType="PieChart"
                    data={ this.state.chartData}
                    options={{
                        title: 'Išlaidos pagal tipą',
                        is3D: true,
                    }}
                    rootProps={{ 'data-testid': '1' }}
                />      
            )

        return (
            <Container fluid>
                <Row>
                    <Col md={6}>
                        <Form.Row className="mt-3">
                            <Col>
                                <Form.Label>Išlaidų tipas</Form.Label>
                                <Form.Control as="select"  value={this.state.selectedType} onChange={(ev) => this.selectedTypeChangedHandler(ev)}>
                                    <option value="-1">Visi</option>
                                    {
                                        this.state.types.map(t => (<option key={t.id} value={t.id}>{t.name}</option>))
                                    }
                                </Form.Control>  
                            </Col>
                            <Col>
                                <Form.Label>Data</Form.Label>
                                <Form.Control as="select" value={this.state.selectedDate} onChange={(ev) => this.selectedDateChangedHandler(ev)}>
                                    <option value="-1">Visos</option>
                                    <option value="today">Šiandien</option>
                                    <option value="week">Ši savaitė</option>
                                    <option value="month">Šis mėnuos</option>
                                    <option value="prev">Praeitas Mėnuo</option>
                                </Form.Control>  
                            </Col>
                        </Form.Row>
                        
                        <Button as={Link} to='create' variant="dark" className="my-3"> Pridėti</Button>
         
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Tipas</th>
                                    <th>Tiekėjas</th>
                                    <th>Dokumento numeris</th>
                                    <th>Suma</th>   
                                    <th></th>              
                                </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.expenses.map(exp => (
                                    <tr key={exp.id}>
                                        <td><Link style={this.linkStyle} to={exp.id + '/edit'}>{exp.date}</Link></td>
                                        <td><Link style={this.linkStyle} to={exp.id + '/edit'}>{exp.type.name}</Link></td>
                                        <td><Link style={this.linkStyle} to={exp.id + '/edit'}>{exp.supplier.name}</Link></td>
                                        <td><Link style={this.linkStyle} to={exp.id + '/edit'}>{exp.invoice_numb}</Link></td>
                                        <td><Link style={this.linkStyle} to={exp.id + '/edit'}>{exp.invoice_total}</Link></td>
                                        <td><a style={{color: 'salmon'}} href="#" onClick={() => this.deleteClickHandler(exp.id)}>Trinti</a></td>
                                    </tr>     
                                ))
                            }
                            </tbody>
                        </Table>
                    </Col>
                    <Col>
                        {chart}
                    </Col>
                </Row>
           </Container>

        );
    }

}

export default Expenses