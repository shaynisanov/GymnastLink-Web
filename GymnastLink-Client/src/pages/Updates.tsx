import {FC, useCallback, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {Grid, Typography} from '@mui/joy';
import {PostForm} from '@components/PostForm';
import {PostDetailsForm} from '@components/PostForm/form';
import {PostList} from '@components/PostList';
import {Popup} from '@components/common/Popup';
import {Post} from '@customTypes/Post';
import {useUserContext} from '@contexts/UserContext';
import {useFetch} from '@hooks/useFetch';
import {useLoadingWithDelay} from '@hooks/useLoadingWithDelay';
import {saveNewFile} from '@services/filesApi';
import {createNewPost, deletePost, getAllPosts, updatePost} from '@services/postsApi';
import {deleteCommentsByPostId} from '@services/commentsApi';
import styles from '@styles/updates.module.scss';

const Updates: FC = () => {
  const {user} = useUserContext();
  const {data: initialPosts = [], isFetching} = useFetch(getAllPosts);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [editedPost, setEditedPost] = useState<Post>();
  const showPostLoading = useLoadingWithDelay(isFetching);

  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  const handleUploadPostImage = async (postDetailsForm: PostDetailsForm) => {
    let imageUrl: string | null = null;

    if (postDetailsForm.image) {
      try {
        const result = await saveNewFile(postDetailsForm.image);
        imageUrl = result.url;
      } catch (e) {
        toast.error("We couldn't upload your image");
      }
    }

    return imageUrl;
  };

  const handleCreatePost = async (postDetailsForm: PostDetailsForm) => {
    if (user) {
      try {
        const imageUrl = await handleUploadPostImage(postDetailsForm);
        const newPost = await createNewPost({
          content: postDetailsForm.content,
          imageUrl,
          userId: user?._id,
          createdTime: new Date().toISOString(),
        });
        setPosts((prevState) => [{...newPost, user}, ...prevState]);
        toast.success('Your new post was added');
      } catch (e) {
        toast.error("We couldn't add your new post");
      }
    }
  };

  const handleEditPost = async (postDetailsForm: PostDetailsForm) => {
    if (user && editedPost) {
      try {
        const imageUrl = await handleUploadPostImage(postDetailsForm);
        const updatedPost = await updatePost(editedPost._id, {
          content: postDetailsForm.content,
          imageUrl,
          userId: user?._id,
          createdTime: new Date().toISOString(),
        });
        setPosts((prevState) => [{...updatedPost, user}, ...prevState.filter(({_id}) => _id !== editedPost._id)]);
        setEditedPost(undefined);
        toast.success('Post was successfully updated');
      } catch (e) {
        toast.error("We couldn't update your post");
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteCommentsByPostId(postId);
      await deletePost(postId);
      setPosts((prevState) => prevState.filter(({_id}) => _id !== postId));
      toast.success('Post was successfully deleted');
    } catch (e) {
      toast.error("We couldn't delete your post");
    }
  };

  const onEditPostClick = (post: Post) => {
    setEditedPost(post);
  };

  const onCancelEditPost = useCallback(() => {
    setEditedPost(undefined);
  }, [setEditedPost]);

  return (
    <Grid container spacing="32px" className={styles.container}>
      <Grid xs={7} className={styles.gridItem}>
        <Typography level="h2">Whats new</Typography>
        <PostList
          posts={posts}
          showLoading={showPostLoading}
          onEditClick={onEditPostClick}
          onDeleteClick={handleDeletePost}
        />
      </Grid>
      <Grid xs={5} className={styles.gridItem}>
        <Typography level="h2">New Post</Typography>
        <PostForm handleSubmitPost={handleCreatePost} submitText="Share" />
      </Grid>
      <Popup open={!!editedPost} title="Update Post" onCancel={onCancelEditPost}>
        <PostForm handleSubmitPost={handleEditPost} post={editedPost} submitText="Update" />
      </Popup>
    </Grid>
  );
};

export default Updates;
