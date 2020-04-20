import React, { Component } from "react";
import CreditCardInput from 'react-credit-card-input';
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom"

import UserService from '../Services/User_service';

export default class CreditCard extends Component {
    
    constructor(props) {
        console.log("in con")
        super(props);
        this.state ={
            cardNumber: "",
            expiry: "",
            cvc: "",
            message: "",
            successful: false,
            isloading: false
        }

        this.handleCardNumberChange = this.handleCardNumberChange.bind(this);
        this.handleCardExpiryChange = this.handleCardExpiryChange.bind(this);
        this.handleCardCVCChange = this.handleCardCVCChange.bind(this);
        this.handleCardSubmit = this.handleCardSubmit.bind(this);
    }

    handleCardNumberChange(e) {
        this.setState({
            cardNumber: e.target.value
        })
    }

    handleCardExpiryChange(e) {
        this.setState({
            expiry: e.target.value
        })
    }

    handleCardCVCChange(e) {
        this.setState({
            cvc: e.target.value
        })
    }

    handleCardSubmit(e) {
        e.preventDefault()
        var number = this.state.cardNumber.replace(/\s/g, '');
        var eMon = this.state.expiry.split("/")[0];
        var eYear = this.state.expiry.split("/")[1];
        UserService.addPayment(number, eMon, eYear, this.state.cvc)
            .then(res => {
                this.setState({
                    successful: true
                })
                
                alert("Credit Card Successfully Added!")
                this.props.history.push("/");
                window.location.reload();
            })
            .catch(err => {
                
                // this.setState({
                //     message: "Your card number is incorrect",
                //     isloading: false
                // })
                localStorage.setItem("isCC", false);
                alert("Incorrect Credit Card Info!")
                window.location.reload();
            })
    }

    render() {
        // console.log(this.state.cardNumber);
        // console.log(this.state.expiry);
        // console.log(this.state.cvc);
        console.log(this.state.successful)
        return(
            <div>
            <h3>Add Credit Card: </h3>
            <Form onSubmit={this.handleCardSubmit}>
            <CreditCardInput 
                cardNumberInputProps={{ value: this.state.cardNumber, onChange: this.handleCardNumberChange }}
                cardExpiryInputProps={{ value: this.state.expiry, onChange: this.handleCardExpiryChange }}
                cardCVCInputProps={{ value: this.state.cvc, onChange: this.handleCardCVCChange }}
                fieldClassName="creditCardInput"
            />
            <button><span>Submit</span></button>
            </Form>
            </div>
        )
    }
}