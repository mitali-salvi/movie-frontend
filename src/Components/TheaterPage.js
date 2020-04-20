import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../App.css';

import MovieService from '../Services/Movie_service'
import AuthService from '../Services/Auth_service'

class TheaterPage extends Component {

    constructor(props) {
        super(props);
        //console.log('Reached here');
        this.state = {
            currentUser: undefined,
            theatreId: props.match.params.theatreId,
            theaters: undefined

        }
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if(user) {
            this.setState({
                currentUser: AuthService.getCurrentUser()
            })
        }

        MovieService.getTheaters()
            .then(res => {
                this.setState({
                    theaters: res
                });
            })
    }

    render() {
        // console.log(this.state.theaters)
         //console.log("Theater Id: " + this.state.theatreId)
        // console.log(this.state.currentUser)
        return (
            <div>
                { this.state.theaters &&
                    this.state.theaters.filter(theater => theater.theatreId === parseInt(this.state.theatreId))
                        .map(tt => (
                            <div key={tt.theatreId}>
                            <div>
                                    <h1>{tt.name}</h1><br/>
                                {tt.city}<br/>
                                {tt.address}<br/>
                            </div>
                            {
                                <div className="booking-button">
                                {
                                (!this.state.currentUser) ? (
                                    <Link to="/login">
                                        <Button>Login to Book</Button>
                                    </Link>) :
                                (<Link to={{
                                    pathname: '/movies',
                                    state: {
                                        theater: tt
                                    }
                                    }}> <Button>Get Tickets</Button></Link>
                                    
                                )
                                }
                                </div>
                            }
                            </div>
                        ))
                }
                
            </div>
        )
    }
}


export default TheaterPage;
