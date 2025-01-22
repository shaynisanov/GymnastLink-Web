import {PropsWithChildren, memo} from 'react';
import {styled} from '@mui/joy';
import {glassEffect} from '@styles/commonStyles';

const CardStyle = styled('div')({
  ...glassEffect,
  padding: 16,
  borderRadius: 16,
});

const ContentCard = memo<PropsWithChildren>(({children}) => <CardStyle>{children}</CardStyle>);

export {ContentCard};
