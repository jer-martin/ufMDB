import logo from './logo.svg';
import './App.css';
import { Button, Input, Text, Flex} from '@chakra-ui/react';
import React, { useState } from 'react';




function App() {

  const [formData, setFormData] = useState({
    movieID: '',
  });
  const [movieData, setMovieData] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleClick = async () => {

    const movieID = formData.movieID;

    try {
      const response = await fetch(`/get-movie/${movieID}`); // Adjust the movie ID as needed
      const data = await response.json(); // this is where the error is bc its not json
      // console.log(data);
      setMovieData(data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
      <Input
            placeholder="Movie ID"
            variant="filled"
            value={formData.movieID}
            onChange={handleChange}
            name="movieID"
            _focus={{bg: 'gray.200'}}
            color='gray.600'
            style={{width: '200px', margin: '20px'}}
          />
         <Button colorScheme="teal" onClick={handleClick}>Fetch info</Button>

        <Flex direction='column' align='center' justify='center' width={'20vw'} padding={'1vw'}>
        {movieData && (
  <div>
    <Text fontSize="lg"><b>Movie Info:</b></Text>
    <Text fontSize="sm"><b>Title:</b> {movieData[0][1]}</Text>
    <Text fontSize="sm"><b>Release Year:</b> {movieData[0][2]}</Text>
    <Text fontSize="sm"><b>Tagline:</b> {movieData[0][3]}</Text>
    <Text fontSize="sm"><b>Synopsis:</b> {movieData[0][4]}</Text>
    <Text fontSize="sm"><b>Runtime:</b> {movieData[0][5]} minutes</Text>
    <Text fontSize="sm"><b>Rating:</b> {movieData[0][6]}/5</Text>
  </div>
)}
        </Flex>
         
      </header>
    </div>
  );
}

export default App;