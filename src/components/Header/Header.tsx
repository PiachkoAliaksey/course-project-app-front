import React, { createContext, useState, useEffect, SyntheticEvent, } from 'react';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import { useTranslation } from "react-i18next";

import './Header.scss';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import { TextField, InputAdornment, Avatar, Autocomplete, ListItem } from "@mui/material";
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
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';


import { logout } from '../../redux/slices/auth';
import { stringAvatar } from '../../utils/createNameAvatar';
import { ColorModeContext } from '../../App';
import { LANGUAGES } from '../../constant/index';
import { fetchSearchItems, fetchSearchItemsByComments,fetchSearchItemsByCollection } from '../../redux/slices/allCollectionItems';
import { IItem } from '../../redux/slices/item';

interface IHeader {
  list: { _id: string, title: string }[],
  setList: React.Dispatch<React.SetStateAction<{ _id: string, title: string }[]>>,
  listByComments: { _id: string, title: string }[],
  setListByComments: React.Dispatch<React.SetStateAction<{ _id: string, title: string }[]>>,
  listByCollection:{ _id: string, title: string }[],
  setListByCollection:React.Dispatch<React.SetStateAction<{
    _id: string;
    title: string;
}[]>>

}


export const Header: React.FC<IHeader> = ({ list, setList, listByComments, setListByComments,listByCollection,setListByCollection }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  const { i18n, t } = useTranslation();

  const dispatch: ThunkDispatch<IItem[], void, AnyAction> = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData);
  const isLoading = userData.status === 'loading';
  const isAuth = Boolean(userData.data)&&userData.data.status!=='blocked';
  console.log(isAuth);
  const isAdmin = isAuth && userData.data.position === 'admin';

  const [open, setOpen] = React.useState(false);
  const [searchResult, setSearchResult] = useState('');

  console.log(listByCollection);

  console.log(listByComments);
  console.log(list);
  console.log(searchResult);
  const [language, setLanguage] = useState<string>(JSON.parse(localStorage.getItem('language')!) || 'en');

  const handleChangeLanguage = (event: SelectChangeEvent) => {
    const lang_code = event.target.value;
    i18n.changeLanguage(lang_code);
    setLanguage(event.target.value);
  };

  const handleSearchBar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchResult(e.currentTarget.value);
    const data = await dispatch(fetchSearchItems(searchResult));
    const dataItemByComments = await dispatch(fetchSearchItemsByComments(searchResult));
    const dataItemByCollection = await dispatch(fetchSearchItemsByCollection(searchResult));
    setListByCollection(dataItemByCollection.payload);
    setListByComments(dataItemByComments.payload);
    setList(data.payload);
    navigate('/search/items')
  };
  const handleDisagreeClose = () => {
    setOpen(false);
  };
  const handleAgreeClose = () => {
    setOpen(false);
    dispatch(logout());
    window.localStorage.removeItem('token');
  };

  const onClickLogout = () => {
    setOpen(true);
  };

  useEffect(() => {
    localStorage.setItem('language', JSON.stringify(language));
  }, [language]);
  useEffect(() => {
    i18n.changeLanguage(language);
  }, []);

  return (
    <>
    <Dialog
        open={open}
        onClose={handleDisagreeClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("wanttologout")}?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDisagreeClose}>{t("disagree")}</Button>
          <Button onClick={handleAgreeClose} autoFocus>
          {t("agree")}
          </Button>
        </DialogActions>
      </Dialog>
      <Container maxWidth={false} sx={{ padding: '15px', bgcolor: 'background.default', color: 'text.primary' }}>
        <div className="inner">
          <Link className="logo" to="/">
            <Typography variant='h4'>{t("title")}</Typography>
          </Link>
          <Autocomplete
            sx={{ width: '40%' }}
            disableClearable
            noOptionsText={`${t("noResultsFound")}`}
            id="combo-box-demo"
            options={[...list, ...listByComments]}
            getOptionLabel={(option) => option.title}
            renderInput={(params) => {
              return (<TextField {...params}
                id="search"
                type="search"
                label={t("search")}
                value={searchResult}
                onChange={handleSearchBar}
                className='search-bar'
                InputProps={{
                  ...params.InputProps,
                  type: 'search',
                }}

              />)

            }
            }
            renderOption={(props, option: { _id: string, title: string }, { inputValue }) => {
              const matches = match(option.title, inputValue, { insideWords: true });
              const parts = parse(option.title, matches);

              return (
                <Link key={option._id} className='result-item-researched' to={`/collection/items/item/${option._id}`}>
                  <ListItem sx={{ color: 'text.primary' }} {...props}>
                    <div>
                      {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </ListItem>
                </Link>

              );
            }}
          />
          <FormControl sx={{ m: 1, minWidth: 80, marginBottom: '5px' }} size="small">
            <InputLabel>{t("language")}</InputLabel>
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
          <IconButton sx={{ ml: 1, marginBottom: '5px' }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <LightMode /> : <ModeNight />}
          </IconButton>

          <div className="buttons">
            {isAuth ? (isAdmin ? (<>
              {isLoading ? '' : <Avatar  {...stringAvatar(userData.data.fullName)} className='avatar-user' />}
              <Link to="/adminpanel">
                <Button classes={{ root: 'btn-header' }} variant="outlined">{t("adminPanel")}</Button>
              </Link>
              <Button classes={{ root: 'btn-header' }} onClick={onClickLogout} variant="contained" color="error">
                {t("logout")}
              </Button>

            </>) : (<>
              {isLoading ? '' : <Avatar  {...stringAvatar(userData.data.fullName)} className='avatar-user' />}
              <Link to={`/collection/${userData.data._id}`}>
                <Button classes={{ root: 'btn-header' }} variant="outlined">{t("createCollection")}</Button>
              </Link>
              <Button classes={{ root: 'btn-header' }} onClick={onClickLogout} variant="contained" color="error">
                {t("logout")}
              </Button>

            </>)

            ) : (
              <>
                <Link to="/login">
                  <Button classes={{ root: 'btn-header' }} variant="outlined">{t("signIn")}</Button>
                </Link>
                <Link to="/signup">
                  <Button classes={{ root: 'btn-header' }} variant="contained">{t("signUp")}</Button>
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
