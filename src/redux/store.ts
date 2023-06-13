import { Store } from "redux"
import { configureStore} from "@reduxjs/toolkit";


import { authReducer } from "./slices/auth";




export const store:Store = configureStore({
  reducer: {
    auth:authReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
