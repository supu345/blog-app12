import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "userSlice",
  initialState: JSON.parse(localStorage.getItem("user")) || {
    token: null,
  },
  reducers: {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
