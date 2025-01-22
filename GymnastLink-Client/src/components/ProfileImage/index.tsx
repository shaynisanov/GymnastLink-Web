import {Avatar, AvatarProps, styled} from '@mui/joy';

interface Props extends AvatarProps {
  userName: string;
  image?: string;
}

const UserAvatar = styled(({userName, image, ...props}: Props) => <Avatar alt={userName} src={image} {...props} />)({
  width: 45,
  height: 45,
  '&.MuiAvatar-sizeLg': {
    width: 245,
    height: 245,
    fontSize: 100,
  },
});

export {UserAvatar};
