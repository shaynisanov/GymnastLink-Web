import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';
import {ToastContainer} from 'react-toastify';
import {CssBaseline, ThemeProvider} from '@mui/joy';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import Updates from '@pages/Updates';
import Workouts from '@pages/Workouts';
import {Layout} from '@components/Layout';
import {UserProvider} from '@contexts/UserContext';
import {ClientRoutes} from '@enums/clientRoutes';
import '@styles/index.module.scss';
import {theme} from './Theme';
import Comments from '@pages/Comments';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/" element={<Layout />}>
              <Route index path={ClientRoutes.UPDATES} element={<Updates />} />
              <Route path={ClientRoutes.WORKOUTS} element={<Workouts />} />
              <Route path={ClientRoutes.PROFILE} element={<Profile />} />
              <Route path={ClientRoutes.COMMENTS} element={<Comments />} />
            </Route>
          </Routes>
          <ToastContainer position="bottom-left" />
        </UserProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
