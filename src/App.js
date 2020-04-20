import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { DropdownButton, Dropdown, Button } from 'react-bootstrap';

import MoviePage from "./Components/MoviePage";
import TheaterPage from "./Components/TheaterPage";
import MainPage from "./Components/MainPage";
import SignInPage from "./Components/SignInPage"
import RegisterPage from "./Components/RegisterPage"
import BookingPage from './Components/BookingPage';
import Profile from './Components/Profile';
import CreditCard from './Components/CreditCard';

import AuthService from './Services/Auth_service';
import MovieService from './Services/Movie_service';
import PaymentPage from './Components/PaymentPage';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentUser: undefined,
      theaters: undefined
    }
  }


  componentDidMount() {
    const user = AuthService.getCurrentUser();

    MovieService.getTheaters()
      .then(res => {
        this.setState({
          theaters: res
        })
      });

    if (user) {
      this.setState({
        currentUser: AuthService.getCurrentUser()
      })
    }

  }


  logOut() {
    AuthService.logout();
  }


  render() {

    console.log(localStorage.getItem("isCC"))
    return (
      <Router>
        <div>
          <nav className="navbar navbar-expand navbar-dark bg-dark">
            <Link to={"/"} className="navbar-brand">
              Best Movie Theater
            </Link>
            <div className="navbar-nav">
              <li className="nav-item">
                <Link to={"/main"} className="nav-link">
                  <Button >Home</Button>
                </Link>
              </li>
              {/* <li className="nav-item">
                <Link to={"/movies"} className="nav-link">
                  <Button >Movies</Button>
                </Link>
              </li> */}
              <li className="nav-item">
                <DropdownButton className="nav-button" title="Our Theater">
                  {this.state.theaters &&
                    this.state.theaters.map(theater => (
                      <div key={theater.name}>
                        <Dropdown.Item>
                          <Link to={"/theaters/" + theater.theatreId} className="nav-link">
                            <Button >{theater.name}</Button>
                          </Link>
                        </Dropdown.Item>

                      </div>
                    ))
                  }
                </DropdownButton>
              </li>
            </div>

            {!this.state.currentUser ? (
              <div className="navbar-nav">
                <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                    <Button >Login</Button>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/register"} className="nav-link">
                    <Button >Sign Up</Button>
                  </Link>
                </li>
              </div>
            ) : (
                <div className="navbar-nav">
                  <li className="nav-item">
                    <Link to={"/profile"} className="nav-link">
                      <Button>Profile</Button>
                    </Link>
                  </li>
                  <li className="nav-item">
                  <Link to={"/login"} className="nav-link">
                      <Button onClick={this.logOut}>Log Out</Button>
                    </Link>
                  </li>
                </div>
              )}
          </nav>

          <div className="container-routes">
            <Switch>
              <Route exact path={["/", "/main"]} render={() => <MainPage />} />
              <Route exact path="/movies" render={(props) => <MoviePage {...props} />} />
              <Route exact path="/theaters/:theatreId" render={(props) => <TheaterPage {...props} />} />
              <Route exact path="/register" render={() => <RegisterPage />} />
              <Route exact path="/login" render={(props) => <SignInPage {...props} />} />
              <Route exact path="/profile" component={Profile} />
              <Route exact path="/creditcard" component={CreditCard} />
              <Route exact path="/bookingPage" component={BookingPage} />
              <Route exact path="/paymentPage" component={PaymentPage} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}


export default App;
