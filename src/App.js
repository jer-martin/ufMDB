import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav';
import { Button, Input, Text, Flex, Menu, MenuButton, MenuItem, MenuList, Icon, Tooltip, Divider, Box} from '@chakra-ui/react'; // Ensure Chakra UI imports are here
import { ChevronDownIcon, DeleteIcon, CheckCircleIcon, WarningIcon, QuestionIcon, SpinnerIcon} from '@chakra-ui/icons'; // Ensure Chakra UI imports are here
import React, { useState, useCallback, useEffect } from 'react';
import { CgArrowsExpandDownRight } from "react-icons/cg";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Filler, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Tooltip as ChartTooltip } from 'chart.js';
import { keyframes } from '@emotion/react';
import { adapterDateFns } from 'chartjs-adapter-date-fns';

// Define a shake animation
const shake = keyframes`
  10%, 90% {
    transform: translateX(-1px);
  }
  
  20%, 80% {
    transform: translateX(2px);
  }

  30%, 50%, 70% {
    transform: translateX(-4px);
  }

  40%, 60% {
    transform: translateX(4px);
  }
`;

const rotate = keyframes`
  from {  transform: rotate(0deg); }
  to {  transform: rotate(360deg); }
`;

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Filler, Legend, ChartTooltip, TimeScale);


const optionsDiversity = {
  responsive: true,
  animations: false,  // Disable all animations
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'year',
        parser: 'yyyy',
        tooltipFormat: 'yyyy',
        displayFormats: {
          year: 'yyyy'
        }
      },
      title: {
        display: true,
        text: 'Year',
        color: '#bfbfbf'  // Light grey color for better visibility on dark backgrounds
      },
      ticks: {
        color: 'grey'  // Light grey color for the axis labels
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Average Value',
        color: '#bfbfbf'  // Light grey color
      },
      ticks: {
        color: 'grey'  // Light grey color for the axis labels
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        color: 'grey'  // Light grey color for the legend text
      }
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false,
      bodyColor: 'grey',  // Light grey color for the tooltip text
      titleColor: 'grey'  // Light grey color for the tooltip title
    }
  }
};


const optionsGC = {
  responsive: true,
  animations: false,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',  // Can be set to 'year', 'month', etc.
        // parser: 'mm/dd/yyyy',  // Format of the year
        tooltipFormat: 'MMM d, yyyy',  // Format of the tooltip
        displayFormats: {
          day: 'MMM d, yyyy'  // Format of the year label
        }  
      },
      title: {
        display: true,
        text: 'Time'
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Genre Complexity'
      }
    }
  },
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      enabled: true,
      mode: 'index',
      intersect: false
    }
  }
};

const createDiversityChartData = (genreData) => {
  const datasets = genreData.map((genreArray, index) => {
    // console.log("genreArray[0]:  \n", genreArray[0])
    const color = `hsl(${index * 360 / genreData.length}, 60%, 60%)`;
    return {
      label: genreArray[0].genre,
      data: genreArray.map(d => ({
        x: new Date(d.year.toString()), // Convert year to Date object
        y: (d.avgNumLanguages + d.avgRating) / 2,
      })),
      borderColor: color,
      backgroundColor: color,
    };
  });

  return {
    datasets,
  };
};

const createGCChartData = (genreData) => {
  const datasets = genreData.map((genreArray, index) => {
    // console.log("genreArray[0]:  \n", genreArray[0])
    const color = `hsl(${index * 360 / genreData.length}, 60%, 60%)`;
    return {
      label: genreArray[0].genre,
      data: genreArray.map(d => ({
        x: new Date(d.rdate), // Convert year to Date object
        y: d.genre_complexity,
      })),
      borderColor: color,
      backgroundColor: color,
    };
  });

  return {
    datasets,
  };
};

function App() {
  const [formData, setFormData] = useState({
    movieID: '',
  });
  const [movieData, setMovieData] = useState(null);
  const [rolePercentages, setRolePercentages] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [genrePercentages, setGenrePercentages] = useState([]);
  const [selectedDiversityGenres, setSelectedDiversityGenres] = useState([]);
  const [selectedGCGenres, setSelectedGCGenres] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [isLoadingDiversity, setIsLoadingDiversity] = useState(false);
  const [isLoadingGC, setIsLoadingGC] = useState(false);
  const [diversityGenreData, setDiversityGenreData] = useState([]);
  const [genreComplexityData, setGenreComplexityData] = useState([]);
  
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  const roles=["Additional directing","Additional photography","Art direction","Assistant director","Camera operator","Casting","Choreography","Cinematography",
  "Co-director","Composer","Costume design","Director","Editor","Executive producer","Hairstyling","Lighting","Makeup","Original writer","Producer","Production design",
  "Set decoration","Sound","Special effects","Stunts","Title design","Visual effects","Writer"];

  const genres = [
    "Adventure","Action","Romance","Comedy","Horror","TV Movie","Science Fiction","Animation","Mystery","Western","Documentary",
    "Thriller","Music","History","War","Fantasy","Crime","Drama","Family"
  ];

  const displaySelectedRoles = selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Roles';

  const displaySelectedGenres = selectedDiversityGenres.length > 0 ? selectedDiversityGenres.join(', ') : 'Select Genres';

  const displaySelectedGCGenres = selectedGCGenres.length > 0 ? selectedGCGenres.join(', ') : 'Select Genres';




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

const handleDiversityGenreClick = (genre) => {
  setSelectedDiversityGenres(prevGenres => {
    if (prevGenres.includes(genre)) {
      // If the genre is already selected, remove it from the array
      return prevGenres.filter(g => g !== genre);
    } else {
      // If the genre is not selected, add it to the array
      return [...prevGenres, genre];
    }
  });
};

const handleGenreComplexityClick = (genre) => {
  setSelectedGCGenres(prevGenres => {
    if (prevGenres.includes(genre)) {
      // If the genre is already selected, remove it from the array
      return prevGenres.filter(g => g !== genre);
    } else {
      // If the genre is not selected, add it to the array
      return [...prevGenres, genre];
    }
  });
};



  const onRoleSelect = useCallback((selectedRoles) => {
    // console.log('Selected roles:', selectedRoles); // use selectedRoles as needed to pass to the SQL query
    // pretty sure this is deprecated now
  }, []);

  useEffect(() => {
    if (hasError) {
      // Set a timer to clear the error state
      const timer = setTimeout(() => {
        setHasError(false);
      }, 1300); // 820ms matches the animation duration or any other appropriate delay
  
      // Cleanup the timer when the component unmounts or hasError changes again
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  

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
  };


  const handleDiversityClick = async (genreName) => {
    const genre = `${encodeURIComponent(genreName)}`;
    const url = `/get-diversity/${genre}`;
    try {
      setIsLoadingDiversity(true);
      // console.log('Fetching URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie popularity:', error);
    }
  };

  const handleGCClick = async (genreName) => {
    const genre = `${encodeURIComponent(genreName)}`;
    const url = `/get-genre-complexity/${genre}`; /// need to change this to get-genre-complexity or smthing
    try {
      setIsLoadingGC(true);
      // console.log('Fetching URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching movie popularity:', error);
    }
  };

  const handleMultipleGenresDiversity = async () => {
    // start fetching percentages for all selected genres
    const genrePromises = selectedDiversityGenres.map(genre => handleDiversityClick(genre));
    // the response will be an array with year, avgNumLanguages, avgRating, and genre
    try {
      const results = await Promise.all(genrePromises);
      console.log('Results:', results);
      setDiversityGenreData(results);
      setIsLoadingDiversity(false);
      const chartData = createDiversityChartData(results);
    } catch (error) {
      console.error('Error fetching data for multiple genres:', error);
    }
  };

  const handleMultipleGenresComplexity = async () => {
    // start fetching percentages for all selected genres
    const genrePromises = selectedGCGenres.map(genre => handleGCClick(genre));
    // the response will be an array with year, avgNumLanguages, avgRating, and genre
    try {
      const results = await Promise.all(genrePromises);
      console.log('Results:', results);
      setGenreComplexityData(results);
      const chartData = createGCChartData(results);
      setIsLoadingGC(false);
    } catch (error) {
      console.error('Error fetching data for multiple genres:', error);
    }
  };
  


  
  const DiversityChart = ({ genreData }) => {
    const chartData = createDiversityChartData(genreData);
  
    return <Line data={chartData} options={optionsDiversity} />;
  };

  const GCChart = ({ GCData }) => {
    const chartData = createGCChartData(GCData);
  
    return <Line data={chartData} options={optionsGC} />;
  };
  
  


  
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

      <Text fontSize="xs" mt="4" color={'grey'}> If the percentage is N/A, click the checkmark.</Text>

      <Divider orientation="horizontal" mt="4" width={'30%'} />

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

      <Divider orientation="horizontal" mt="4" width={'30%'} />

        <Flex direction="column" alignItems="center" mt="4">

            <Flex direction="row" alignItems="center" justifyContent="center">
                <Box w={'auto'} h={'auto'}>
                  <Text fontSize="md" color={'white'}>Does diversity have a bearing on popularity?</Text>
                  <Text fontSize="xs" color={'grey'}>Choose any number of genres to compare their diversity!</Text>
                </Box>
                <Tooltip 
                  label={
                    <>
                      <Box as="p" mb="2">
                        <Box as="span" fontWeight="bold" color="lightpink">Diversity: </Box> 
                        Refers to the variety of languages used in films. This metric helps reveal any correlation between a film's linguistic diversity and its perceived quality or appeal.
                      </Box>
                      <Box as="p">
                        <Box as="span" fontWeight="bold" color="lightpink">Popularity: </Box> 
                        Calculated by adding the total number of releases for each movie to twice its average rating. This ensures a balanced measure that reflects both the movie's distribution and viewer appreciation.
                      </Box>
                    </>
                  } 
                  placement="top-start"
                >
                  <Icon
                    as={QuestionIcon}
                    w={5}
                    h={5}
                    color={'white'}
                    _hover={{transform: 'scale(1.2)', color: 'LightBlue'}}
                    sx={{ marginLeft: '10px' }}
                    onClick={() => setSelectedDiversityGenres([])}
                  />
                </Tooltip>
            </Flex>
            
            <Box w={4} h={3} /> {/* Spacer */}

            <Flex direction="row" alignItems="center" justifyContent="center">
              <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    width="auto"
                    minWidth="240px"
                  >
                    {displaySelectedGenres}
                  </MenuButton>
                <MenuList sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {genres.map(genre => (
                    <MenuItem
                      key={genre}
                      onClick={() => handleDiversityGenreClick(genre)}
                      sx={{ color: 'black', fontSize: '12pt' }}
                      background={selectedDiversityGenres.includes(genre) ? 'gray.200' : 'white'}
                      closeOnSelect={false}
                    >
                      {genre}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Tooltip label="Clear all selected genres and remove currently loaded chart" placement="top-start">
                  <Icon
                    as={DeleteIcon}
                    w={5}
                    h={5}
                    color={'white'}
                    _hover={{ color: 'LightCoral', transform: 'scale(1.2)' }}
                    sx={{ marginLeft: '10px' }}
                    onClick={() => {setSelectedDiversityGenres([]); setDiversityGenreData([]);}}
                  />
              </Tooltip>
              <Tooltip label="Find diversity-popularity metric for selected genres" placement="top-start" >
                <Icon
                  as={isLoadingDiversity ? SpinnerIcon : CheckCircleIcon}
                  w={5}
                  h={5}
                  color={hasError ? 'IndianRed' : 'white'}
                  _hover={{ color: 'LightGreen', transform: 'scale(1.2)' }}
                  sx={{
                    marginLeft: '10px',
                    animation: hasError ? `${shake} 0.82s cubic-bezier(.36,.07,.19,.97) both` : (isLoadingDiversity ? `${rotate} 1s linear infinite` : 'none'),
                    _hover: {
                        color: hasError ? 'IndianRed' : (isLoadingDiversity ? 'white' : 'LightGreen'),  // Conditional hover color
                        transform: 'scale(1.2)'
                    }
                  }}
                  onClick={() => handleMultipleGenresDiversity()}
                />
              </Tooltip>
            </Flex>




        </Flex>

        <Flex direction="column" alignItems="center" mt="4" style={{ width: '800px', height: '400px'}}>
          {diversityGenreData && diversityGenreData.length > 0 && (
            <DiversityChart genreData={diversityGenreData} />
          )}
        </Flex>


        <Divider orientation="horizontal" mt="4" width={'30%'} />
          <Flex direction="column" alignItems="center" mt="4">

              <Flex direction="row" alignItems="center" justifyContent="center">
                  <Box w={'auto'} h={'auto'}>
                    <Text fontSize="md" color={'white'}>How complex is each genre in comparison to each other?</Text>
                    <Text fontSize="xs" color={'grey'}>Choose any number of genres to compare their complexity over time!</Text>
                  </Box>
                  <Tooltip 
                  label={
                    <>
                      <Box as="p" mb="2">
                        <Box as="span" fontWeight="bold" color="lightpink">Complexity: </Box> 
                         (in this case) refers to the number of themes movies in that genre explored along with how well the movies explored the themes.
                      </Box>
                    </>
                  } 
                  placement="top-start">
                    <Icon
                      as={QuestionIcon}
                      w={5}
                      h={5}
                      color={'white'}
                      _hover={{transform: 'scale(1.2)', color: 'LightBlue'}}
                      sx={{ marginLeft: '10px' }}
                      onClick={() => setSelectedGCGenres([])}
                    />
                  </Tooltip>
              </Flex>
              
              <Box w={4} h={3} /> {/* Spacer */}

              <Flex direction="row" alignItems="center" justifyContent="center">
                <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      width="auto"
                      minWidth="240px"
                    >
                      {displaySelectedGCGenres}
                    </MenuButton>
                  <MenuList sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {genres.map(genre => (
                      <MenuItem
                        key={genre}
                        onClick={() => handleGenreComplexityClick(genre)}
                        sx={{ color: 'black', fontSize: '12pt' }}
                        background={selectedGCGenres.includes(genre) ? 'gray.200' : 'white'}
                        closeOnSelect={false}
                      >
                        {genre}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Tooltip label="Clear all selected genres and remove currently loaded chart" placement="top-start">
                    <Icon
                      as={DeleteIcon}
                      w={5}
                      h={5}
                      color={'white'}
                      _hover={{ color: 'LightCoral', transform: 'scale(1.2)' }}
                      sx={{ marginLeft: '10px' }}
                      onClick={() => {setSelectedGCGenres([]); setGenreComplexityData([]);}}
                    />
                </Tooltip>
                <Tooltip label="Find genre complexity metric for selected genres" placement="top-start" >
                    <Icon
                      as={isLoadingGC ? SpinnerIcon : CheckCircleIcon}
                      w={5}
                      h={5}
                      color={hasError ? 'IndianRed' : 'white'}
                      _hover={{ color: 'LightGreen', transform: 'scale(1.2)' }}
                      sx={{
                        marginLeft: '10px',
                        animation: hasError ? `${shake} 0.82s cubic-bezier(.36,.07,.19,.97) both` : (isLoadingGC ? `${rotate} 1s linear infinite` : 'none'),
                        _hover: {
                            color: hasError ? 'IndianRed' : (isLoadingGC ? 'white' : 'LightGreen'),  // Conditional hover color
                            transform: 'scale(1.2)'
                        }
                      }}
                      onClick={() => handleMultipleGenresComplexity()}
                    />
                </Tooltip>
              </Flex>




          </Flex>

          <Flex direction="column" alignItems="center" mt="4" style={{ width: '800px', height: '400px'}}>
            {genreComplexityData && genreComplexityData.length > 0 && (
              <GCChart GCData={genreComplexityData} />
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

