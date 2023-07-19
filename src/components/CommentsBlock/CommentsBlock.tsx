import React, { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "redux/store";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { io, Socket } from 'socket.io-client'

import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import Paper from "@mui/material/Paper";
import Grid from '@mui/material/Grid';
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

import { stringAvatar } from "../../utils/createNameAvatar";
import { IInitialStateAllComments } from "../../redux/slices/allComments";
import { fetchAllComments } from "../../redux/slices/allComments";
import { IUser } from "../../pages/AdminPanel/AdminPanel";
import { date } from "../../constant/date";


interface ICommentsBlock {
  children: ReactNode,
  itemIndex: string | undefined,
  commentsUser: {
    from: string;
    message: string;
    created: string;
  }[],
  socket: Socket,
  setCommentsUsers: React.Dispatch<React.SetStateAction<{
    from: string;
    message: string;
    created: string;
  }[]>>
}

export const CommentsBlock: React.FC<ICommentsBlock> = ({ children, itemIndex, socket, commentsUser, setCommentsUsers }) => {
  const dispatch: ThunkDispatch<Object[] | Object, void, AnyAction> = useDispatch();
  const commentsData: IInitialStateAllComments = useSelector((state: RootState) => state.allComments);
  const isLoaded = Boolean(commentsData.messages);
  const userData: IUser = useSelector((state: RootState) => state.auth.userData.data);
  const isAuth = Boolean(userData);

  const [commentArrival, setCommentArrival] = useState<{
    from: string,
    message: string,
    created: string
  } | null>(null);

  useEffect(() => {
    socket.on('comment-receive', (data) => {
      setCommentArrival({ from: data.senderUser, message: data.message, created: date });
    });
  }, []);

  useEffect(() => {
    if (isLoaded && itemIndex) {
      (async () => {
        const data = await dispatch(fetchAllComments({ "to": itemIndex }));
        setCommentsUsers(data.payload);
      })()
    }
  }, [isLoaded])

  useEffect(() => {
    commentArrival && setCommentsUsers(prev => [...prev, commentArrival]);
  }, [commentArrival])

  return (
    <Paper>
      <List>
        {(isLoaded? commentsUser : [...Array(5)]).map((obj: { from: string, message: string, created: string }, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                {isLoaded ? (
                  <Avatar {...stringAvatar(obj.from)} alt={obj.from} />

                ) : (
                  <Skeleton variant="circular" width={40} height={40} />
                )}
              </ListItemAvatar>
              {isLoaded ? (
                <Grid container>
                  <Grid item xs={10}>
                    <ListItemText
                      primary={obj.from}
                      secondary={obj.message}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <ListItemText secondary={obj.created} /></Grid>
                </Grid>


              ) : (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Skeleton variant="text" height={25} width={120} />
                  <Skeleton variant="text" height={18} width={230} />
                </div>

              )}
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </Paper>
  );
};
