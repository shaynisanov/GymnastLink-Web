import {Avatar, AvatarProps, styled} from '@mui/joy';

interface Props extends Omit<AvatarProps, 'size'> {
  userName: string;
  image?: string;
  sizeLg?: true;
}

const UserAvatar = styled(({userName, image, sizeLg, ...props}: Props) => (
  <Avatar size={sizeLg ? 'lg' : undefined} alt={userName.toUpperCase()} src={image} {...props} />
))({
  width: 45,
  height: 45,
  '&.MuiAvatar-sizeLg': {
    width: 245,
    height: 245,
    fontSize: 100,
  },
});

export {UserAvatar};
