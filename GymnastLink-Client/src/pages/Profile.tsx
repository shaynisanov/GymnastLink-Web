import {FC} from 'react';
import {useNavigate} from 'react-router';
import {toast} from 'react-toastify';
import {StyledButton} from '@components/common/StyledButton';
import {useMutation} from '@hooks/useMutation';
import {userLogout} from '@services/authApi';
import styles from '@styles/profile.module.scss';
import {Grid, Typography} from '@mui/joy';
import {PostList} from '@components/PostList';
import {useFetch} from '@hooks/useFetch';
import {getUserPosts} from '@services/postsApi';
import {useUserContext} from '@contexts/UserContext';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {getUserWorkouts} from '@services/workoutApi';
import {LogoutRounded} from '@mui/icons-material';
import {UserDetails} from '@components/UserDetails';

const Profile: FC = () => {
    const navigate = useNavigate();
    const {user} = useUserContext();
    const {trigger: logout, isLoading: isLoggingOut} = useMutation(userLogout);
    const {data: usersPosts = [], isFetching: isFetchingPosts} = useFetch(getUserPosts, user?._id);
    const {data: userWorkouts = [], isFetching: isFetchingWorkouts} = useFetch(getUserWorkouts);

    const showPostLoading = useLoadingWithDelay(isFetchingPosts);
    const showUserLoading = useLoadingWithDelay(isFetchingPosts || isFetchingWorkouts);

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
            <Grid xs={4} className={styles.profileGridItem}>
                <UserDetails
                    user={user}
                    postCount={usersPosts.length}
                    workoutCount={userWorkouts.length}
                    isLoading={showUserLoading}
                />
                <StyledButton
                    startDecorator={<LogoutRounded />}
                    className={styles.logoutButton}
                    loading={isLoggingOut}
                    onClick={handleLogout}
                >
                    Logout
                </StyledButton>
            </Grid>
            <Grid xs={8} className={styles.gridItem}>
                <Typography level="h2">Your Posts</Typography>
                <PostList
                    posts={usersPosts}
                    showLoading={showPostLoading}
                    onEditClick={() => {
                    }}
                    onDeleteClick={() => {
                    }}
                />
            </Grid>
        </Grid>
    );
};

export default Profile;
