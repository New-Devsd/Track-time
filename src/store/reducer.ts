import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';

export interface projectFields {
  id: string;
  value: string;
}

export interface projects {
  projectId: string;
  projectHeading: string;
  task: projectFields[];
}

export interface localTime {
  startTime: Dayjs | null,
  totalLunchTime: number,
  totalBreakTime: number,
  endTime: Dayjs | null,
  totalFullTime: number,
  finalTime: number
}

export interface RootState {
  headerText: {
    title: string;
    subTitle: string;
  };
  projects: {
    projectId: string;
    projectHeading: string;
    task: projectFields[];
  }[]
  localTime: {
    startTime: Dayjs | null,
    totalLunchTime: number,
    totalBreakTime: number,
    endTime: Dayjs | null,
    totalFullTime: number,
    finalTime: number
  }
}

const uniqueId = Math.random().toString(36).substring(7)

const initialState: RootState = {
  headerText: {
    title: 'Good Evening Sir,',
    subTitle: 'Today I`ve worked on following Projects',
  },
  projects: [
    {
      projectId: uniqueId,
      projectHeading: 'Project Heading',
      task: [{
        id: uniqueId,
        value: ''
      }],
    }
  ],
  localTime: {
    startTime: null,
    totalLunchTime: 0,
    totalBreakTime: 0,
    endTime: null,
    totalFullTime: 0,
    finalTime: 0
  }
};

const headerSlice = createSlice({
  name: 'headerSlice',
  initialState,
  reducers: {
    saveHeader: (state, action: PayloadAction<{ title: string; subTitle: string }>) => {
      state.headerText = action.payload;
    },
    saveProjects: (state, action: PayloadAction<projects[]>) => {
      state.projects = action.payload;
    },
    deleteProjects: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.filter((project) => project.projectId !== action.payload);
    },
    saveLocalTime: (state, action: PayloadAction<localTime>) => {
      state.localTime = action.payload
    }
  },
});

export const { saveProjects, saveHeader, deleteProjects, saveLocalTime } = headerSlice.actions;
export default headerSlice.reducer;
