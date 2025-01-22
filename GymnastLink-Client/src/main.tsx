import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router';
import {CssBaseline, ThemeProvider} from '@mui/joy';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import Updates from '@pages/Updates';
import Workouts from '@pages/Workouts';
import {Layout} from '@components/Layout';
import {ClientRoutes} from '@enums/clientRoutes';
import '@styles/index.module.scss';
import {theme} from './Theme';

const isAuthenticated = true; // TODO: Replace with authentication logic

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Navigate to={ClientRoutes.UPDATES} /> : <Login />} />
          <Route path="/" element={<Layout />}>
            <Route index path={ClientRoutes.UPDATES} element={<Updates />} />
            <Route path={ClientRoutes.WORKOUTS} element={<Workouts />} />
            <Route path={ClientRoutes.PROFILE} element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
