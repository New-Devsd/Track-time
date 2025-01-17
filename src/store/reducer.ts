import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import Cookies from 'js-cookie';

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

export interface viewType {
  type: string;
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
  },
  viewType: {}
}

const uniqueId = Math.random().toString(36).substring(7)

const cookiesStorage = Cookies.get('dailyReport')

const dailyReportCookies = cookiesStorage ?  JSON.parse(cookiesStorage) : ''

const reportHeader = {
  title: 'Good Evening Sir,',
  subTitle: 'Today I`ve worked on following Projects',
}

const reportProjects = [
  {
    projectId: uniqueId,
    projectHeading: 'Project Heading',
    task: [{
      id: uniqueId,
      value: ''
    }],
  }
]

const reportTime = {
  startTime: null,
  totalLunchTime: 0,
  totalBreakTime: 0,
  endTime: null,
  totalFullTime: 0,
  finalTime: 0
}

const defaultViewType = 'time'

const initialState: RootState = {
  headerText: dailyReportCookies.headerText ? dailyReportCookies.headerText : reportHeader,
  projects: dailyReportCookies.projects ? dailyReportCookies.projects : reportProjects,
  localTime: reportTime,
  viewType: defaultViewType,
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
    },
    saveViewType: (state, action: PayloadAction<viewType>) => {
      state.viewType = action.payload
    }
  },
});

export const { saveProjects, saveHeader, deleteProjects, saveLocalTime, saveViewType } = headerSlice.actions;
export default headerSlice.reducer;
