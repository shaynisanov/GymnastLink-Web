import {FC} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {StyledButton} from '@components/common/StyledButton';
import {useMutation} from '@hooks/useMutation';
import {userLogout} from '@services/authApi';

const Profile: FC = () => {
  const navigate = useNavigate();
  const {trigger: logout, isLoading: isLoggingOut} = useMutation(userLogout);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');

      toast.success('Logged out successfully');
    } catch (e) {
      toast.error('Error logging out');
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
