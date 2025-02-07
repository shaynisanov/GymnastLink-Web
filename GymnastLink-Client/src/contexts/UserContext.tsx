import Cookies from 'js-cookie';
import {Dispatch, FC, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {LoggedUser} from '@customTypes/User';
import {ClientRoutes} from '@enums/clientRoutes';
import {getCurrentUserData} from '@services/authApi';

interface UserContextType {
  user: LoggedUser | null;
  setUser: Dispatch<SetStateAction<LoggedUser | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: FC<PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const navigate = useNavigate();
  const token = Cookies.get('access_token');

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        const userData = await getCurrentUserData();
        setUser(userData);

        if (location.pathname === '/') {
          navigate(ClientRoutes.UPDATES);
        }
      }
    };

    fetchUserData();
  }, [token, navigate]);

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
