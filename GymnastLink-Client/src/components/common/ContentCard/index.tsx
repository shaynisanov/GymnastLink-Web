import {PropsWithChildren, memo} from 'react';
import {styled} from '@mui/joy';
import {glassEffect} from '@styles/commonStyles';

const CardStyle = styled('div')({
  ...glassEffect,
  padding: 16,
  borderRadius: 16,
});

interface Props extends PropsWithChildren {
  className?: string;
  onClick?: () => void;
}

const ContentCard = memo<Props>(({className, onClick, children}) =>
  <CardStyle className={className} onClick={onClick}>{children}</CardStyle>);

export {ContentCard};
