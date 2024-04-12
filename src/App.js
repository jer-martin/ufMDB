import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav';
import { Button, Input, Text, Flex, Menu, MenuButton, MenuItem, MenuList, Icon, Tooltip} from '@chakra-ui/react'; // Ensure Chakra UI imports are here
import { ChevronDownIcon, DeleteIcon, CheckCircleIcon } from '@chakra-ui/icons'; // Ensure Chakra UI imports are here
import React, { useState, useCallback, useEffect } from 'react';
import { CgArrowsExpandDownRight } from "react-icons/cg";

function App() {
  const [formData, setFormData] = useState({
    movieID: '',
  });
  const [movieData, setMovieData] = useState(null);
  const [rolePercentages, setRolePercentages] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  
  
  
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
      const response = await fetch(`/get-movie/${movieID}`);
      const data = await response.json();
      setMovieData(data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };

  const barbieClick = async () => {
    try {
      const response = await fetch(`/get-barbie`);
      const data = await response.json();
      // console.log(data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };




  const roles=["Additional directing","Additional photography","Art direction","Assistant director","Camera operator","Casting","Choreography","Cinematography",
  "Co-director","Composer","Costume design","Director","Editor","Executive producer","Hairstyling","Lighting","Makeup","Original writer","Producer","Production design",
  "Set decoration","Sound","Special effects","Stunts","Title design","Visual effects","Writer"];



  const handleRoleClick = (role) => {
    setSelectedRoles(prev => {
        const isAlreadySelected = prev.includes(role);
        if (isAlreadySelected) {
            // Find index of the role to remove it and its corresponding percentage
            const index = prev.indexOf(role);
            setRolePercentages(prevPercentages => prevPercentages.filter((_, i) => i !== index));
            return prev.filter(r => r !== role);
        } else {
            // Add new role and fetch its percentage
            fetchAverageRolePercentage(role).then(percentage => {
                setRolePercentages(prevPercentages => [...prevPercentages, percentage]);
            });
            return [...prev, role];
        }
    });
};


  const onRoleSelect = useCallback((selectedRoles) => {
    // console.log('Selected roles:', selectedRoles); // use selectedRoles as needed to pass to the SQL query
  }, []);

  

  const displaySelectedRoles = selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Roles';

  const clearSelectedRoles = () => {
    setSelectedRoles([]);
    setRolePercentages([]); 
  };

  const fetchAverageRolePercentage = async (roleName) => {
    const url = `/get-average-role-percentage/${encodeURIComponent(roleName)}`;
    // console.log("Fetching URL:", url);
    try {
      const response = await fetch(url);
      // console.log("Response status:", response.status);
      const data = await response.json();
      // console.log("Data:", data);
      return data;
    } catch (error) {
      console.error('Error fetching average role percentage:', error);
      return null;
    }
  };

  const handleMultipleRoles = async () => {
    // Start fetching percentages for all selected roles
    const rolePromises = selectedRoles.map(role => fetchAverageRolePercentage(role));
    try {
      // Wait for all promises to settle
      const results = await Promise.all(rolePromises);
  
      // Assuming each result is a flat array with a single percentage value
      const percentages = results.flat(); // This will flatten the array of arrays into a single array
      setRolePercentages(percentages); // Update state with the new percentages
      // console.log('Role percentages:', percentages);
    } catch (error) {
      console.error('Error fetching data for multiple roles:', error);
    }
  };

  const handlePopularityClick = async () => {
    const movieID = `${encodeURIComponent(formData.movieID)}`;
    const url = `/get-movie-popularity/${movieID}`;
    try {
      console.log('Fetching URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      setMovieData(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching movie popularity:', error);
    }
  }


  
  return (
    <div className="App">
        <Nav />
      <div className='App-area'>
        <Flex direction="row" alignItems="center" justifyContent="center">
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              width="auto"
              minWidth="240px"
            >
              {displaySelectedRoles}
            </MenuButton>
            <MenuList sx={{ maxHeight: '200px', overflowY: 'auto' }}>
              {roles.map(role => (
                <MenuItem
                  key={role}
                  onClick={() => handleRoleClick(role)}
                  sx={{ color: 'black', fontSize: '12pt' }}
                  background={selectedRoles.includes(role) ? 'gray.200' : 'white'}
                  closeOnSelect={false}
                >
                  {role}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Tooltip label="Clear all selected roles" placement="top-start">
            <Icon
              as={DeleteIcon}
              w={5}
              h={5}
              color={'white'}
              _hover={{ color: 'LightCoral', transform: 'scale(1.2)' }}
              sx={{ marginLeft: '10px' }}
              onClick={clearSelectedRoles}
            />
          </Tooltip>

          <Tooltip label="Find role percentage for selected roles" placement="top-start">
            <Icon
              as={CheckCircleIcon}
              w={5}
              h={5}
              color={'white'}
              _hover={{ color: 'LightGreen', transform: 'scale(1.2)' }}
              sx={{ marginLeft: '10px' }}
              onClick={() => handleMultipleRoles()}
            />
          </Tooltip>

        </Flex>


        
        {rolePercentages && rolePercentages.length > 0 && (
  <Flex direction="column" alignItems="center" mt="4">
    {rolePercentages.map((percentage, index) => {
      // Ensure 'percentage' is a number and not undefined
      const formattedPercentage = typeof percentage === 'number' ? percentage.toFixed(2) : 'N/A';

      return (
        <Text key={index} fontSize="md">
          Percent of crew labelled "{selectedRoles[index]}" : {formattedPercentage}%
        </Text>
      );
    })}
  </Flex>
)}

        <Flex direction="column" alignItems="center" mt="4">
          <Input
            name="movieID"
            placeholder="Enter a movie ID"
            value={formData.movieID}
            onChange={handleChange}
            width="240px"
            mb="4"
          />
          <Button
            colorScheme="teal"
            onClick={handlePopularityClick}
          >
            Get Movie Popularity
          </Button>
          {movieData && movieData.length > 0 && (
            <Flex direction="column" alignItems="center" mt="4">
              <Text fontSize="md">Movie ID: {movieData[0].movieId}</Text>
              <Text fontSize="md">Movie Name: {movieData[0].movieName}</Text>
              <Text fontSize="md">Popularity: {movieData[0].popularity.toFixed(2)}</Text>
            </Flex>
          )}
        </Flex>


      </div>

      <div className='App-body'>
        <Flex className='copywrite' direction="column" alignItems="center" justifyContent="center" mt="20px">
          <Text color="gray" fontSize="sm" textAlign="center">
            Created by Jeremy Martin, Jake Rubin, Vedic Sharma, and Muneeb Ahmed
          </Text>
          <Text color="gray" fontSize="xs" textAlign="center">
            Project for CIS4301 Information and Database Systems I 
          </Text>
        </Flex>
      </div>
    </div>
  );
}

export default App;

