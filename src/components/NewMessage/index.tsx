import {
  Image,
  type NativeSyntheticEvent,
  Platform,
  TextInput,
  type TextInputContentSizeChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import { useColors } from '../../hooks/colors';
import styles from './styles';
import { useMutation } from '@apollo/client';
import { UPDATE_MESSAGE_PREVIEW } from '../../utils/mutations';
import { useUserInfo } from '../../hooks/userInfo';
import { debounce } from '../../utils/functions';
import { useTranslations } from '../../hooks/translations';
import { useTheme } from '../../hooks/theme';

interface Props {
  value: string | undefined;
  onChangeText: (text: string) => void | undefined;
  onSend: () => void;
  scrollToEnd: () => void;
  onSendFileAttachment: () => void;
  onSendImageAttachment: () => void;
  disabled?: boolean;
}

const NewMessage = ({
  onChangeText,
  value,
  onSend,
  scrollToEnd,
  onSendFileAttachment,
  onSendImageAttachment,
  disabled,
}: Props) => {
  const { translations } = useTranslations();
  const { colors } = useColors();
  const { userInfo } = useUserInfo();
  const [updateMessagePreview] = useMutation(UPDATE_MESSAGE_PREVIEW);
  const [inputHeight, setInputHeight] = useState(20);
  const showSendButton = !!(value?.trim() && value.length > 0);
  const inputRef = useRef<TextInput>(null);

  const { theme } = useTheme();

  const sendMessagePreview = async (text: string) => {
    try {
      await updateMessagePreview({
        variables: {
          conversationId: userInfo.conversationId,
          previewText: text.trim(),
        },
        context: {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      });
    } catch (e) {}
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSendPreview = useCallback(debounce(sendMessagePreview, 200), [
    userInfo.token,
  ]);

  const onChangeNewMessage = (text: string) => {
    onChangeText(text);
    debouncedSendPreview(text);
  };

  const onSendNewMessage = async () => {
    onSend();
    debouncedSendPreview('');
  };

  const handleHeightChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => {
    const { contentSize } = event.nativeEvent;
    const maxHeight = (Platform.OS === 'ios' ? 20 : 24) * 4;
    setInputHeight(
      contentSize?.height > maxHeight ? maxHeight : contentSize.height
    );
  };

  return (
    <View
      key={'newMessage'}
      style={[
        styles.container,
        {
          paddingVertical:
            Platform.OS === 'android' ? (inputHeight > 50 ? 6 : 12) : 12,
          borderColor: colors.separatorColor,
          opacity: disabled ? 0.2 : 1,
        },
      ]}
    >
      <View key={'input'} style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          onChangeText={onChangeNewMessage}
          value={value}
          editable={!disabled}
          placeholder={translations.newMessagePlaceHolder}
          placeholderTextColor={colors.placeholderTextColor}
          textAlignVertical={'top'}
          style={{
            fontSize: 15,
            lineHeight: 20,
            color: colors.newMessageTextColor,
            height: Math.max(35, inputHeight),
          }}
          multiline={true}
          onContentSizeChange={handleHeightChange}
          onFocus={() => {
            setTimeout(() => {
              scrollToEnd();
            }, 200);
          }}
        />
      </View>
      {showSendButton ? (
        <View style={styles.sendContainer}>
          <TouchableOpacity
            style={styles.sendButton}
            onPress={onSendNewMessage}
            disabled={!showSendButton}
          >
            <Image
              source={theme?.sendButtonImg || require('../../assets/send.png')}
              style={{
                width: theme?.sendButtonImgWidth || 20,
                height: theme?.sendButtonImgHeight || 20,
              }}
              tintColor={
                theme?.sendButtonImgTintColor || colors.sendTextButtonColor
              }
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View key={'sendAndAttachment'} style={styles.attachmentsContainer}>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={onSendFileAttachment}
          >
            <Image
              source={
                theme?.fileButtonImg || require('../../assets/attachment.png')
              }
              style={{
                width: theme?.fileButtonImgWidth || 18,
                height: theme?.fileButtonImgHeight || 18,
              }}
              tintColor={
                theme?.fileButtonImgTintColor ||
                colors.sendTextButtonDisabledColor
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.attachmentButton}
            onPress={onSendImageAttachment}
          >
            <Image
              source={
                theme?.galleryButtonImg || require('../../assets/photo.png')
              }
              style={{
                width: theme?.galleryButtonImgWidth || 18,
                height: theme?.galleryButtonImgHeight || 18,
              }}
              tintColor={
                theme?.galleryButtonImgTintColor ||
                colors.sendTextButtonDisabledColor
              }
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default NewMessage;
