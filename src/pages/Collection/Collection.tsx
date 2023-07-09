import React, { useState, useEffect, useRef, useCallback, useMemo, SyntheticEvent } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { AnyAction } from "redux";
import { RootState } from "redux/store";
import { ThunkDispatch } from "redux-thunk";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";

import { useTranslation } from "react-i18next";
import Paper from "@mui/material/Paper";
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Grid from '@mui/material/Grid';
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';


import { fetchUserCollection } from "../../redux/slices/collection";
import { fetchUserAllCollections, fetchDeleteCollection, fetchEditCollection } from "../../redux/slices/allCollections"
import { ICollection } from "../../redux/slices/collection"
import { THEMES } from '../../constant/themes';
import { Themes } from '../../components/Themes/Themes';

import './Collection.scss';


export const SelfCollection: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const dispatch: ThunkDispatch<Object[] | Object, void, AnyAction> = useDispatch();
  const userData = useSelector((state: RootState) => state.auth.userData.data);
  const isAuth = Boolean(userData);
  const collectionsData: ICollection[] = useSelector((state: RootState) => state.collections.allCollections.items);
  const isLoaded = Boolean(collectionsData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [themeCollection, setThemeCollection] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  const [currentCollectionId, setCurrentCollectionId] = useState<string | null>(null)
  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    values: {
      title: title,
      description: description,
      themeCollection: themeCollection
    },
    mode: 'onChange'
  })

  const handleSendCollection = async (data: { title: string, description: string, themeCollection: string }) => {
    if (title.length > 0 && description.length > 0 && themeCollection.length > 0 && id) {
      await dispatch(fetchUserCollection({ 'title': title, 'description': description, 'theme': themeCollection, 'idUser': id }));
      id && await dispatch(fetchUserAllCollections(id));

      setTitle('');
      setDescription('');
      setThemeCollection('');
    }
  }
  const handlerEditCollection = async (data: { title: string, description: string, themeCollection: string }) => {
    if (title.length > 0 && description.length > 0 && themeCollection.length > 0 && currentCollectionId) {
      await dispatch(fetchEditCollection({ 'user': currentCollectionId, 'title': title, 'description': description, 'theme': themeCollection }));
      id && await dispatch(fetchUserAllCollections(id));
      setTitle('');
      setDescription('');
      setThemeCollection('');
      setIsEdit(false);
    }
  }

  const handlerDeleteCollection = async (e: SyntheticEvent, index: string) => {
    e.preventDefault();
    await dispatch(fetchDeleteCollection(index));
    id && await dispatch(fetchUserAllCollections(id));
  }
  const onClickEditCollection = (e: SyntheticEvent, obj: ICollection) => {
    e.preventDefault();
    setTitle(obj.title);
    setDescription(obj.description);
    setThemeCollection(obj.theme);
    setCurrentCollectionId(obj._id);
    setIsEdit(true)
  }
  const handlerSubmitEditCollection = () => {
    setIsEdit(false);
  }

  useEffect(() => {
    id && (async () => await dispatch(fetchUserAllCollections(id)))()
  }, [id])
  useEffect(() => {
    isAuth && (async () => id && await dispatch(fetchUserAllCollections(id)))()
  }, [isAuth])

  if (!isAuth) {
    return <Navigate to='/'></Navigate>
  }


  return (
    <>
      <Typography variant="h5" classes={{ root: 'title-my-collection' }}>{t("yourCollections")}</Typography>
      {isEdit ? (<form onSubmit={handleSubmit(handlerEditCollection)} className='form-create-new-collection' >
        <Grid container spacing={0.5} direction="row"
          justifyContent="space-between"
          alignItems="center"
          classes={{ root: 'field-add-new-collection' }}
        >
          <Grid item xs={4}>
            <Typography classes={{root:'title-create-collection-dashboard'}} variant='h5'>{t("titleItem")}</Typography>
            <TextField size="small" {...register('title', { value: title })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setTitle(e.currentTarget.value)} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <Typography classes={{root:'title-create-collection-dashboard'}} variant='h5'>{t("description")}</Typography>
            <TextField size="small"  {...register('description', { value: description })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setDescription(e.currentTarget.value)} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <Typography classes={{root:'title-create-collection-dashboard'}} variant='h5'>{t("theme")}</Typography>
            <TextField size="small" id="outlined-select-currency" SelectProps={{
              native: true,
            }}
              select
              {...register('themeCollection', { value: themeCollection })}
              onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setThemeCollection(e.currentTarget.value)}
              fullWidth
            >
              <Themes />
            </TextField>
          </Grid>
        </Grid>
        <Grid sx={{marginTop:'10px'}}container>
            <Grid item xs={12}>
              <Button type="submit" size="small" variant="contained" fullWidth>{t("edit")}</Button>
            </Grid>
          </Grid>
      </form>) : (<form onSubmit={handleSubmit(handleSendCollection)} className='form-create-new-collection' >
        <Grid container spacing={0.5} direction="row"
          justifyContent="space-between"
          alignItems="center" sx={{ border: 'solid 1px', borderRadius: '5px', padding: '10px' }}>
          <Grid item xs={4}>
            <Typography classes={{root:'title-create-collection-dashboard'}} variant='h5'>{t("titleItem")}</Typography>
            <TextField size="small" {...register('title', { value: title })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setTitle(e.currentTarget.value)} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <Typography classes={{root:'title-create-collection-dashboard'}} variant='h5'>{t("description")}</Typography>
            <TextField size="small"  {...register('description', { value: description })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setDescription(e.currentTarget.value)} fullWidth />
          </Grid>
          <Grid item xs={4}>
            <Typography classes={{root:'title-create-collection-dashboard'}} variant='h5'>{t("theme")}</Typography>
            <TextField size="small" id="outlined-select-currency" SelectProps={{
              native: true,
            }}
              select
              {...register('themeCollection', { value: themeCollection })}
              onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setThemeCollection(e.currentTarget.value)}
              fullWidth
            >
              <Themes />
            </TextField>
          </Grid>
          <Grid sx={{marginTop:'10px'}}container>
            <Grid item xs={12}>
              <Button type="submit" size="small" variant="contained" fullWidth>{t("create")}</Button>
            </Grid>
          </Grid>
        </Grid>
      </form>)}
      <Grid container>
        <Grid xs={12} item >
          <List>
            {isLoaded && collectionsData.map((obj: ICollection, index) =>
              <Paper elevation={2} key={obj._id} sx={{ marginBottom: '10px' }}>
                <Link className='link-collection-items-user' to={`/collection/items/${id}/${obj._id}`}>
                  <ListItemButton key={obj._id} sx={{ color: 'text.primary' }} >
                    <Grid container>
                      <Grid classes={{ root: 'collection-user' }} xs={3} item>{obj.title}</Grid>
                      <Grid classes={{ root: 'collection-user' }} xs={3} item>{obj.description}</Grid>
                      <Grid classes={{ root: 'collection-user' }} xs={3} item>{obj.theme}</Grid>
                      <Grid xs={1.5} item>
                        <IconButton id={obj._id} onClick={(e) => onClickEditCollection(e, obj)} aria-label="edit">
                          <EditNoteIcon fontSize='medium' />
                        </IconButton>
                      </Grid>
                      <Grid xs={1.5} item>
                        <IconButton onClick={(e) => handlerDeleteCollection(e, obj._id)} aria-label="delete">
                          <DeleteIcon fontSize='small' />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </ListItemButton>
                </Link>
              </Paper>
            )
            }
          </List>
        </Grid>
      </Grid>
    </>
  )
}
