import React, { Component } from "react";
import AuthService from "../Services/Auth_service"
import UserService from "../Services/User_service";

import {Link } from "react-router-dom";

import { Form, Row, Col, Button } from 'react-bootstrap'

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: undefined,
            profile: undefined,
            firstName: "",
            lastName: "",
            history: undefined
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeFirstName = this.onChangeFirstName.bind(this);
        this.onChangeLastName = this.onChangeLastName.bind(this);
        
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        console.log(user);
        if (user) {
            this.setState({
                currentUser: user
            })
        }



        UserService.getProfile()
            .then(res => {
                this.setState({
                    profile: res.data,
                    firstName: res.data.firstName,
                    lastName: res.data.lastName
                });
            })
            .catch(err => {
                console.log(err.message);
            })


        UserService.getHistory()
            .then(res => {
                this.setState({
                    
                    history: res
                })
            })
            .catch(err => console.log(err)); 
    }

    onChangeFirstName(e) {
        this.setState({
            firstName: e.target.value
        })
    }

    onChangeLastName(e) {
        this.setState({
            lastName: e.target.value
        })
    }
    handleSubmit(e) {
        this.setState({
            profile: {
                firstName: this.state.firstName,
                lastName: this.state.lastName
            }
        })

        UserService.saveProfile(this.state.firstName, this.state.lastName);
    }

    render() {
        const { profile } = this.state;
        console.log(this.state.history)
        return (
            <div className="container">
                <header className="jumbotron">
                    <h3>Profile</h3>
                </header>
                {(profile ? (
                    <div>
                        <h3>First Name: </h3>
                        {this.state.firstName} <br/>
                        <h3>Last Name: </h3>
                        {this.state.lastName}<br/>
                        <Link to='/creditcard'>
                            <Button>Payment Method</Button>
                        </Link>
                        
                    </div>
                ) : (
                        <Form onSubmit={this.handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Control 
                                        type="text"
                                        name="firstname"
                                        value={this.state.firstName}
                                        onChange={this.onChangeFirstName}
                                        placeholder="First name" />
                                </Col>
                                <Col>
                                    <Form.Control
                                        type="text"
                                        name="lastname"
                                        value={this.state.lastName}
                                        onChange={this.onChangeLastName}
                                        placeholder="Last name" />
                                </Col>
                            </Row><br/>
                            <Button type='submit'>Upload Profile</Button>
                        </Form>
                    ))}

                <div>
                    <br></br>
                    <h3>User History</h3>
                    {
                        this.state.history && (
                            <ul>
                                {
                                    this.state.history.map(h => (
                                    <li>{h.numberOfTickets} tickets for - {h.filmName} - Theatre: {h.theatreName} - Total Price: {h.totalPrice}</li>
                                    ))
                                }
                            </ul>
                        )
                        
                        
                    }
                </div>

            </div>
        );
    }
}