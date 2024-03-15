import {
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  type ViewStyle,
} from 'react-native';
import type { ImageTemplatePayload } from '../../types/queries';
import React, { memo, useEffect, useMemo, useState } from 'react';
import { useColors } from '../../hooks/colors';
import ActionButtonList from '../AcitonButtonList';
import styles from './styles';
import { useTheme } from '../../hooks/theme';

interface Props {
  payload: ImageTemplatePayload;
  onSend: (clearInput: boolean, messageText?: string) => Promise<void>;
  isUser: boolean;
  style?: ViewStyle;
}
const screenWidth = Dimensions.get('screen').width;

const ImageTemplateMessage = ({ payload, isUser, style, onSend }: Props) => {
  const { colors } = useColors();
  const { theme } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [shouldCenter, setShouldCenter] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const showButtons = payload.buttons.length > 0;

  const getWindowWidth = useMemo(() => {
    let windowWidth = 0;
    if (style?.width) {
      if (typeof style.width === 'string') {
        windowWidth = (parseFloat(style.width) / 100) * screenWidth;
      } else {
        windowWidth = screenWidth;
      }
    } else {
      windowWidth = Dimensions.get('window').width;
    }
    return windowWidth;
  }, [style]);

  useEffect(() => {
    let width = getWindowWidth - Math.round(getWindowWidth * 0.23 + 20);
    setImgWidth(width);
    if (payload.dimensions?.height && payload.dimensions?.width) {
      const imgRatio = payload.dimensions.height / payload.dimensions.width;
      let height = width * imgRatio;
      if (height > width) {
        height = width;
        width = height / imgRatio;
        setImgWidth(width);
        setImgHeight(height);
        setIsReady(true);
      } else {
        setImgHeight(height);
        setIsReady(true);
      }
    } else {
      Image.getSize(
        payload.url,
        (w, h) => {
          const imgRatio = h / w;
          let height = width * imgRatio;
          if (height > width) {
            height = width;
            width = height / imgRatio;
            setImgWidth(width);
            setImgHeight(height);
            setIsReady(true);
          } else {
            setImgHeight(height);
            setIsReady(true);
          }
        },
        () => {
          setImgHeight(300);
          setIsReady(true);
          setShouldCenter(true);
        }
      );
    }
  }, [getWindowWidth, payload]);

  return isReady ? (
    <View
      style={[
        isUser ? styles.userMessageContainer : styles.incomingMessageContainer,
        {
          backgroundColor: isUser
            ? colors.userMessageBackgroundColor
            : colors.incomingMessageBackgroundColor,
          width: imgWidth,
          borderRadius: theme?.messageRadius || 12,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => {
          setFullScreen(true);
        }}
      >
        <Image
          source={{ uri: payload.url, cache: 'force-cache' }}
          resizeMode={shouldCenter ? 'center' : 'cover'}
          style={[
            showButtons
              ? {
                  borderTopLeftRadius: theme?.messageRadius || 12,
                  borderTopRightRadius: theme?.messageRadius || 12,
                }
              : { borderRadius: theme?.messageRadius || 12 },
            {
              borderRadius: theme?.messageRadius || 12,
              width: imgWidth,
              height: imgHeight,
            },
          ]}
        />
        {showButtons && (
          <ActionButtonList buttons={payload.buttons} onSend={onSend} />
        )}
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={fullScreen}
        onRequestClose={() => setFullScreen(false)}
      >
        <SafeAreaView style={styles.fullscreenContainer}>
          <TouchableWithoutFeedback onPress={() => setFullScreen(false)}>
            <Image
              source={{ uri: payload.url, cache: 'force-cache' }}
              resizeMode={'contain'}
              style={styles.fullscreenImage}
            />
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </Modal>
    </View>
  ) : null;
};

export default memo(ImageTemplateMessage);
