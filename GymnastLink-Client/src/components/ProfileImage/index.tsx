import {Avatar, AvatarProps, styled} from '@mui/joy';
import {User} from '@customTypes/User';

interface Props extends Omit<AvatarProps, 'size' | 'src'> {
  user: User;
  sizeLg?: true;
}

const UserAvatar = styled(({user, sizeLg, ...props}: Props) => (
  <Avatar
    size={sizeLg ? 'lg' : undefined}
    alt={user.userName.toUpperCase()}
    src={user.profileImage ?? undefined}
    {...props}
  />
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
