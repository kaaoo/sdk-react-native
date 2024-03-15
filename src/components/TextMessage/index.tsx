import { Image, Linking, Pressable, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { useColors } from '../../hooks/colors';
import styles from './styles';
import { statusTranslate, timestampToDate } from '../../utils/functions';
import { useTheme } from '../../hooks/theme';
import { useTranslations } from '../../hooks/translations';
interface Props {
  text: string;
  isUser: boolean;
  status?: string;
  isNewest?: boolean;
  time?: number;
  error?: boolean;
}

export const TextMessage = ({
  text,
  isUser,
  status,
  isNewest,
  time,
}: Props) => {
  const { colors } = useColors();
  const { theme } = useTheme();
  const { translations } = useTranslations();
  const [showStatus, setShowStatus] = useState(false);

  const detectLinks = useMemo(() => {
    const linkRegex =
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
    const matches = text.match(linkRegex);

    if (!matches) {
      return <Text>{text}</Text>;
    }

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((url, index) => {
      const beforeText = text.substring(lastIndex, text.indexOf(url));
      if (beforeText) {
        elements.push(<Text key={`before-${index}`}>{beforeText}</Text>);
      }

      elements.push(
        <Text
          key={index}
          style={{ color: colors.incomingMessageLinksColor }}
          onPress={() => handleLinkPress(url)}
        >
          {url}
        </Text>
      );

      lastIndex = text.indexOf(url) + url.length;
    });

    if (lastIndex < text.length) {
      elements.push(
        <Text key={`after-${matches.length}`}>{text.substring(lastIndex)}</Text>
      );
    }

    return elements;
  }, [colors.incomingMessageLinksColor, text]);

  const handleLinkPress = async (url: string) => {
    try {
      await Linking.openURL('https://' + url);
    } catch (e) {}
  };

  return (
    <Pressable onPress={() => setShowStatus((prevState) => !prevState)}>
      {showStatus && time && (
        <View style={isUser ? styles.userMessage : styles.incomingMessage}>
          <Text
            style={[
              styles.date,
              {
                color: colors.placeholderTextColor,
              },
            ]}
          >
            {timestampToDate(time)}
          </Text>
        </View>
      )}
      <View
        style={[
          styles.container,
          isUser ? styles.userMessage : styles.incomingMessage,
          {
            borderRadius: theme?.messageRadius || 12,
            backgroundColor: isUser
              ? colors.userMessageBackgroundColor
              : colors.incomingMessageBackgroundColor,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: isUser
                ? colors.userMessagePrimaryTextColor
                : colors.incomingMessagePrimaryTextColor,
            },
          ]}
        >
          {detectLinks}
        </Text>
      </View>
      {isUser && isNewest && status && (
        <View
          style={[
            styles.statusContainer,
            isUser ? styles.userMessage : styles.incomingMessage,
          ]}
        >
          <Image
            source={require('../../assets/Check.png')}
            tintColor={colors.typingAnimationColor}
            style={styles.statusIcon}
          />
          <Text
            style={[
              styles.status,
              {
                color: colors.typingAnimationColor,
              },
            ]}
          >
            {statusTranslate(status, translations)}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
