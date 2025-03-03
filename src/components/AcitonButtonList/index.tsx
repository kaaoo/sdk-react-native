import { Linking, Text, TouchableOpacity, View } from 'react-native';
import React, { memo } from 'react';
import type { ActionButton } from '../../types/queries';
import { useColors } from '../../hooks/colors';
import styles from './styles';
import { useOnPressLink } from '../../hooks/onPressLink';
interface Props {
  buttons: ActionButton[];
  onSend: (clearInput: boolean, messageText?: string) => Promise<void>;
}

const ActionButtonList = ({ buttons, onSend }: Props) => {
  const { colors } = useColors();
  const onPressLink = useOnPressLink();

  const sendButtonMutation = async (buttonMessage: string) => {
    try {
      await onSend(false, buttonMessage);
    } catch (err) {}
  };

  const onPress = async (button: ActionButton) => {
    try {
      switch (button.__typename) {
        case 'ActionButtonDefault':
          return await sendButtonMutation(button.caption);
        case 'ActionButtonUrl':
          if (onPressLink) {
            return await onPressLink(button.url);
          } else {
            return await Linking.openURL(button.url);
          }
        case 'ActionButtonCall': {
          return await Linking.openURL('tel:' + button.phoneNumber);
        }
        default:
          return () => {};
      }
    } catch (e) {}
  };

  return (
    <View style={styles.container}>
      {buttons.map((button) => (
        <TouchableOpacity
          key={button.caption}
          style={[
            styles.button,
            { backgroundColor: colors.actionButtonBackgroundColor },
          ]}
          onPress={() => onPress(button)}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: colors.actionButtonTextColor,
              },
            ]}
          >
            {button.caption}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default memo(ActionButtonList);
