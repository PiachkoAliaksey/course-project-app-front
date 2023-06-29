import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from '../../constant/apiConfig';




export const fetchAllComments = createAsyncThunk('message/fetchAllMessages', async (params: { to: string }) => {
  const { data } = await instance.post('/collection/items/item/getAllComments', params);
  return data;
})

interface IComment{
  from: string,
  message: string,
  created: string,
}

export interface IInitialStateAllComments {
  messages: IComment[] | [],
  status: string
}
const initialState = {
  messages: [],
  status: 'loading'

} as IInitialStateAllComments;

const allCommentsSlice = createSlice({
  name: 'allComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllComments.pending, (state) => {
      state.messages = [];
      state.status = 'loading';
    })
    builder.addCase(fetchAllComments.fulfilled, (state, action) => {
      state.messages = action.payload
      state.status = 'loaded'
    })
    builder.addCase(fetchAllComments.rejected, (state) => {
      state.messages = [];
      state.status = 'error'
    })

  }
})

export const allCommentsReducer = allCommentsSlice.reducer;
