import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const login = createAsyncThunk('user/login', async ({ endpoint, email, password }, thunkAPI) => {
  try {
    const response = await fetch(`${endpoint}/login/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const body = await response.json();

    if (response.status === 200) {
      return { ...body, email };
    } else {
      throw new Error(body);
    }
  } catch (e) {
    console.error(e.response.data);
    thunkAPI.rejectWithValue(e.response.data);
  }
});

const loginByToken = createAsyncThunk('user/loginByToken', async ({ endpoint, accessToken }, thunkAPI) => {
  try {
    const response = await fetch(`${endpoint}/members/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const body = await response.json();

    if (response.status === 200) {
      return { email: body.email, accessToken };
    } else {
      throw new Error(body);
    }
  } catch (e) {
    console.error(e.response.data);
    thunkAPI.rejectWithValue(e.response.data);
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: null,
    accessToken: null,
    isLogin: false,
    isLoginFailed: false,
    isLoading: false,
  },
  reducers: {
    logout: (state) => {
      state.email = null;
      state.accessToken = null;
      state.isLogin = false;
    },
    clearLoginFailed: (state) => {
      state.isLoginFailed = false;
    },
  },
  extraReducers: {
    [login.fulfilled]: (state, action) => {
      const { email, accessToken } = action.payload;

      state.email = email;
      state.accessToken = accessToken;
      state.isLogin = true;
      state.isLoading = false;
    },
    [login.pending]: (state) => {
      state.isLoading = true;
    },
    [login.rejected]: (state) => {
      state.isLoginFailed = true;
      state.isLoading = false;
    },
    [loginByToken.fulfilled]: (state, action) => {
      const { email, accessToken } = action.payload;

      state.email = email;
      state.accessToken = accessToken;
      state.isLogin = true;
      state.isLoading = false;
    },
    [loginByToken.pending]: (state) => {
      state.isLoading = true;
    },
    [loginByToken.rejected]: (state) => {
      state.isLoginFailed = true;
      state.isLoading = false;
    },
  },
});

export { login, loginByToken };
export const { logout, clearLoginFailed } = userSlice.actions;

export default userSlice.reducer;
