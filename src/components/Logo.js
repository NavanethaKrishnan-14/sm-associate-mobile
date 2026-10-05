import React from 'react';
import {Image, View} from 'react-native';

const logo =
  process.env.EXPO_PUBLIC_WEB_LOGO_URL ||
  'https://raw.githubusercontent.com/NavanethaKrishnan-14/sm-associate-web/main/public/assets/sm-associate-logo.png';

export default function Logo({width=154}) {
  return (
    <View style={{justifyContent:'center', alignItems:'center'}}>
      <Image
        source={{uri: logo}}
        style={{
          width,
          height: width * 0.27,
          resizeMode: 'contain'
        }}
      />
    </View>
  );
}