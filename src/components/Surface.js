import React from 'react';
import {View} from 'react-native';
import {colors} from '../theme/colors';

export default function Surface({children, style}) {
  return <View style={[{backgroundColor:colors.white,borderRadius:22,borderWidth:1,borderColor:'rgba(197,163,91,0.14)',padding:18},style]}>{children}</View>;
}