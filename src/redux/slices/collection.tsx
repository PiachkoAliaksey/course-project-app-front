import { createSlice, createAsyncThunk,AsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import { instance } from '../../constant/apiConfig';



export interface ICollection{
  title: string,
  description: string,
  theme: string,
  user: string,
  _id: string,
  countOfItems:number,
  createdAt: string,
  updatedAt: string,
  __v: number
}

interface IInitialState {
  collection: {
    item: ICollection|{},
    status: string
  }
}



export const fetchUserCollection = createAsyncThunk('collection/fetchUserCollection', async (params:{title: string, description: string,theme:string}) => {
  const { data } = await instance.post('/collection',params);
  return data;
})



const initialState = {
  collection: {
    item: {},
    status: 'loading'
  }
}as IInitialState;

const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {},
  extraReducers:(builder)=> {
    builder.addCase(fetchUserCollection.pending, (state) => {
      state.collection.item={};
      state.collection.status = 'loading';
    })
    builder.addCase(fetchUserCollection.fulfilled, (state, action) => {
      state.collection.item = action.payload
      state.collection.status = 'loaded'
    })
    builder.addCase(fetchUserCollection.rejected, (state) => {
      state.collection.item={};
      state.collection.status = 'error'
    })

  }
})

export const collectionReducer = collectionSlice.reducer;
