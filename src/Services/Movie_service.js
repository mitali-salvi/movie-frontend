
import axios from 'axios';
import authHeader from './Auth_header'

const API_URL = '/v1/';
// const API_URL = 'https://aa89f0d6-50e6-49f6-b956-fe68eb78bc12.mock.pstmn.io/';

class MovieService {


    /* /theatres GET: Get list of all theatres stored in db */
    async getTheaters() {

        console.log(API_URL + 'theatres');
        return axios.get(API_URL + 'theatres')
            .then(res => {
                // console.log(res.data);
                return res.data;
            })
            .catch(err => {
                console.log(err);
            })
    }


    /* /movies GET: Get list of all the movies stored in the db */
    getAllMovies() {
        // console.log(authHeader());

        return axios.get(API_URL + 'movies')
            .then(res => {
                console.log(res);
                return res.data;
            })
            .catch(err => {
                console.log(err);
            })

    }

    getMovieByTheatreId(thId) {
        
        // console.log(thId);
         console.log(API_URL + 'moviesFromTheatre/' + thId)

        return axios.get(API_URL + 'moviesFromTheatre/' + thId, 
            {headers: {
                    'Authorization': 'Bearer ' + authHeader(),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json', } })
            .then(res => {
            console.log(res.data);
            return res.data;
        })
        .catch(err => {
            console.log(err);
        })
    }

        
    

    /* /showDetailsFromMovie GET: Get which theatres and timings of a particular movie. Pass movieId as input */
    async getMovieDetails(movieId) {
        // console.log(movieId);
        return axios.get(API_URL + 'showDetailsFromMovie/' + movieId, { headers: { 'Authorization': 'Bearer ' + authHeader() } })
            .then(res => {
                // console.log(res);
                return res.data;
            })
            .catch(err => {
                console.log(err);
            })
    }

    /* /getMovieLayout GET: Get available(unbooked) seats of a particular show by passing the above show details as input */
    async getMovieLayout(filmSessionId) {
        return axios.get(API_URL + 'getMovieLayout/' + filmSessionId, { headers: { 'Authorization': 'Bearer ' + authHeader() } })
            .then(res => {
                return res.data
            })
            .catch(err => console.log(err))
            
    }

    

    /* /bookTickets POST: book tickets by passing seat array in input and film session id in URL.
    Here the seats will get booked and the user will get charged using credit card. Also the transaction will be returned in output */
    bookTickets(ticket, movie) {
        console.log(ticket)
        return axios.post(API_URL + 'bookTickets/' + movie.filmSessionId, ticket, {
            headers: {
                'Authorization': 'Bearer ' + authHeader(),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(res => {
            console.log(res.data);
            return res.data;
        });
    }
}

export default new MovieService();
