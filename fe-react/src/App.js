
import React from 'react';
import Header from './components/Header';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    
} from 'react-router-dom';
import ExpenseTypes from './containers/ExpenseTypes/ExpenseTypes'
import Expenses from './containers/Expenses/Expenses';
import ExpenseForm from './containers/Expenses/ExpenseForm';
import ExpenseTypeForm from './containers/ExpenseTypes/ExpenseTypeForm';
import Home from './containers/Home';

class App extends React.Component {
    render() {
        return (
            <Router>
                <Header/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/expenses/" component={Expenses} />   
                    <Route path="/expenses/create/" component={(props) => <ExpenseForm {...props}/>} />
                    <Route path="/expenses/:id/edit/" component={(props) => <ExpenseForm {...props}/>} />
                    <Route exact path="/expense-types/" component={ExpenseTypes}/>
                    <Route path="/expense-types/create/" component={(props) => <ExpenseTypeForm isNew={true} {...props}/>}/>
                    <Route path="/expense-types/:id/edit/" component={(props) => <ExpenseTypeForm isNew={false} {...props}/>}/>
                </Switch>
            </Router>
        );
    }
}

export default App;
