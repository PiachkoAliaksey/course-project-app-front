import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { IUser } from '../../pages/AdminPanel/AdminPanel';
import { instance } from '../../constant/apiConfig';



export const fetchUsersTable = createAsyncThunk('table/fetchUserTable', async () => {
  const { data } = await instance.get('/adminDashboard');
  return data;
})
export const fetchDeleteUser = createAsyncThunk('table/fetchDeleteUser', async (id: string) => {
  return await instance.delete(`/adminDashboard/delete/${id}`);
}
)

export const fetchStatusStatusUser = createAsyncThunk('table/fetchPatchUser', async ({ user, status }: { user: string, status: string }) => {
  const { data } = await instance.patch(`/adminDashboard/update/${user}`, { 'status': status });
  return data;
})

export const fetchAccess = createAsyncThunk('table/fetchAccess', async ({ user, position }: { user: string, position: string }) => {
  const { data } = await instance.patch(`/adminDashboard/updateAccess/${user}`, { 'position': position });
  return data;
})



interface IInitialState {
  users: {
    items: IUser[],
    status: string
  }
}
const initialState = {
  users: {
    items: [],
    status: 'loading'
  }
} as IInitialState;

const usersTableSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsersTable.pending, (state) => {
      state.users.items = [];
      state.users.status = 'loading';
    })
    builder.addCase(fetchUsersTable.fulfilled, (state, action) => {
      state.users.items = action.payload
      state.users.status = 'loaded'
    })
    builder.addCase(fetchUsersTable.rejected, (state) => {
      state.users.items = [];
      state.users.status = 'error'
    })
    builder.addCase(fetchDeleteUser.pending, (state) => {
      state.users.items = [];
      state.users.status = 'loading';
    })
    builder.addCase(fetchDeleteUser.fulfilled, (state, action) => {
      const { arg } = action.meta;
      if (arg) {
        state.users.items = state.users.items.filter((obj) => {
          obj._id !== arg
        });
      }
      state.users.status = 'loaded';
    })
    builder.addCase(fetchDeleteUser.rejected, (state) => {
      state.users.items = [];
      state.users.status = 'error'
    })
    builder.addCase(fetchStatusStatusUser.pending, (state) => {
      state.users.items = [];
      state.users.status = 'loading';
    })
    builder.addCase(fetchStatusStatusUser.fulfilled, (state, action) => {
      state.users.status = 'loaded'
      const { arg: { user, status } } = action.meta
      if (user) {
        const toggleElement = state.users.items.find(val => val._id === user);
        if (toggleElement) {
          toggleElement.status = status
        }
      }
    })
    builder.addCase(fetchStatusStatusUser.rejected, (state) => {
      state.users.status = 'error';
      state.users.items = [];
    })
    builder.addCase(fetchAccess.pending, (state) => {
      state.users.items = [];
      state.users.status = 'loading';
    })
    builder.addCase(fetchAccess.fulfilled, (state, action) => {
      state.users.status = 'loaded'
      const { arg: { user, position } } = action.meta
      if (user) {
        const toggleElement = state.users.items.find(val => val._id === user);
        if (toggleElement) {
          toggleElement.position = position
        }
      }
    })
    builder.addCase(fetchAccess.rejected, (state) => {
      state.users.status = 'error';
      state.users.items = [];
    })
  }
})

export const usersTableReducer = usersTableSlice.reducer;
