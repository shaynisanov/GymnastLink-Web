import {FC, useEffect, useState} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {AlternateEmailRounded, LogoutRounded} from '@mui/icons-material';
import {Grid, Typography} from '@mui/joy';
import {EditUsernamePopup} from '@components/EditUsernamePopup';
import {PostList} from '@components/PostList';
import {UserDetails} from '@components/UserDetails';
import {StyledButton} from '@components/common/StyledButton';
import {Post} from '@customTypes/Post';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {useMutation} from '@hooks/useMutation';
import {userLogout} from '@services/authApi';
import {saveNewFile} from '@services/filesApi';
import {getUserPosts} from '@services/postsApi';
import {updateUserName, updateUserProfilePicture} from '@services/usersApi';
import {getUserWorkouts} from '@services/workoutApi';
import styles from '@styles/profile.module.scss';

const Profile: FC = () => {
  const navigate = useNavigate();
  const {user, setUser} = useUserContext();
  const {trigger: logout, isLoading: isLoggingOut} = useMutation(userLogout);
  const {data: initialUserPosts = [], isFetching: isFetchingPosts} = useFetch(getUserPosts, user?._id);
  const {data: userWorkouts = [], isFetching: isFetchingWorkouts} = useFetch(getUserWorkouts);

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isEditUsernamePopupOpen, setIsEditUsernamePopupOpen] = useState(false);

  const showPostLoading = useLoadingWithDelay(isFetchingPosts);
  const showUserLoading = useLoadingWithDelay(isFetchingPosts || isFetchingWorkouts);

  useEffect(() => {
    setUserPosts(initialUserPosts);
  }, [initialUserPosts]);

  const handleUpdateProfilePicture = async (profilePicture: File) => {
    try {
      const result = await saveNewFile(profilePicture);
      const updatedUser = await updateUserProfilePicture(result.url);
      setUser(updatedUser);

      setUserPosts(currPosts =>
        currPosts.map(post => ({
          ...post,
          user: {
            ...post.user,
            profileImageUrl: updatedUser.profileImageUrl,
          },
        }))
      );

      toast.success('Profile picture was successfully updated');
    } catch (e) {
      toast.error("We couldn't upload your image");
    }
  };

  const handleUpdateUserName = async (newUsername: string) => {
    try {
      const updatedUser = await updateUserName(newUsername);
      setUser(updatedUser);

      setUserPosts(currPosts =>
        currPosts.map(post => ({
          ...post,
          user: {
            ...post.user,
            userName: updatedUser.userName,
          },
        }))
      );

      toast.success('UserName was successfully updated');
      setIsEditUsernamePopupOpen(false);
    } catch (e) {
      toast.error("We couldn't update your userName");
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
            postCount={initialUserPosts.length}
            workoutCount={userWorkouts.length}
            isLoading={showUserLoading}
            onUpdateProfilePicture={handleUpdateProfilePicture}
          />
        </div>
        <div className={styles.bottomActions}>
          <StyledButton
            startDecorator={<LogoutRounded />}
            className={styles.button}
            loading={isLoggingOut}
            onClick={handleLogout}>
            Logout
          </StyledButton>
          <StyledButton
            startDecorator={<AlternateEmailRounded />}
            className={styles.button}
            onClick={() => setIsEditUsernamePopupOpen(true)}>
            Edit UserName
          </StyledButton>
        </div>
      </Grid>
      <Grid xs={7} className={styles.gridItem}>
        <Typography level="h2">Your Posts</Typography>
        <PostList posts={userPosts} showLoading={showPostLoading} />
      </Grid>
      <EditUsernamePopup
        open={isEditUsernamePopupOpen}
        onSubmit={handleUpdateUserName}
        onClose={() => setIsEditUsernamePopupOpen(false)}
      />
    </Grid>
  );
};

export default Profile;
