import React, { Component } from 'react';
import MovieService from '../Services/Movie_service';
import AuthService from '../Services/Auth_service';

import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

class BookingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: AuthService.getCurrentUser(),
            movie: props.location.state.movie,
            theater: props.location.state.theater,

            rawMovieDetail: undefined,
            movieDetail: undefined,
            dateDict: undefined,
            timeDict: undefined,
            selectDate: "",
            selectTime: "",
            selectHall: "",
            currentMovie: undefined,
            finalMovie: undefined,
            seats: [],
            selectSeats: undefined

        }

        // console.log(this.state.movie);
        this.createMovieSet = this.createMovieSet.bind(this);
        this.constructDateTimeObject = this.constructDateTimeObject.bind(this);
        this.handleSelectDate = this.handleSelectDate.bind(this);
        this.handleSelectTime = this.handleSelectTime.bind(this);
        this.handleSelectSeat = this.handleSelectSeat.bind(this);
        this.filterOutMovie = this.filterOutMovie.bind(this);
        this.handleSelectHall = this.handleSelectHall.bind(this);

        // console.log(this.state.movie);

    }

    createMovieSet() {
        console.log("in createMovieSet")

        MovieService.getMovieDetails(this.state.movie.filmId)
            .then(res => {
                this.setState({
                    rawMovieDetail: res
                })
            })
            .then(() => {
                var theatreFilteredMovie = this.state.rawMovieDetail.filter(movie => {
                    return movie.theatreId === this.state.theater.theatreId
                });

                this.setState({
                    movieDetail: theatreFilteredMovie
                })
            })
            .then(() => {
                console.log(this.state.movieDetail);
                this.constructDateTimeObject()
            });
    }

    constructDateTimeObject() {
        var dateMap = {}, dateDest = [];
        var timeMap = {}, timeDest = [];
        for (var i = 0; i < this.state.movieDetail.length; i++) {
            var movie = this.state.movieDetail[i];
            // construct date dict
            if (!dateMap[movie.filmDate]) {
                // create a new json object
                dateDest.push({
                    id: movie.filmDate,
                    data: [movie]
                });
                dateMap[movie.filmDate] = movie;
            }
            else {
                for (var j = 0; j < dateDest.length; j++) {
                    var dj = dateDest[j];
                    if (dj.filmDate === movie.filmDate) {
                        dj.data.push(movie);
                        break;
                    }
                }
            }

            // construct time dict
            if (!timeMap[movie.filmTiming]) {
                timeDest.push({
                    id: movie.filmTiming,
                    data: [movie]
                });
                timeMap[movie.filmTiming] = movie;
            }
            else {
                for(var k = 0; k < timeDest.length; k++) {
                    var djj = timeDest[k];
                    if(djj.filmTiming === movie.filmTiming) {
                        djj.data.push(movie);
                        break;
                    }
                }
            }
        }

        this.setState({
            dateDict: dateMap,
            timeDict: timeMap
        })
    }

    componentDidMount() {
        // need to get the dates and times
        // Get the movies details with the currently theatre
        // console.log("In componentDidMount");
        this.createMovieSet();
    }



    handleSelectDate(e) {
        this.setState({
            selectDate: e.target.value
        })

        if(e.target.value === "none") {
            this.setState({
                selectTime: "",
                selectHall: "",
                selectSeats: undefined
            })
        }
    }

    handleSelectTime(e) {
        this.setState({
            selectTime: e.target.value
        })

        var time = e.target.value
        
        if(this.state.selectDate !== "" && this.state.selectDate !== "none" &&
            time !== "" && time !== "none") {
            this.filterOutMovie(time);
        }

        if(e.target.value === "none") {
            this.setState({
                selectHall: "",
                selectSeats: undefined
            })
        }
    }

    filterOutMovie(time) {
        // console.log("In filteroutmovie")
        // console.log(time)
        // console.log("date: " + this.state.selectDate);
        // console.log("time: " + this.state.selectTime);
        const filteredMovie = this.state.movieDetail.filter(movie => (
            (movie.filmDate === this.state.selectDate) &&
            (movie.filmTiming === time)
        ));
        
        this.setState({
            currentMovie: filteredMovie
        })
    }

    handleSelectHall(e) {
        this.setState({
            finalMovie: this.state.currentMovie[e.target.value],
            selectHall: e.target.value
        })

        // console.log(this.state.currentMovie[e.target.value]);
        MovieService.getMovieLayout(this.state.currentMovie[e.target.value].filmSessionId)
            .then(res => {
                this.setState({
                    seats: res
                })
            })

        if(e.target.value === "none") {
            this.setState({
                selectSeats: undefined
            })
        }
    }

    handleSelectSeat(e) {
        this.setState({
            selectSeats: this.state.seats[e.target.value]
        })
    }

    render() {
        const { dateDict, timeDict, selectDate, selectTime, selectHall} = this.state;
        // console.log(this.state.finalMovie);
        // console.log("date: " + selectDate);
        // console.log("time: " + selectTime);
        // console.log("hall: " + selectHall);
        // console.log(this.state.finalMovie);
        console.log(this.state.selectSeats);
        console.log(this.state.finalMovie)
        return (
            <div>
                <p>Select the Date:</p>
                <select name="selectDate" onChange={this.handleSelectDate}>
                    <option key="none" value="none">Select Date</option>
                    {
                        
                        dateDict &&
                        Object.keys(dateDict).map(date => (
                            <option key={date} value={date}>{date}</option>
                        ))
                        
                    }
                    
                </select>
                {
                    (!selectDate || selectDate === "" || selectDate === "none") ? (
                        <div></div>
                    ) : (<div>                            
                        <p>Select the Time:</p>
                        <select name="selectTime" onChange={this.handleSelectTime}>
                            <option key="none" value="none">Select Time</option>
                            {
                                timeDict &&
                                Object.keys(timeDict).map(time => (
                                    <option key={time} value={timeDict.time}>{time}</option>
                                ))

                            }

                        </select></div>)
                }

                {
                    (selectDate === "" || selectTime === "" || selectDate === "none" || selectTime === "none") ? (
                        <div></div>
                    ) : (
                        
                        <div>
                            <p>Select the Hall:</p>
                            <select name="selectHall" onChange={this.handleSelectHall}>
                                <option key="none" value="none">Select Hall</option>
                                {
                                   this.state.currentMovie.map((movie, index) => (
                                       <option key={movie.hallId} value={index}>{movie.hallName}</option>
                                   ))
                                }
                            </select>
                        </div>
                    )
                }

                {
                    (this.state.finalMovie && selectDate !== "none" && selectTime !== "none" && selectHall !== "") &&
                    (
                        <div>
                        <p>Select the Seats:</p>
                       <select name="selectSeat" onChange={this.handleSelectSeat}>
                           <option key="none" value={undefined}>Select Seat</option>
                           {
                                this.state.seats.map((seat, index) => (
                                    // <input type="checkbox" onChange={this.handleSelectSeat}>{seat.seatNumber}</input>
                                    <option key={seat.seatNumber} value={index}>{seat.seatNumber}</option>
                                ))
                           }
                       </select><br/>
                       </div>
                       
                    )
                }
                {
                    this.state.selectSeats &&
                    <Link to={{
                        pathname: '/paymentPage',
                        state: {
                            ticket: this.state.selectSeats,
                            movie: this.state.finalMovie
                        }
                   }}
                    >
                       <Button>Confirm</Button>
                   </Link>
                }
            </div>
        );

    }
}


export default BookingPage;
 