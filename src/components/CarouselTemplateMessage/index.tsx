import type { CarouselTemplatePayload } from '../../types/queries';
import React, { memo, useMemo, useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  type ViewStyle,
  Dimensions,
} from 'react-native';
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
  const [maxTitleHeight, setMaxTitleHeight] = useState(0);
  const [imageOrientations, setImageOrientations] = useState<{
    [key: string]: 'portrait' | 'landscape';
  }>({});

  const getWidth = useMemo(() => {
    let windowWidth = screenWidth - (screenWidth * 0.23 + 20);
    if (style?.width && typeof style.width === 'string') {
      windowWidth =
        (parseFloat(style.width) / 100) * screenWidth -
        ((parseFloat(style.width) / 100) * screenWidth * 0.23 + 20);
    }
    return windowWidth;
  }, [style]);

  const hasPortraitImage = useMemo(() => {
    return Object.values(imageOrientations).some(
      (orientation) => orientation === 'portrait'
    );
  }, [imageOrientations]);

  useEffect(() => {
    setMaxTitleHeight(0);
    setImageOrientations({});

    payload.elements.forEach((element) => {
      const url = element.imageUrl;
      if (url) {
        Image.getSize(
          url,
          (width, height) => {
            setImageOrientations(
              (prev: Record<string, 'portrait' | 'landscape'>) => ({
                ...prev,
                [url]: height > width ? 'portrait' : 'landscape',
              })
            );
          },
          (error) => {
            console.warn(`Couldn't get image size for ${url}`, error);
          }
        );
      }
    });
  }, [payload]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {payload.elements.map((element, i) => {
        const isPortrait =
          imageOrientations[element.imageUrl || ''] === 'portrait';
        return (
          <View
            key={`${i}-${element?.defaultAction?.value}-${element?.title}}`}
            style={{
              flex: 1,
              justifyContent: 'space-between',
              width: getWidth,
              backgroundColor: colors.incomingMessageBackgroundColor,
              borderRadius: theme?.messageRadius || 12,
            }}
          >
            {!!element.imageUrl && (
              <Image
                source={{ uri: element.imageUrl }}
                resizeMode={isPortrait ? 'contain' : 'cover'}
                style={[
                  styles.image,
                  {
                    borderColor: colors.separatorColor,
                    ...(hasPortraitImage && {
                      height: Dimensions.get('window').height * 0.3,
                    }),
                  },
                ]}
              />
            )}
            <View
              style={[styles.titlesContainer, { minHeight: maxTitleHeight }]}
              onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                setMaxTitleHeight((prev) => Math.max(prev, height));
              }}
            >
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
