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

import Paper from "@mui/material/Paper";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Grid from '@mui/material/Grid';
import { ListItem, Typography } from '@mui/material';
import List from '@mui/material/List';

import { getUserCollectionItem, fetchUserLike, getLikesItem } from '../../redux/slices/item';
import { IUser } from '../../pages/AdminPanel/AdminPanel';
import { IItem } from '../../redux/slices/item';
import { CommentsBlock } from '../../components/CommentsBlock/CommentsBlock';
import { AddComments } from '../../components/AddComment/AddComment';


interface ISocketItem {
  socket: Socket,
}




export const Item: React.FC<ISocketItem> = ({ socket }) => {
  const { id } = useParams();
  const dispatch: ThunkDispatch<Object[] | Object, void, AnyAction> = useDispatch();
  const userData: IUser = useSelector((state: RootState) => state.auth.userData.data);
  const { itemCollection, likesItemCollection } = useSelector((state: RootState) => state.item);
  const isLoadingItemData = Boolean(itemCollection.item);
  const isLoadingLikes = Boolean(likesItemCollection.likes);
  const isAuth = Boolean(userData);
  const [liked, setLiked] = useState(false);

  const [commentsUsers, setCommentsUsers] = useState<{
    from: string
    message: string,
    created: string
  }[]>([])



  const onClickLike = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLiked(!liked);
    isAuth && await dispatch(fetchUserLike({ 'idItem': id, 'idUser': userData._id, 'isLiked': liked }));
    await dispatch(getLikesItem(id!));
  }


  useEffect(() => {
    id && (async () => {
      await dispatch(getUserCollectionItem(id));
      const data = await dispatch(getLikesItem(id));
      if (isAuth) {
        const userLikeExist = data.payload.includes(userData._id);
        setLiked(userLikeExist);
      }
    })()
  }, [id])

  useEffect(() => {
    isAuth && (async () => {
      const data = await dispatch(getLikesItem(id!));
      if (isAuth) {
        const userLikeExist = data.payload.includes(userData._id);
        setLiked(userLikeExist);
      }
    })()
  }, [isAuth])

  return (
    <>
      <Paper sx={{ padding: '20px', marginBottom: '10px' }}>
        {isLoadingItemData && <Grid container sx={{ marginBottom: '10px' }}>
          <Grid item xs={6}>
            <Typography variant='h5'>{itemCollection.item.title}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h5'><List>{itemCollection.item.tags && itemCollection.item.tags.map((val: string[]) => <ListItem key={uuidv4()}>{val}</ListItem>)}</List></Typography>
          </Grid>
        </Grid>}
        {isAuth && (<Grid container><Grid item xs={0.5} sx={{ display: 'flex', alignItems: 'center' }}><Typography>{isLoadingLikes && likesItemCollection.likes.length}</Typography></Grid><Grid item xs={0.5}><IconButton onClick={(e) => onClickLike(e)} aria-label="like">
          {liked ? (<FavoriteIcon />) : (<FavoriteBorderIcon />)}
        </IconButton></Grid> </Grid>
        )}
      </Paper>

      <CommentsBlock
        commentsUser={commentsUsers}
        setCommentsUsers={setCommentsUsers}
        socket={socket}
        itemIndex={id}
      >
        {id && <AddComments commentsUsers={commentsUsers} setCommentsUsers={setCommentsUsers} socket={socket} itemIndex={id} />}
      </CommentsBlock>
    </>
  )

}
