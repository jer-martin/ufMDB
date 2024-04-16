import logo from './logo.svg';
import './App.css';
import Nav from './components/Nav';
import { Button, Input, Text, Flex, Menu, MenuButton, MenuItem, MenuList, Icon, Tooltip, Divider, Box, InputGroup} from '@chakra-ui/react'; // Ensure Chakra UI imports are here
import { ChevronDownIcon, DeleteIcon, CheckCircleIcon, WarningIcon, QuestionIcon, SpinnerIcon} from '@chakra-ui/icons'; // Ensure Chakra UI imports are here
import React, { useState, useCallback, useEffect } from 'react';
import { CgArrowsExpandDownRight } from "react-icons/cg";
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Title, Filler, Legend, TimeScale } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Tooltip as ChartTooltip } from 'chart.js';
import { keyframes } from '@emotion/react';
import { adapterDateFns } from 'chartjs-adapter-date-fns';
import { countries } from './countries.js';
import { FixedSizeList as List } from 'react-window';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

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
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      }
    }
  }
};

const optionsGCYearly = {
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
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      }
    }
  }
};


const optionsGCMonthly = {
  responsive: true,
  animations: false,
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'month',  // Can be set to 'year', 'month', etc.
        tooltipFormat: 'MMM, yyyy',  // Format of the tooltip
        displayFormats: {
          day: 'MMM, yyyy'  // Format of the year label
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
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      }
    }
  }
};

const optionsGCDaily = {
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
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      }
    }
  }
};

const optionsMS = {
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
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      }
    }
  }
};


const optionsVet = {
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
      beginAtZero: false,
      min: -1,
      max:1,
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
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'xy'
      },
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'xy'
      }
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
      tension: 0.4
    };
  });

  return {
    datasets,
  };
};

const createGCChartData = (genreData) => {
  const datasets = genreData.map((genreArray, index) => {
    const color = `hsl(${index * 360 / genreData.length}, 60%, 60%)`;
    return {
      label: genreArray[0].genre,
      data: genreArray.map(d => ({
        x: new Date(d.rdate), // Convert year to Date object
        y: d.genre_complexity,
      })),
      borderColor: color,
      backgroundColor: color,
      tension: 0.4
    };
  });

  return {
    datasets,
  };
};

const createMSChartData = (MSData, selectedMSGenres) => {
  const latestFirstPointYear = Math.max(
    ...MSData.map(genreData => genreData.length ? genreData[0].yearOfRelease : 0)
  );

  // Assuming MSData is an array of arrays, where each sub-array contains data for a specific genre
  const datasets = MSData.map((dataForOneGenre, index) => {
    // Filter data to include only years after the latest first point and up to 2023
    const filteredData = dataForOneGenre.filter(item => 
      item.yearOfRelease > latestFirstPointYear && item.yearOfRelease <= 2023
    );

    // Use the index to get the genre name from selectedMSGenres
    const genreName = selectedMSGenres[index];
    const color = `hsl(${index * 360 / MSData.length}, 70%, 60%)`;
    const backgroundColor = `hsla(${index * 360 / MSData.length}, 70%, 60%, 0.2)`;

    return {
      label: genreName,
      data: filteredData.map(item => ({
        x: item.yearOfRelease.toString(),
        y: item.genreMarketShare
      })),
      borderColor: color,
      backgroundColor: backgroundColor,
      fill: true,
      tension: 0.4
    };
  });

  // Sorting and deduplication of years across all filtered datasets
  const allYears = datasets.reduce((acc, dataset) => {
    const years = dataset.data.map(item => item.x);
    return acc.concat(years);
  }, []);

  const uniqueYears = Array.from(new Set(allYears)).sort((a, b) => a - b);

  return {
    labels: uniqueYears,
    datasets
  };
};


const createVetData = (crewData) => {
  const datasets = crewData.map((crewArray, index) => {
    // console.log("crewArray[0]:  \n", crewArray[0].CrewRole)
    const color = `hsl(${index * 360 / crewData.length}, 60%, 60%)`;
    return {
      label: crewArray[0].CrewRole,
      data: crewArray.map(d => ({
        x: new Date(d.year, 0), // Convert year to Date object
        y: d.RatingDifferential,
      })),
      borderColor: color,
      backgroundColor: color,
      tension: 0.4
    };
  });
  // console.log("Datasets: ", datasets);
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
  const [selectedVetRoles, setSelectedVetRoles] = useState([]);
  const [minYearsInIndustry, setMinYearsInIndustry] = useState('');
  const [minMovieCount, setMinMovieCount] = useState('');
  const [selectedGCGrouping, setSelectedGCGrouping] = useState([]);
  const [GCGrouping, setGCGrouping] = useState([]);
  const [selectedMSGenres, setSelectedMSGenres] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoadingDiversity, setIsLoadingDiversity] = useState(false);
  const [isLoadingGC, setIsLoadingGC] = useState(false);
  const [isLoadingMS, setIsLoadingMS] = useState(false);
  const [isLoadingVet, setIsLoadingVet] = useState(false);
  const [diversityGenreData, setDiversityGenreData] = useState([]);
  const [genreComplexityData, setGenreComplexityData] = useState([]);
  const [MSData, setGenreMSData] = useState([]);
  const [VetData, setVetData] = useState([]);
  
  
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const CountryRow = ({ index, style }) => (
    <MenuItem
      key={countries[index]}
      onClick={() => handleCountryClick(countries[index])}
      sx={{ color: 'black', fontSize: '12pt', background: selectedCountry === countries[index] ? 'gray.200' : 'white' }}
      style={style}  // Important to pass style for proper positioning
      // on hover, make gray.200. if selected and hovered, make grey.300
      _hover={{ background: selectedCountry === countries[index] ? 'gray.300' : 'gray.100' }}
    >
      {countries[index]}
    </MenuItem>
  );


  const roles=["Additional directing","Additional photography","Art direction","Assistant director","Camera operator","Casting","Choreography","Cinematography",
  "Co-director","Composer","Costume design","Director","Editor","Executive producer","Hairstyling","Lighting","Makeup","Original writer","Producer","Production design",
  "Set decoration","Sound","Special effects","Stunts","Title design","Visual effects","Writer"];

  const genres = [
    "Adventure","Action","Romance","Comedy","Horror","TV Movie","Science Fiction","Animation","Mystery","Western","Documentary",
    "Thriller","Music","History","War","Fantasy","Crime","Drama","Family"
  ];

  const groupings = ["Daily", "Monthly", "Yearly"];

  const displaySelectedRoles = selectedRoles.length > 0 ? selectedRoles.join(', ') : 'Select Roles';

  const displaySelectedGenres = selectedDiversityGenres.length > 0 ? selectedDiversityGenres.join(', ') : 'Select Genres';

  const displaySelectedGCGenres = selectedGCGenres.length > 0 ? selectedGCGenres.join(', ') : 'Select Genres';

  const displaySelectedGCGroupings = selectedGCGrouping.length > 0 ? selectedGCGrouping : 'Select Grouping';
  const displaySelectedCountry = selectedCountry || 'Select a Country';

  const displaySelectedMSGenres = selectedMSGenres.length > 0 ? selectedMSGenres.join(', ') : 'Select Genres';

  const displaySelectedVetRoles = selectedVetRoles.length > 0 ? selectedVetRoles.join(', ') : 'Select Roles';

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
const handleGenreComplexityGroupingClick = (grouping) => {
  selectedGCGrouping.includes(grouping) ? setSelectedGCGrouping([]) : setSelectedGCGrouping([grouping]);
};

const handleGenreMarketShareClick = (genre) => {
  setSelectedMSGenres(prevGenres => {
    if (prevGenres.includes(genre)) {
      // If the genre is already selected, remove it from the array
      return prevGenres.filter(g => g !== genre);
    } else {
      // If the genre is not selected, add it to the array
      return [...prevGenres, genre];
    }
  });
};

const handleVetCrewImpactClick = (role) => {
  setSelectedVetRoles(prevRoles => {
    if (prevRoles.includes(role)) {
      // If the genre is already selected, remove it from the array
      return prevRoles.filter(r => r !== role);
    } else {
      // If the genre is not selected, add it to the array
      return [...prevRoles, role];
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
    // const url = `/get-genre-complexity/${genre}`; 
    let url;
    if (selectedGCGrouping == "Yearly") {
      url = `/get-genre-complexity-yearly/${genre}/1`;
    } else if (selectedGCGrouping == "Monthly") {
      url = `/get-genre-complexity-monthly/${genre}`;
    } else {
      url = `/get-genre-complexity/${genre}`;
    }
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

  const handleCountryClick = (country) => {
    setSelectedCountry(country);
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
    setGCGrouping(selectedGCGrouping);
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

  const handleMarketShare = async (genreName) => {
    const genre = `${encodeURIComponent(genreName)}`;
    const url = `/get-market-share/${genre}/${selectedCountry}`;
    try {
      setIsLoadingMS(true);
      // console.log('Fetching URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching market share:', error);
    }
  }

  const handleMultipleGenresMarketShare = async () => {
    const genrePromises = selectedMSGenres.map(genre => handleMarketShare(genre));
    try {
      const results = await Promise.all(genrePromises);
      // console.log('Results:', results);
      setGenreMSData(results);
      setIsLoadingMS(false);
    } catch (error) {
      console.error('Error fetching data for multiple genres:', error);
    }
  };
  const handleVetCrewRole = async (roleName) => {
    const role = `${encodeURIComponent(roleName)}`;
    const url = `/get-vetcrew/${role}/${minYearsInIndustry}/${minMovieCount}`;
    try {
      setIsLoadingVet(true);
      console.log('Fetching URL:', url);
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching market share:', error);
    }
  }

  const handleMultipleRolesVetCrewImpact = async () => {
    const rolePromises = selectedVetRoles.map(role => handleVetCrewRole(role));
    try {
      const results = await Promise.all(rolePromises);
      // console.log('Results:', results);
      setVetData(results);
      setIsLoadingVet(false);
    } catch (error) {
      console.error('Error fetching data for multiple roles:', error);
    }
  };
  
  const handleMinYearsChange = (event) => {

    setMinYearsInIndustry(event.target.value);
    
  };

  const handleMinMovieCountChange = (event) => {
    setMinMovieCount(event.target.value);
  };


  
  const DiversityChart = ({ genreData }) => {
    const chartData = createDiversityChartData(genreData);
  
    return <Line data={chartData} options={optionsDiversity} />;
  };

  const GCChart = ({ GCData }) => {
    const chartData = createGCChartData(GCData);
    let op;
    if (GCGrouping == "Yearly") {
      op = optionsGCYearly;
    } else if (GCGrouping == "Monthly") {
      op = optionsGCMonthly;
    } else {
      op = optionsGCDaily;
    }
  
    return <Line data={chartData} options={op} />;
  };

  const MSChart = ({ MSData, selectedGenres }) => {
    const chartData = createMSChartData(MSData, selectedGenres);
    return <Line data={chartData} options={optionsMS} />;
  };
  
  const VetChart = ({ VetData, selectedRoles }) => {
    // console.log("VetData: ", VetData)
    // console.log("selectedRoles: ", selectedRoles)
    const chartData = createVetData(VetData);
  
    return <Line data={chartData} options={optionsVet} />;
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
                  _hover={{ background: selectedRoles.includes(role) ? 'gray.300' : 'gray.100' }}
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
                      _hover={{ background: selectedDiversityGenres.includes(genre) ? 'gray.300' : 'gray.100' }}
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
                        _hover={{ background: selectedGCGenres.includes(genre) ? 'gray.300' : 'gray.100' }}
                      >
                        {genre}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Box w={3} h={3} /> {/* Spacer */}
                <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      width="auto"
                      minWidth="240px"
                      // {selectedGCGrouping=="Yearly" ? "120px" : "240px"}
                    >
                      {displaySelectedGCGroupings} 
                    </MenuButton>
                  <MenuList sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {groupings.map(grouping => (
                      <MenuItem
                        key={grouping}
                        onClick={() => handleGenreComplexityGroupingClick(grouping)}
                        sx={{ color: 'black', fontSize: '12pt' }}
                        background={selectedGCGrouping.includes(grouping) ? 'gray.200' : 'white'}
                        closeOnSelect={true}
                      >
                        {grouping}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                {/* {selectedGCGrouping=="Yearly" ? 
                <Box>
                  <InputGroup>
                    <Input
                      name="movieID"
                      placeholder="years to group by"
                      value={formData.movieID}
                      onChange={handleChange}
                      width="110"
                      />  
                  </InputGroup>  
                  </Box>
                  : null
                }                 */}
                <Tooltip label="Clear all selected genres and remove currently loaded chart" placement="top-start">
                    <Icon
                      as={DeleteIcon}
                      w={5}
                      h={5}
                      color={'white'}
                      _hover={{ color: 'LightCoral', transform: 'scale(1.2)' }}
                      sx={{ marginLeft: '10px' }}
                      onClick={() => {setSelectedGCGenres([]); setGenreComplexityData([]); setSelectedGCGrouping([]);}}
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

          <Divider orientation="horizontal" mt="4" width={'30%'} />
          <Flex direction="column" alignItems="center" mt="4">

              <Flex direction="row" alignItems="center" justifyContent="center">
                  <Box w={'auto'} h={'auto'}>
                    <Text fontSize="md" color={'white'}>What market share does each genre have in each country?</Text>
                    <Text fontSize="xs" color={'grey'}>Choose any number of genres and a country to compare their market share over time!</Text>
                  </Box>
                  <Tooltip 
                  label={
                    <>
                      <Box as="p" mb="2">
                        <Box as="span" fontWeight="bold" color="lightpink">Market Share: </Box> 
                        Reflects the proportion of the total film releases in a country that belong to a specific genre within a given year.
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
                      {displaySelectedMSGenres}
                    </MenuButton>
                  <MenuList sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {genres.map(genre => (
                      <MenuItem
                        key={genre}
                        onClick={() => handleGenreMarketShareClick(genre)}
                        sx={{ color: 'black', fontSize: '12pt' }}
                        background={selectedMSGenres.includes(genre) ? 'gray.200' : 'white'}
                        closeOnSelect={false}
                        _hover={{ background: selectedMSGenres.includes(genre) ? 'gray.300' : 'gray.100' }}
                      >
                        {genre}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Box w={4} h={3} /> {/* Spacer */}
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="auto" minWidth="240px">
                    {selectedCountry || 'Select a Country'}
                  </MenuButton>
                  <MenuList sx={{ maxHeight: '250px', overflowY: 'hidden' }}>
                    <List
                      height={250}  // Adjust height accordingly
                      width={'auto'}   // Adjust width accordingly
                      itemCount={countries.length}
                      itemSize={50}  // Adjust size per item
                    >
                      {CountryRow}
                    </List>
                  </MenuList>
                </Menu>
                <Tooltip label="Clear selected genres and country and remove currently loaded chart" placement="top-start">
                    <Icon
                      as={DeleteIcon}
                      w={5}
                      h={5}
                      color={'white'}
                      _hover={{ color: 'LightCoral', transform: 'scale(1.2)' }}
                      sx={{ marginLeft: '10px' }}
                      onClick={() => {setSelectedMSGenres([]); setGenreMSData([]); setSelectedCountry('');}}
                    />
                </Tooltip>
                <Tooltip label="Find market share for selected genres" placement="top-start" >
                    <Icon
                      as={isLoadingMS ? SpinnerIcon : CheckCircleIcon}
                      w={5}
                      h={5}
                      color={hasError ? 'IndianRed' : 'white'}
                      _hover={{ color: 'LightGreen', transform: 'scale(1.2)' }}
                      sx={{
                        marginLeft: '10px',
                        animation: hasError ? `${shake} 0.82s cubic-bezier(.36,.07,.19,.97) both` : (isLoadingMS ? `${rotate} 1s linear infinite` : 'none'),
                        _hover: {
                            color: hasError ? 'IndianRed' : (isLoadingMS ? 'white' : 'LightGreen'),  // Conditional hover color
                            transform: 'scale(1.2)'
                        }
                      }}
                      onClick={() => handleMultipleGenresMarketShare()}
                    />
                </Tooltip>
              </Flex>




          </Flex>

          <Flex direction="column" alignItems="center" mt="4" style={{ width: '800px', height: '400px'}}>
            {MSData && MSData.length > 0 && (
              <MSChart MSData={MSData} selectedGenres={selectedMSGenres} />
            )}
          </Flex>

          
          
          <Divider orientation="horizontal" mt="4" width={'30%'} />
          <Flex direction="column" alignItems="center" mt="4">

              <Flex direction="row" alignItems="center" justifyContent="center">
                  <Box w={'auto'} h={'auto'}>
                    <Text fontSize="md" color={'white'}>What impact does the presence of veteran crew members have on the movie's reception over time?</Text>
                    <Text fontSize="xs" color={'grey'}>Choose a role to observe, a minimum threshold of years in industry, and a minimum threshold of years in industry.</Text>
                  </Box>
                  <Tooltip 
                  label={
                    <>
                      <Box as="p" mb="2">
                        <Box as="span" fontWeight="bold" color="lightpink">Rating Differential: </Box> 
                        A value that quantifies the level of impact they had. A positive value indicates they increased ratings while negative indicates they decreased it.
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
                      onClick={() => setSelectedVetRoles([])}
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
                      {displaySelectedVetRoles}
                    </MenuButton>
                  <MenuList sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {roles.map(role => (
                      <MenuItem
                        key={role}
                        onClick={() => handleVetCrewImpactClick(role)}
                        sx={{ color: 'black', fontSize: '12pt' }}
                        background={selectedVetRoles.includes(role) ? 'gray.200' : 'white'}
                        closeOnSelect={false}
                        _hover={{ background: selectedVetRoles.includes(role) ? 'gray.300' : 'gray.100' }}
                      >
                        {role}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
                <Box w={4} h={3} /> {/* Spacer */}

                {/* Input for minYearsInIndustry */}
                <Input
                  type="number"
                  placeholder="Min. Years in Industry"
                  value={minYearsInIndustry}
                  onChange={handleMinYearsChange}
                  sx={{ marginRight: '10px' }}
                />

                      {/* Input for minMovieCount */}
                <Input
                  type="number"
                  placeholder="Min. Movie Count"
                  value={minMovieCount}
                  onChange={handleMinMovieCountChange}
                  sx={{ marginRight: '10px' }}
                />

                <Tooltip label="Clear selected Roles, minimum thresholds and remove currently loaded chart" placement="top-start">
                    <Icon
                      as={DeleteIcon}
                      w={5}
                      h={5}
                      color={'white'}
                      _hover={{ color: 'LightCoral', transform: 'scale(1.2)' }}
                      sx={{ marginLeft: '10px' }}
                      onClick={() => {setSelectedVetRoles([]); setVetData([]); setMinMovieCount([]); setMinYearsInIndustry([]);}}
                    />
                </Tooltip>
                <Tooltip label="Find veteran crew impact for selected roles and veteran thresholds." placement="top-start" >
                    <Icon
                      as={isLoadingVet ? SpinnerIcon : CheckCircleIcon}
                      w={5}
                      h={5}
                      color={hasError ? 'IndianRed' : 'white'}
                      _hover={{ color: 'LightGreen', transform: 'scale(1.2)' }}
                      sx={{
                        marginLeft: '10px',
                        animation: hasError ? `${shake} 0.82s cubic-bezier(.36,.07,.19,.97) both` : (isLoadingMS ? `${rotate} 1s linear infinite` : 'none'),
                        _hover: {
                            color: hasError ? 'IndianRed' : (isLoadingVet ? 'white' : 'LightGreen'),  // Conditional hover color
                            transform: 'scale(1.2)'
                        }
                      }}
                      onClick={() => handleMultipleRolesVetCrewImpact()}
                    />
                </Tooltip>
              </Flex>




          </Flex>

          <Flex direction="column" alignItems="center" mt="4" style={{ width: '800px', height: '400px'}}>
            {VetData && VetData.length > 0 && (
              <VetChart VetData={VetData} selectedRoles={selectedVetRoles} />
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

