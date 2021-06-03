import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { requestDelete, requestGet, requestPost } from '../utils';
import { LINE } from '../constants';

const getLines = createAsyncThunk('line/getLines', async ({ endpoint, accessToken }, thunkAPI) => {
  try {
    const response = await requestGet({
      url: `${endpoint}/lines`,
      accessToken,
    });

    const body = await response.json();

    if (response.status !== 200) {
      throw new Error(body.message);
    }

    return { lines: body };
  } catch (e) {
    console.error(e);
    return thunkAPI.rejectWithValue(e);
  }
});

const addLine = createAsyncThunk(
  'line/addLine',
  async ({ endpoint, accessToken, name, upStationId, downStationId, distance, color }, thunkAPI) => {
    try {
      const response = await requestPost({
        url: `${endpoint}/lines`,
        body: JSON.stringify({
          name,
          upStationId,
          downStationId,
          distance,
          color,
        }),
        accessToken,
      });

      const body = await response.json();

      if (response.status !== 201) {
        throw new Error(body.message);
      }

      return {
        id: body.id,
        startStation: body.stations[0],
        endStation: body.stations[1],
        name,
        distance,
        color,
      };
    } catch (e) {
      console.error(e);
      return thunkAPI.rejectWithValue(e);
    }
  },
);

const removeLine = createAsyncThunk('line/removeLine', async ({ endpoint, accessToken, id }, thunkAPI) => {
  try {
    const response = await requestDelete({
      url: `${endpoint}/lines/${id}`,
      accessToken,
    });

    if (response.status !== 204) {
      const { message } = await response.json();
      throw new Error(message);
    }

    return { id };
  } catch (e) {
    console.error(e);
    return thunkAPI.rejectWithValue(e);
  }
});

const INITIAL_STATUS = {
  isLoading: false,
  isAddSuccess: false,
  message: '',
};

const INITIAL_STATE = {
  lines: [],
  status: { ...INITIAL_STATUS },
};

const lineSlice = createSlice({
  name: 'line',
  initialState: INITIAL_STATE,
  reducers: {
    clearLine: (state) => {
      state = INITIAL_STATE;
    },
    clearLineStatus: (state) => {
      state.status = INITIAL_STATUS;
    },
  },
  extraReducers: {
    [getLines.fulfilled]: (state, action) => {
      const { lines } = action.payload;

      state.lines = lines;
      state.status.isLoading = false;
    },
    [getLines.pending]: (state) => {
      state.status.isLoading = true;
    },
    [getLines.rejected]: (state) => {
      state.status.isLoading = false;
      state.status.message = LINE.GET_FAIL;
    },

    [addLine.fulfilled]: (state, action) => {
      const line = action.payload;

      state.lines = [line, ...state.lines];
      state.status.isAddSuccess = true;
      state.status.message = LINE.ADD_SUCCEED;
    },
    [addLine.pending]: (state) => {
      state.status.isLoading = true;
    },
    [addLine.rejected]: (state) => {
      state.status.isLoading = false;
      state.status.message = LINE.ADD_FAIL;
    },

    [removeLine.fulfilled]: (state, action) => {
      const { id } = action.payload;

      state.lines = state.lines.filter((line) => line.id !== id);
      state.status.message = LINE.DELETE_SUCCEED;
    },
    [removeLine.pending]: (state) => {
      state.status.isLoading = true;
    },
    [removeLine.rejected]: (state) => {
      state.status.isLoading = false;
      state.status.message = LINE.DELETE_FAIL;
    },
  },
});

export { getLines, addLine, removeLine };
export const { clearLine, clearLineStatus } = lineSlice.actions;

export default lineSlice.reducer;
