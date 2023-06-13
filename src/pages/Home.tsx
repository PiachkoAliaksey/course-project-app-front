import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { io, Socket } from 'socket.io-client'
import { useDispatch, useSelector } from 'react-redux';
import Paper, { Button } from '@mui/material/';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ListItemButton from '@mui/material/ListItemButton';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import { useNavigate } from "react-router-dom";
import { RootState } from 'redux/store';
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { stringAvatar } from '../utils/createNameAvatar';
import { useForm } from "react-hook-form";


export interface IUser {
  _id: string,
  fullName: string,
  createdAt: string,
  updatedAt: string,
  __v: number
}




export const Home: React.FC = () => {
  const lastMessageRef = useRef<null | HTMLLIElement>(null);
  const navigate = useNavigate();
  const dispatch: ThunkDispatch<IUser[], void, AnyAction> = useDispatch();
  const userData: { data: IUser, status: string } = useSelector((state: RootState) => state.auth.userData);

  const isLoadingUser = userData.status === 'loading';
  const isAuth = Boolean(userData.data);




  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    values: {
      message: '',
      title: ''
    },
    mode: 'onSubmit'
  })



  useEffect(() => {

  }, [])

  return (
    <>
      {isAuth ? <div>
        <Box boxShadow='rgba(0, 0, 0, 0.16) 0px 1px 4px;'>
          <Typography variant='h2'>Hello world!</Typography>
        </Box>
      </div> : ''}
    </>
  );
};
