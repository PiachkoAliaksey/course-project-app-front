import React, { createContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { useTranslation } from "react-i18next";

import './Header.scss';

import Button from '@mui/material/Button';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { TextField, InputAdornment, Avatar } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import LightMode from '@mui/icons-material/LightMode';
import ModeNight from '@mui/icons-material/ModeNight';
import { Typography } from '@mui/material';
import SearchIcon from "@mui/icons-material/Search";
import Divider from '@mui/material/Divider';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


import { logout } from '../../redux/slices/auth';
import { stringAvatar } from '../../utils/createNameAvatar';
import { ColorModeContext } from '../../App';
import { LANGUAGES } from '../../constant/index';




export const Header = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const { i18n, t } = useTranslation();


  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const isLoading = userData.status === 'loading';
  const isAuth = Boolean(userData.data);
  //const isAdmin = userData.data.position === 'admin'

  const [language, setLanguage] = useState<string>(JSON.parse(localStorage.getItem('language')!) || 'en');
  const handleChangeLanguage = (event: SelectChangeEvent) => {
    const lang_code = event.target.value;
    i18n.changeLanguage(lang_code);
    setLanguage(event.target.value);
  };

  const onClickLogout = () => {
    if (window.confirm('Are you sure you want to logout'))
      dispatch(logout())
    window.localStorage.removeItem('token')
  };

  useEffect(() => {
    localStorage.setItem('language', JSON.stringify(language));
  }, [language]);
  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  return (
    <>
      <Container maxWidth={false} sx={{ padding: '15px', bgcolor: 'background.default', color: 'text.primary' }}>
        <div className="inner">
          <Link className="logo" to="/">
            <Typography variant='h4'>{t("title")}</Typography>
          </Link>
          <TextField
            id="search"
            type="search"
            label={t("search")}
            className='search-bar'
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <FormControl sx={{ m: 1, minWidth: 80, marginBottom:'5px' }} size="small">
            <InputLabel>Language</InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-select-small"
              value={language}
              label={t("language")}
              onChange={handleChangeLanguage}
              displayEmpty
            >
              {LANGUAGES.map(({ label, code }) => <MenuItem key={code} value={code}>{label}</MenuItem>)}
            </Select>
          </FormControl>
          <IconButton sx={{ ml: 1, marginBottom:'5px'}} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <LightMode /> : <ModeNight />}
          </IconButton>

          <div className="buttons">
            {isAuth ? (userData.data.position === 'admin' ? (<>
              {isLoading ? '' : <Avatar  {...stringAvatar(userData.data.fullName)} className='avatar-user' />}
              <Link to="/adminpanel">
                <Button variant="outlined">Admin panel</Button>
              </Link>
              <Button onClick={onClickLogout} variant="contained" color="error">
                {t("logout")}
              </Button>

            </>) : (<>
              {isLoading ? '' : <Avatar  {...stringAvatar(userData.data.fullName)} className='avatar-user' />}
              <Link to="/collection">
                <Button variant="outlined">Create collection</Button>
              </Link>
              <Button onClick={onClickLogout} variant="contained" color="error">
                {t("logout")}
              </Button>

            </>)

            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">{t("login")}</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="contained">{t("signup")}</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
      <Divider />
    </>
  );
};
