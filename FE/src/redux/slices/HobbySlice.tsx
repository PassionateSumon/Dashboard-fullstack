import { createSlice } from "@reduxjs/toolkit";

export interface Hobby {
  name: string;
}

interface HobbyState {
  hobbies: Hobby[] | null;
}

const initialState: HobbyState = {
  hobbies: null,
};

const eduSlice = createSlice({
  name: "hobby",
  initialState,
  reducers: {},
});

export default eduSlice;
