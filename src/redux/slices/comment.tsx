import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../constant/apiConfig';



export const fetchAddComment = createAsyncThunk('message/fetchAddComment', async (params:{from:string,to:string,comment:string}) => {
  const { data } = await instance.post('/collection/items/item/addComment',params);
  return data;
})



interface IComment {
    messages: {
      _id:string,
      message:{},
      users:string[],
      sender:string,
      createdAt:string,
      updatedAt:string,
      __v:number
    }|{},
    status: string
}
const initialState = {
    messages: {},
    status: 'loading'

}as IComment;

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {},
  extraReducers:(builder)=> {
    builder.addCase(fetchAddComment.pending, (state) => {
      state.messages={};
      state.status = 'loading';
    })
    builder.addCase(fetchAddComment.fulfilled, (state, action) => {
      state.messages = action.payload
      state.status = 'loaded'
    })
    builder.addCase(fetchAddComment.rejected, (state) => {
      state.messages={};
      state.status = 'error'
    })

  }
})

export const commentReducer = commentSlice.reducer;
