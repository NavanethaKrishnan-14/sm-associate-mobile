import React from 'react';
import { Image, View } from 'react-native';

const logo = 'https://raw.githubusercontent.com/NavanethaKrishnan-14/sm-associate-web/main/public/assets/sm-associate-logo.png';

export default function Logo({ width = 154 }) {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={{ uri: logo }}
        style={{
          width,
          height: width * 0.27,
          resizeMode: 'contain',
        }}
        onError={(event) => {
          console.warn('SM Associate logo failed to load:', event.nativeEvent.error);
        }}
      />
    </View>
  );
}
