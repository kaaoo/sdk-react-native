import React, { memo } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import type {
  QuickButton,
  QuickButtonsTemplatePayload,
} from '../../types/queries';
import { TextMessage } from '../TextMessage';
import styles from './styles';
import { useColors } from '../../hooks/colors';
import { useTheme } from '../../hooks/theme';
interface Props {
  payload: QuickButtonsTemplatePayload;
  scrollToLatest: () => void;
  isNewest: boolean;
  time: number;
  onSend: (
    clearInput: boolean,
    messageText?: string,
    buttonId?: string
  ) => Promise<void>;
}

const QuickButtonsTemplateMessage = ({
  payload,
  scrollToLatest,
  isNewest,
  time,
  onSend,
}: Props) => {
  const { colors } = useColors();
  const { theme } = useTheme();

  const onPressButton = async (btn: QuickButton) => {
    try {
      await onSend(false, btn.caption, btn.buttonId);
      scrollToLatest();
    } catch (e) {}
  };
  return (
    <View style={styles.container}>
      <TextMessage time={time} text={payload.message} isUser={false} />
      {isNewest && (
        <ScrollView
          horizontal={true}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {payload.buttons.map((btn) => (
            <TouchableOpacity
              key={btn.buttonId}
              style={[
                styles.button,
                {
                  backgroundColor: colors.quickButtonBackgroundColor,
                  borderRadius: theme?.quickButtonRadius || 12,
                  borderWidth: theme.quickButtonBorderWidth,
                  borderColor: theme.quickButtonBorderColor,
                },
              ]}
              onPress={() => onPressButton(btn)}
            >
              <Text
                style={[styles.text, { color: colors.quickButtonTextColor }]}
              >
                {btn.caption}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default memo(QuickButtonsTemplateMessage);
