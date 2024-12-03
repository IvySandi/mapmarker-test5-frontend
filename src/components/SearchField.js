import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Box, MenuItem, Menu, Button } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from 'axios';

const Search = styled('div')(({ theme }) => ({
  width: '35%',
  backgroundColor: alpha(theme.palette.common.white, 0.75),
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0.5),
  border: '1px solid black',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  flex: 1,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(0),
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  color: 'black',
  borderColor: 'black',
  backgroundColor: 'white',
  '& .MuiButton-startIcon': {
    color: 'black',
  },
}));

export default function SearchBar({ onFilteredCameras }) {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filterType, setFilterType] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
  
    const handleSearchChange = (event) => {
      setSearchQuery(event.target.value);
      if (filterType) {
        handleFilterClick(filterType, event.target.value);
      }
    };
  
    const handleFilterTypeClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleFilterTypeClose = (filter) => {
      setFilterType(filter);
      setAnchorEl(null);
      setSearchQuery('');
    };
  
    const handleFilterClick = async (filter, query) => {
      try {
        const params = filter && query ? { [filter]: query } : {};
        const response = await axios.get('http://localhost:5000/api/cameras', { params });
        onFilteredCameras(response.data); 
      } catch (error) {
        console.error('Error fetching filtered cameras:', error);
      }
    };
  
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'absolute',
          top: '20px',
          left: '50px',
          zIndex: '1000',
          width: '100%',
          gap: 2,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
        }}
      >
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={
              filterType
                ? `Search by ${filterType === 'department' ? 'Department' : 'Camera Name'}`
                : 'Choose a filter first'
            }
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Search>
  
       
        <FilterButton
        style={{ border: '1px solid black' }}
        variant="outlined"
        startIcon={<FilterAltIcon />}
        onClick={handleFilterTypeClick}
      >
        {filterType
          ? filterType === 'department'
            ? 'Department'
            : 'Camera Name'
          : 'Choose Filter'}
      </FilterButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleFilterTypeClose('name')}>Name</MenuItem>
          <MenuItem onClick={() => handleFilterTypeClose('department')}>
            Department
          </MenuItem>
        </Menu>
      </Box>
    );
  }
  
