import {Platform} from 'react-native';
import {primary, secondary} from '../Colors';

export const styleModal = {
  width: '89%',
  backgroundColor: primary(true),
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: 10,
  borderRadius: 5,
  shadowRadius: 5,
  shadowOffset: {width: 1, height: 1},
  shadowOpacity: 0.25,
  shadowColor: secondary(false),
  elevation: 4,
};
