import {FC, PropsWithChildren, createContext, useContext, useState} from 'react';
import {LoggedUser} from '@customTypes/User';

interface UserContextType {
  user: LoggedUser | null;
  setUser: (user: LoggedUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: FC<PropsWithChildren> = ({children}) => {
  const [user, setUser] = useState<LoggedUser | null>(null);

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
