
import React, { Component } from 'react';
import '../App.css';
import { Container, Row } from 'react-bootstrap';

import MovieService from '../Services/Movie_service';

import Movie from './Movie';

class MoviePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            theater: props.location.state.theater,
            moviesList: undefined,
            movieDate: undefined
        }

        this.handleSelectDate = this.handleSelectDate.bind(this);
    }

    componentDidMount() {
        // console.log(this.state.theater.theatreId)
        MovieService.getMovieByTheatreId(this.state.theater.theatreId)
            .then(res => {
                this.setState({
                    moviesList: res
                })
            })

        
        
    }

    handleSelectDate(e) {
        this.setState({
            movieDate: e.target.value
        });
    }


    render() {

        // const { moviesList, theater, movieDate } = this.state;
        const { moviesList, theater} = this.state;
        // console.log(moviesList)
        return (
            <div>
                <div>
                    <h1>{theater.name}</h1>
                </div>
                <div className="my-movie">
                    {/* <label>choose the time:
                        <select value={this.state.movieDate} onChange={this.handleSelectDate}>
                            <option value="">Select Time</option>
                            <option value="Apr 20">Apr 20</option>
                            <option value="Apr 21">Apr 21</option>
                            <option value="Apr 22">Apr 22</option>
                        </select>
                    </label> */}
                    <Container>
                        <Row >
                            {
                                moviesList &&
                                // moviesList.filter(movie => (movie.theatreId === this.state.theater.theatreId))
                                moviesList.map(movie => (
                                    <div className="movieCard" key={movie.filmId}>
                                            <Movie
                                                movie={movie}
                                                theater={theater}
                                            />
                                        </div>
                                    ))
                            }
                        </Row>
                    </Container>
                </div>

            </div>
        )
    }
}


export default MoviePage;


