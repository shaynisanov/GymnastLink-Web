import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router';
import {CssBaseline, ThemeProvider} from '@mui/joy';
import Layout from '@components/Layout';
import Updates from '@pages/Updates';
import Workouts from '@pages/Workouts';
import Profile from '@pages/Profile';
import Login from '@pages/Login';
import {ClientRoutes} from '@enums/clientRoutes';
import {theme} from './Theme';
import './styles/index.module.scss';

const isAuthenticated = true; // TODO: Replace with authentication logic

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to={ClientRoutes.UPDATES} /> : <Login />} />
          <Route path="/" element={<Layout />}>
            <Route path={ClientRoutes.UPDATES} element={<Updates />} />
            <Route path={ClientRoutes.WORKOUTS} element={<Workouts />} />
            <Route path={ClientRoutes.PROFILE} element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);