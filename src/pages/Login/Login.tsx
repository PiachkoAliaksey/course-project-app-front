import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import { useDispatch,useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { Navigate } from "react-router-dom";
import { AnyAction } from "redux";
import { fetchUserData} from "../../redux/slices/auth";
import { RootState } from "redux/store";
import "./Login.scss";

export const Login:React.FC = () => {
  const isAuth = useSelector((state:RootState) => Boolean(state.auth.userData.data&&state.auth.data.status!=='blocked'))
  const dispatch:ThunkDispatch<{fullName: string}, void, AnyAction> = useDispatch();
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode:'onChange'
  })

  const onSubmit = async(values: { email: string, password: string }) => {
    console.log(values);
    const data = await dispatch(fetchUserData(values));
    if(!data.payload){
      return alert('Please, write Full Name or Password correct')
    }

    if(data.payload.status==='blocked'){
      return alert('User is blocked')
    }

    if('token' in data.payload){
      window.localStorage.setItem('token',data.payload.token)
    }
  }

  if(isAuth){
    return <Navigate to='/'></Navigate>
  }

  return (
    <Paper classes={{ root: "registration-bar"}}>
      <Typography classes={{ root: "title" }} variant="h5">
        Enter to account
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className="field"
          label="E-Mail"
          type='email'
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message}
          {...register('email', { required: 'Email' })}
          fullWidth
        />
        <TextField className="field" label="Password"
        error={Boolean(errors.password?.message)}
        {...register('password', { required: 'Password' })}
        helperText={errors.password?.message}
        fullWidth />
        <Button type="submit" size="large" variant="contained" fullWidth>
          Enter
        </Button>
      </form>
    </Paper>
  );
};
