import {getCurrentUserData} from '@services/api';
import Cookies from 'js-cookie';
import {FC, PropsWithChildren, createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {LoggedUser} from '@customTypes/User';
import {ClientRoutes} from '@enums/clientRoutes';

interface UserContextType {
  user: LoggedUser | null;
  setUser: (user: LoggedUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: FC<PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const navigate = useNavigate();
  const token = Cookies.get('access_token');

  useEffect(() => {
    if (token) {
      if (!user) {
        getCurrentUserData().then((userData) => {
          setUser(userData);

          if (location.pathname === '/') {
            navigate(ClientRoutes.UPDATES);
          }
        });
      } else if (location.pathname === '/') {
        navigate(ClientRoutes.UPDATES);
      }
    }
  }, [location.pathname]);

  return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
};

const useUserContext = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};

export {UserProvider, useUserContext};
