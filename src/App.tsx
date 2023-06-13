import React, { Component, useEffect,useState ,useRef} from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';



import Container from "@mui/material/Container";
import { Header } from "./components";
import { Home } from "./pages/Home";
import { Registration } from "./pages/Registration/Registration";
import { Login } from "./pages/Login/Login";
import { ChatNewUser } from './pages/ChatNewUser/ChatNewUser';
import { fetchAuthMe } from './redux/slices/auth';
import { io } from 'socket.io-client'
//const socket = io('http://localhost:4444')

import './sass/style.scss';



function App() {
  const dispatch: ThunkDispatch<{ email: string, password: string }, void, AnyAction> = useDispatch();
  useEffect(() => {
    dispatch(fetchAuthMe())
  }, [])


  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Registration />} />
          {/* <Route path ="/adminpanel" element={}/>
          <Route path ="/userpanel" element={}/> */}
        </Routes>
      </Container>
    </>
  )
}

export default App;
