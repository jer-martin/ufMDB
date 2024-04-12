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
      console.log(data);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    }
  };



  const [selectedRoles, setSelectedRoles] = useState([]);

  const roles=["Additional directing","Additional photography","Art direction","Assistant director","Camera operator","Casting","Choreography","Cinematography",
  "Co-director","Composer","Costume design","Director","Editor","Executive producer","Hairstyling","Lighting","Makeup","Original writer","Producer","Production design",
  "Set decoration","Sound","Special effects","Stunts","Title design","Visual effects","Writer"];



  const handleRoleClick = (role) => {
    setSelectedRoles(prev => {
      const isAlreadySelected = prev.includes(role);
      return isAlreadySelected ? prev.filter(r => r !== role) : [...prev, role];
    });
  };

  const onRoleSelect = useCallback((selectedRoles) => {
    console.log('Selected roles:', selectedRoles); // use selectedRoles as needed to pass to the SQL query
  }, []);

  useEffect(() => {
    onRoleSelect(selectedRoles);
  }, [selectedRoles, onRoleSelect]);

  const displaySelectedRoles = selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Roles';

  const clearSelectedRoles = () => {
    setSelectedRoles([]);
  };

  const fetchAverageRolePercentage = async (roleName) => {
    const url = `/get-average-role-percentage/${encodeURIComponent(roleName)}`;
    console.log("Fetching URL:", url);
    try {
      const response = await fetch(url);
      console.log("Response status:", response.status);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching average role percentage:', error);
      return null;
    }
  };

  const handleMultipleRoles = async () => {
    const rolePromises = selectedRoles.map(role => fetchAverageRolePercentage(role));
    const results = await Promise.all(rolePromises);
    setRolePercentages(results.map(result => result.average_role_percentage));
    console.log('Role percentages:', results);
}

// TODO: find why rolePercentage is undefined and fix it
        // Role percentages: (2)[Array(1), Array(1)]
        // this shit is honestly so annoying
  
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
    {rolePercentages.map((rolePercentage, index) => {
      console.log("Role Percentage:", rolePercentage);
      return (
        <Text key={index} fontSize="md">
          Role {selectedRoles[index]}: {rolePercentage && rolePercentage[0] !== undefined ? rolePercentage[0].toFixed(2) : 'N/A'}%
        </Text>
      );
    })}
  </Flex>
)}



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

