import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import './Header.scss';
import Container from '@mui/material/Container';
import { TextField, InputAdornment, Avatar } from "@mui/material";
import { Typography } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { logout } from '../../redux/slices/auth';
import { stringAvatar } from '../../utils/createNameAvatar';


export const Header = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const isLoading = userData.status === 'loading';
  const isAuth = Boolean(userData.data);

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout'))
      dispatch(logout())
    window.localStorage.removeItem('token')
  };

  return (
    <div className="nav-bar">
      <Container maxWidth="lg">
        <div className="inner">
          <Link className="logo" to="/">
            <div>Self Collection</div>
          </Link>

            <TextField
              id="search"
              type="search"
              label="Search"

              sx={{ width: 300 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

          <div className="buttons">
            {isAuth ? (
              <>
                {isLoading ? '': <Avatar  {...stringAvatar(userData.data.fullName)} sx={{ width: 50, height: 50 }}/>}
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Log in</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="contained">Sign up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
