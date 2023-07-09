import React, { Component, useEffect, useContext, createContext, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";


import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';




import Container from "@mui/material/Container";
import { Header } from "./components";
import { Home } from "./pages/Home";
import { AdminPanel } from './pages/AdminPanel/AdminPanel';
import { Registration } from "./pages/Registration/Registration";
import { Login } from "./pages/Login/Login";
import { SelfCollection } from './pages/Collection/Collection';
import { CollectionOfItems } from './pages/CollectionOfItems/CollectionOfItems';
import { Item } from './pages/Item/Item';
import { SearchPage } from './pages/SearchPage/SearchPage';
import { SearchPageItems } from './pages/SearchPageItems/SearchPageItems'
import { fetchAuthMe } from './redux/slices/auth';
import { IItem } from './redux/slices/item';
import { io } from 'socket.io-client'
const socket = io('http://localhost:4444')

import './sass/style.scss';

export const ColorModeContext = createContext({ toggleColorMode: () => { } });


function App() {
  const [list, setList] = useState<{ _id: string, title: string }[]>([]);
  const [listByComments, setListByComments] = useState<{ _id: string, title: string }[]>([]);
  const [listByCollection, setListByCollection] = useState<{ _id: string, title: string }[]>([]);
  const [mode, setMode] = React.useState<'light' | 'dark'>(JSON.parse(localStorage.getItem('theme')!) || 'light');

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const dispatch: ThunkDispatch<{ email: string, password: string }, void, AnyAction> = useDispatch();
  useEffect(() => {
    dispatch(fetchAuthMe())
  }, [])
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(mode));
  }, [mode])


  return (
    <>
      <ThemeProvider theme={theme}>
        <ColorModeContext.Provider value={colorMode}>
          <Header listByCollection={listByCollection} setListByCollection={setListByCollection} listByComments={listByComments} setListByComments={setListByComments} list={list} setList={setList} />
          <Container sx={{ padding: '10px', bgcolor: 'background.default', color: 'text.primary', flex: '1 1 auto' }} maxWidth={false}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search/:tag" element={<SearchPage />} />
              <Route path="/search/items" element={<SearchPageItems list={list} listByComments={listByComments} listByCollection={listByCollection} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Registration />} />
              <Route path="/adminpanel" element={<AdminPanel />} />
              <Route path="/collection/:id" element={<SelfCollection />} />
              <Route path="/collection/items/:userId/:collectionId" element={<CollectionOfItems />} />
              <Route path="/collection/items/item/:id" element={<Item socket={socket} />} />
            </Routes>
          </Container>
        </ColorModeContext.Provider>
      </ThemeProvider>
    </>
  )
}

export default App;
