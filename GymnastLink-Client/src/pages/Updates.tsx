import {AxiosError} from 'axios';
import {FC, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {Grid, Typography} from '@mui/joy';
import {PostCreationForm} from '@components/PostCreationForm';
import {NewPostForm} from '@components/PostCreationForm/form';
import {PostList} from '@components/PostList';
import {Post} from '@customTypes/Post';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {createNewPost, getAllPosts} from '@services/postsApi';
import styles from '@styles/updates.module.scss';

const Updates: FC = () => {
  const {user} = useUserContext();
  const {data: initialPosts = [], isFetching} = useFetch(getAllPosts);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const showPostLoading = useLoadingWithDelay(isFetching);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleCreateNewPost = async (newPostForm: NewPostForm) => {
    if (user) {
      try {
        const newPost = await createNewPost({
          ...newPostForm,
          userId: user?._id,
          createdTime: new Date().toISOString(),
        });
        setPosts((prevState) => [newPost, ...prevState]);
        toast.success('Your new post was added');
      } catch (e) {
        toast.error(`Error registering user: ${(e as AxiosError)?.response?.data}`);
      }
    }
  };

  return (
    <Grid container spacing="32px" className={styles.container}>
      <Grid xs={7} className={styles.gridItem}>
        <Typography level="h2">Whats new</Typography>
        <PostList posts={posts} showLoading={showPostLoading} />
      </Grid>
      <Grid xs={5} className={styles.gridItem}>
        <Typography level="h2">New Post</Typography>
        <PostCreationForm handleCreateNewPost={handleCreateNewPost} />
      </Grid>
    </Grid>
  );
};

export default Updates;
