import React, { memo } from 'react';
import type { PersistentButtonsTemplatePayload } from '../../types/queries';
import { Text, View } from 'react-native';
import ActionButtonList from '../AcitonButtonList';
import { useColors } from '../../hooks/colors';
import styles from './styles';

interface Props {
  payload: PersistentButtonsTemplatePayload;
  onSend: (clearInput: boolean, messageText?: string) => Promise<void>;
}
const PersistentButtonsTemplateMessage = ({ payload, onSend }: Props) => {
  const { colors } = useColors();
  return (
    <View
      style={[
        { backgroundColor: colors.incomingMessageBackgroundColor },
        styles.container,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: colors.incomingMessagePrimaryTextColor,
          },
        ]}
      >
        {payload.message}
      </Text>
      <ActionButtonList buttons={payload.buttons} onSend={onSend} />
    </View>
  );
};

export default memo(PersistentButtonsTemplateMessage);
