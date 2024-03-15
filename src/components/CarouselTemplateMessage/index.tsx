import type { CarouselTemplatePayload } from '../../types/queries';
import React, { memo, useMemo } from 'react';
import { Image, ScrollView, Text, View, type ViewStyle } from 'react-native';
import ActionButtonList from '../AcitonButtonList';
import { useColors } from '../../hooks/colors';
import { screenWidth } from '../../utils/functions';
import styles from './styles';
import { useTheme } from '../../hooks/theme';

interface Props {
  payload: CarouselTemplatePayload;
  onSend: (clearInput: boolean, messageText?: string) => Promise<void>;
  style?: ViewStyle;
}
const CarouselTemplateMessage = ({ payload, style, onSend }: Props) => {
  const { colors } = useColors();
  const { theme } = useTheme();

  const getWidth = useMemo(() => {
    let windowWidth = screenWidth - (screenWidth * 0.23 + 20);
    if (style?.width) {
      if (typeof style.width === 'string') {
        windowWidth = (parseFloat(style.width) / 100) * screenWidth;
        windowWidth = windowWidth - (windowWidth * 0.23 + 20);
      } else {
        // @ts-ignore
        return windowWidth;
      }
    } else {
      return windowWidth;
    }
    return windowWidth;
  }, [style]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {payload.elements.map((element, i) => {
        return (
          <View
            key={`${i}-${element?.defaultAction?.value}-${element?.title}}`}
            style={[
              {
                width: getWidth,
                backgroundColor: colors.incomingMessageBackgroundColor,
                borderRadius: theme?.messageRadius || 12,
              },
            ]}
          >
            {!!element.imageUrl && (
              <Image
                source={{ uri: element.imageUrl || '' }}
                style={[
                  styles.image,
                  {
                    borderColor: colors.separatorColor,
                  },
                ]}
              />
            )}
            <View style={styles.titlesContainer}>
              <Text
                style={[
                  styles.titleText,
                  {
                    color: colors.incomingMessagePrimaryTextColor,
                  },
                ]}
              >
                {element.title}
              </Text>
              <Text
                style={[
                  styles.subtitleText,
                  {
                    color: colors.incomingMessageSecondaryTextColor,
                  },
                ]}
              >
                {element.subtitle}
              </Text>
            </View>
            <ActionButtonList onSend={onSend} buttons={element.buttons} />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default memo(CarouselTemplateMessage);
