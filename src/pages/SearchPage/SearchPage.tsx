import React, { useState, useEffect, SyntheticEvent } from 'react';
import { io, Socket } from 'socket.io-client'
import { useParams } from "react-router-dom";
import { AnyAction } from "redux";
import { RootState } from "redux/store";
import { ThunkDispatch } from "redux-thunk";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


export const SearchPage = ()=>{

  return(
    <>
    </>
  )
}

