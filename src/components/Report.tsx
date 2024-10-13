import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
} from '@mui/material';
import HeaderComponent from './HeaderComponent';
import TaskParentComponent from './TaskParentComponent';
import TimeDetailsComponent from './TimeDetailsComponent';
import FinalReportComponent from './FinalReportComponent';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, saveViewType } from '../store/reducer';

const Report: React.FC = () => {

  const viewType = useSelector((state: RootState) => state.viewType)
  const dispatch = useDispatch()


  const [value, setValue] = useState(viewType);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
    dispatch(saveViewType(newValue))
  };

  return (
    <Container
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: '100%'
        }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="report tab">
          <Tab label="Time" value={'time'} />
          <Tab label="Full Report" value={'full'} />
        </Tabs>
      </Box>
      <Card sx={{ margin: 2, p:  1 }} hidden={value !== 'full'}>
        <Paper elevation={2} sx={{ m: 2, mb: 0 }}>
          <HeaderComponent />
        </Paper>
        <CardContent hidden={value !== 'full'}>
          <Grid container spacing={2}>
            <Grid item sm={12} lg={5}>
              <TaskParentComponent />
            </Grid>
            <Grid item sm={12} lg={4}>
              <Paper  sx={{ p: 2 }}>
                <TimeDetailsComponent />
              </Paper>
            </Grid>
            <Grid item sm={12} lg={3}>
              <Paper sx={{ p: 2 }}>
                <FinalReportComponent />
              </Paper>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Card sx={{ my: 4, maxWidth: 1000, m: 'auto' }} hidden={value !== 'time'}>
          <Paper  sx={{ p: 2 }}>
            <TimeDetailsComponent />
          </Paper>
      </Card>
    </Container>
  );
};

export default Report;
