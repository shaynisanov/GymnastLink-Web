import {userLogout} from '@services/api';
import {FC, useState} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {StyledButton} from '@components/common/StyledButton';

const Profile: FC = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await userLogout();
      navigate('/');

      toast.success('Logged out successfully');
    } catch (e) {
      toast.error('Error logging out');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div>
      <StyledButton loading={isLoggingOut} onClick={handleLogout}>
        Logout
      </StyledButton>
    </div>
  );
};

export default Profile;
