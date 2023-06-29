import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useParams } from "react-router-dom";
import { AnyAction } from "redux";
import { RootState } from "redux/store";
import { ThunkDispatch } from "redux-thunk";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Button, Paper, TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";


import { IItem, fetchUserCollectionItem } from '../../redux/slices/item';
import { fetchEditCountItemCollection } from '../../redux/slices/allCollections';
import { fetchUserAllCollectionItem, fetchDeleteCollectionItem, fetchEditCollectionItem } from '../../redux/slices/allCollectionItems';
import { TableItemLoader } from '../../components/TablesRowsLoader/TableItemsLoader';
import { IUser } from '../../pages/AdminPanel/AdminPanel';



export const CollectionOfItems: React.FC = () => {
  const { id } = useParams();
  const dispatch: ThunkDispatch<Object[] | Object, void, AnyAction> = useDispatch();
  const userData: IUser = useSelector((state: RootState) => state.auth.userData.data);
  const { items, allTags } = useSelector((state: RootState) => state.items);
  const isLoadedItemsData = Boolean(items.allCollectionItems);
  const isAuth = Boolean(userData);


  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string | never>('');
  const [currentItemId, setCurrentItemId] = useState('');
  const [isEdit, setIsEdit] = useState(false);


  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    values: {
      title: title,
      tags: tags
    },
    mode: 'onChange'
  })


  const handleSendItem = async (data: { title: string, tags: string }) => {
    if (title.length > 0 && tags.length > 0 && id) {
      await dispatch(fetchUserCollectionItem({ 'title': title, 'tags': tags.split(' '), 'collectionName': id }));
      await dispatch(fetchUserAllCollectionItem(id));
      setTitle('');
      setTags('');
    }
  }

  const handlerDeleteItem = async (e: SyntheticEvent, index: string) => {
    e.preventDefault();
    await dispatch(fetchDeleteCollectionItem(index));
    id && await dispatch(fetchUserAllCollectionItem(id));
    id && await dispatch(fetchEditCountItemCollection(id));
  }

  const handlerEditItem = async (data: { title: string, tags: string }) => {
    if (title.length > 0 && tags.length > 0 && currentItemId && id) {
      await dispatch(fetchEditCollectionItem({ 'idItem': currentItemId, 'title': title, 'tags': tags.split(' '), 'collectionName': id }));
      await dispatch(fetchUserAllCollectionItem(id));
      setTitle('');
      setTags('');
      setIsEdit(false);
    }
  }

  const onClickEditItem = (e: SyntheticEvent, obj: IItem) => {
    e.preventDefault();
    setTitle(obj.title);
    setTags(obj.tags.join(' '));
    setCurrentItemId(obj._id);
    setIsEdit(true);
  }

  useEffect(() => {
    id && dispatch(fetchUserAllCollectionItem(id))
  }, [id])



  if (!isAuth) {
    return <Navigate to='/'></Navigate>
  }
  return (
    <>
      <TableContainer component={Paper} elevation={2} sx={{ marginBottom: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell > <Typography>Title</Typography></TableCell>
              <TableCell > <Typography>Tags</Typography></TableCell>
              <TableCell ><Typography>Edit</Typography></TableCell>
              <TableCell > <Typography>Delete</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isLoadedItemsData ? (
              <TableItemLoader rowsNum={6} />
            ) : (
              items.allCollectionItems.map((obj: IItem) => (

                <TableRow key={obj._id}>
                  <TableCell>
                    <Link to={`/collection/items/item/${obj._id}`}>
                      {obj.title}
                    </Link>
                  </TableCell>
                  <TableCell><List>{obj.tags.map((val,index) => <ListItem key={uuidv4()}>{val}</ListItem>)}</List></TableCell>
                  <TableCell>
                    <IconButton id={obj._id} onClick={(e) => onClickEditItem(e, obj)} aria-label="edit">
                      <EditNoteIcon fontSize='medium' />
                    </IconButton></TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handlerDeleteItem(e, obj._id)} aria-label="delete">
                      <DeleteIcon fontSize='small' />
                    </IconButton>
                  </TableCell>
                </TableRow>
              )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Paper sx={{ padding: '15px' }}>
        {isEdit ? (<form onSubmit={handleSubmit(handlerEditItem)} >
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant='h5'>Title</Typography>
              <TextField size="small" {...register('title', { value: title })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setTitle(e.currentTarget.value)} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h5'>Tags</Typography>
              <TextField size="small" {...register('tags', { value: tags })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setTags((e.currentTarget.value).trim())} fullWidth />
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" fullWidth>Create</Button>
              </Grid>
            </Grid>
          </Grid>

        </form>) : (<form onSubmit={handleSubmit(handleSendItem)} >
          <Grid container spacing={2} sx={{ marginBottom: '10px' }}>
            <Grid item xs={6}>
              <Typography variant='h5'>Title</Typography>
              <TextField size="small" {...register('title', { value: title })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setTitle(e.currentTarget.value)} fullWidth />
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h5'>Tags</Typography>
              <TextField size="small" {...register('tags', { value: tags })} onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setTags((e.currentTarget.value).trim())} fullWidth />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" fullWidth>Create</Button>
            </Grid>
          </Grid>

        </form>)}


      </Paper>
    </>
  )
}
