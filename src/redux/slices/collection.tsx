import { createSlice, createAsyncThunk,AsyncThunk} from '@reduxjs/toolkit';
import { instance } from '../../constant/apiConfig';


export interface ICollection{
  title: string,
  description: string,
  theme: string,
  customFields:{customFieldName:string}[],
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



export const addUserCollection = createAsyncThunk('collection/addUserCollection', async (params:{title: string, description: string,theme:string,idUser:string}) => {
  const { data } = await instance.post('/collection',params);
  return data;
})
export const addUserCollectionWithCustomField = createAsyncThunk('collection/addUserCollectionWithCustomField', async (params:{title: string, description: string,theme:string,idUser:string,customFields:{customFieldName:string}[]}) => {
  const { data } = await instance.post('/collectionWithCustomField',params);
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
    builder.addCase(addUserCollection.pending, (state) => {
      state.collection.item={};
      state.collection.status = 'loading';
    })
    builder.addCase(addUserCollection.fulfilled, (state, action) => {
      state.collection.item = action.payload
      state.collection.status = 'loaded'
    })
    builder.addCase(addUserCollection.rejected, (state) => {
      state.collection.item={};
      state.collection.status = 'error'
    })
    builder.addCase(addUserCollectionWithCustomField.pending, (state) => {
      state.collection.item={};
      state.collection.status = 'loading';
    })
    builder.addCase(addUserCollectionWithCustomField.fulfilled, (state, action) => {
      state.collection.item = action.payload
      state.collection.status = 'loaded'
    })
    builder.addCase(addUserCollectionWithCustomField.rejected, (state) => {
      state.collection.item={};
      state.collection.status = 'error'
    })

  }
})

export const collectionReducer = collectionSlice.reducer;
