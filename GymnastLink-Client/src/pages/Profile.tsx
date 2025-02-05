import {FC} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {LogoutRounded} from '@mui/icons-material';
import {Grid, Typography} from '@mui/joy';
import {PostList} from '@components/PostList';
import {UserDetails} from '@components/UserDetails';
import {StyledButton} from '@components/common/StyledButton';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {useMutation} from '@hooks/useMutation';
import {userLogout} from '@services/authApi';
import {saveNewFile} from '@services/filesApi';
import {getUserPosts} from '@services/postsApi';
import {updateUserProfilePicture} from '@services/usersApi';
import {getUserWorkouts} from '@services/workoutApi';
import styles from '@styles/profile.module.scss';

const Profile: FC = () => {
  const navigate = useNavigate();
  const {user, setUser} = useUserContext();
  const {trigger: logout, isLoading: isLoggingOut} = useMutation(userLogout);
  const {data: usersPosts = [], isFetching: isFetchingPosts} = useFetch(getUserPosts, user?._id);
  const {data: userWorkouts = [], isFetching: isFetchingWorkouts} = useFetch(getUserWorkouts);

  const showPostLoading = useLoadingWithDelay(isFetchingPosts);
  const showUserLoading = useLoadingWithDelay(isFetchingPosts || isFetchingWorkouts);

  const handleUpdateProfilePicture = async (profilePicture: File) => {
    try {
      const result = await saveNewFile(profilePicture);
      const updatedUser = await updateUserProfilePicture(result.url);
      setUser(updatedUser);

      toast.success('Profile picture was successfully updated');
    } catch (e) {
      toast.error("We couldn't upload your image");
    }
  };

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
    <Grid container spacing="32px" className={styles.container}>
      <Grid xs={5} className={styles.profileGridItem}>
        <div className={styles.profile}>
          <Typography level="h2">Your Profile</Typography>
          <UserDetails
            user={user}
            postCount={usersPosts.length}
            workoutCount={userWorkouts.length}
            isLoading={showUserLoading}
            onUpdateProfilePicture={handleUpdateProfilePicture}
          />
        </div>
        <StyledButton
          startDecorator={<LogoutRounded />}
          className={styles.logoutButton}
          loading={isLoggingOut}
          onClick={handleLogout}>
          Logout
        </StyledButton>
      </Grid>
      <Grid xs={7} className={styles.gridItem}>
        <Typography level="h2">Your Posts</Typography>
        <PostList posts={usersPosts} showLoading={showPostLoading} />
      </Grid>
    </Grid>
  );
};

export default Profile;
