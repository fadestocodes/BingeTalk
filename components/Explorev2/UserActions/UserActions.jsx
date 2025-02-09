import React from 'react';
import { View } from 'react-native';
import IconFA from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/AntDesign';
import { UserActionsStyleSheet } from './styles';

const UserActions = ({ onReject, onLike }) => {
  const handlePressReject = () => {
    onReject();
  };

  const handlePressHeart = () => {
    onLike();
  };

  const handlePressWeChat = () => {
    // Handle WeChat press here
  };

  return (
    <View style={UserActionsStyleSheet.wrapper}>
      {/* Close Icon */}
      <View
        style={[
          UserActionsStyleSheet.iconWrapper,
          UserActionsStyleSheet.closeWrapper,
        ]}
      >
        <IconFA.Button
          style={UserActionsStyleSheet.closeIcon}
          iconStyle={UserActionsStyleSheet.closeIconContent}
          backgroundColor="transparent"
          name="close"
          onPress={handlePressReject}
        />
      </View>

      {/* Heart Icon */}
      <View
        style={[
          UserActionsStyleSheet.iconWrapper,
          UserActionsStyleSheet.heartWrapper,
        ]}
      >
        <Icon.Button
          style={UserActionsStyleSheet.heartIcon}
          iconStyle={UserActionsStyleSheet.heartIconContent}
          color="black"
          backgroundColor="transparent"
          name="heart"
          onPress={handlePressHeart}
        />
      </View>

      {/* WeChat Icon */}
      <View
        style={[
          UserActionsStyleSheet.iconWrapper,
          UserActionsStyleSheet.chatWrapper,
        ]}
      >
        <Icon.Button
          style={UserActionsStyleSheet.chatIcon}
          iconStyle={UserActionsStyleSheet.chatIconContent}
          color="black"
          backgroundColor="transparent"
          name="wechat"
          onPress={handlePressWeChat}
        />
      </View>
    </View>
  );
};

export default UserActions;
