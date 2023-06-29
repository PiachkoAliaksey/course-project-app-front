import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import { AnyAction } from "redux";
import { RootState } from "redux/store";
import { ThunkDispatch } from "redux-thunk";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { io, Socket } from 'socket.io-client'

import "./AddComment.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";



import { IUser } from '../../pages/AdminPanel/AdminPanel';
import { IItem } from '../../redux/slices/item';
import { stringAvatar } from "../../utils/createNameAvatar";
import { fetchAddComment } from "../../redux/slices/comment";
import { fetchAllComments } from "../../redux/slices/allComments";
import { date } from "../../constant/date";

interface IAddComment{
  itemIndex:string,
  socket:Socket,
  setCommentsUsers:React.Dispatch<React.SetStateAction<{
    from: string;
    message: string;
    created: string;
}[]>>,
commentsUsers: {
  from: string;
  message: string;
  created: string;
}[]
}

export const AddComments:React.FC<IAddComment> = ({itemIndex,socket,setCommentsUsers,commentsUsers}) => {
  const dispatch: ThunkDispatch<Object[] | Object, void, AnyAction> = useDispatch();
  const userData: IUser = useSelector((state: RootState) => state.auth.userData.data);

  const isAuth = Boolean(userData);


  const [comment, setComment] = useState<string>('');




  const { register, handleSubmit, setError, formState: { errors, isValid } } = useForm({
    values: {
      comment: comment,
    },
    mode: 'onSubmit'
  })

  const handleSendComment = async (text: { comment: string }) => {
    if ( comment.length > 0) {
      await dispatch(fetchAddComment({ "from": userData._id, "to": itemIndex, "comment": text.comment }));
      socket.emit('send-comment', {
        to: itemIndex,
        from: userData._id,
        message: text.comment,
        senderUser: userData.fullName
      });
      // const today = new Date();
      // const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // const weekday = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
      // const month = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
      setCommentsUsers([...commentsUsers,{ from:userData.fullName, message: text.comment, created: date }]);
      setComment('');
    }
  }



  return (
    <>
      {
      isAuth && <div className="add-comment-block">
        <Avatar {...stringAvatar(userData.fullName)} classes={{ root: 'avatar' }} />
        <form onSubmit={handleSubmit(handleSendComment)} className="form">
          <TextField
          {...register('comment', { value: comment})}
          onChange={(e: React.SyntheticEvent<HTMLInputElement | HTMLTextAreaElement>) => setComment(e.currentTarget.value)}
            label="Write comment..."
            variant="outlined"
            maxRows={10}
            multiline
            fullWidth
          />
          <Button type="submit" variant="contained">Sent</Button>
        </form>
      </div>
      }
    </>
  );
};
