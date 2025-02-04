import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router';
import {ToastContainer} from 'react-toastify';
import {CssBaseline, ThemeProvider} from '@mui/joy';
import {Layout} from '@components/Layout';
import {ClientRoutes} from '@enums/clientRoutes';
import {UserProvider} from '@contexts/UserContext';
import Login from '@pages/Login';
import Profile from '@pages/Profile';
import Updates from '@pages/Updates';
import Workouts from '@pages/Workouts';
import {GoogleOAuthProvider} from '@react-oauth/google';
import '@styles/index.module.scss';
import {theme} from './Theme';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="1070493279650-fdhbigfkh36sbo7tig40j34cifj0j007.apps.googleusercontent.com">
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
              </Route>
            </Routes>
            <ToastContainer position="bottom-left" />
          </UserProvider>
        </BrowserRouter>
      </ThemeProvider>
    </StrictMode>
  </GoogleOAuthProvider>
);
