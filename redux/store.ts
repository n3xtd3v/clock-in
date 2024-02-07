import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import timestampReducer from "./timestamp/timestamp";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    timestamp: timestampReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
