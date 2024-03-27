import logo from './logo.svg';
import './App.css';
import { Button } from '@chakra-ui/react';

function App() {
  const handleClick = async () => {
    try {
      const response = await fetch('/get-movie/1000001'); // Adjust the movie ID as needed
      const data = await response.json(); // this is where the error is bc its not json
      console.log(data); // Log the movie data to the console
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
         <Button colorScheme="teal" onClick={handleClick}>Button</Button>
      </header>
    </div>
  );
}

export default App;