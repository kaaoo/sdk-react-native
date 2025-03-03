import { Image, Linking, Platform, Pressable, Text, View } from 'react-native';
import React, { useMemo, useState } from 'react';
import { useColors } from '../../hooks/colors';
import styles from './styles';
import {
  isDeepLink,
  statusTranslate,
  timestampToDate,
} from '../../utils/functions';
import { useTheme } from '../../hooks/theme';
import { useTranslations } from '../../hooks/translations';
import type { DetectedLink } from '../../types/other';
import { useOnPressLink } from '../../hooks/onPressLink';
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
  const onPressLink = useOnPressLink();

  const handleLinkPress = React.useCallback(
    async (url: string) => {
      try {
        if (onPressLink) {
          await onPressLink(url);
          return;
        }

        if (Platform.OS === 'ios') {
          if (isDeepLink(url)) {
            await Linking.openURL(url);
          } else {
            if (url.startsWith('http://')) {
              await Linking.openURL(url.replace('http://', 'https://'));
            } else {
              await Linking.openURL(url);
            }
          }
        } else {
          if (url.startsWith('http://')) {
            await Linking.openURL(url.replace('http://', 'https://'));
          } else {
            await Linking.openURL(url);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    [onPressLink]
  );

  const detectLinks = useMemo(() => {
    const linkRegex =
      /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/gim;
    const macroLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;

    let elements: JSX.Element[] = [];
    let detectedLinks: DetectedLink[] = [];
    let lastIndex = 0;

    text.replace(macroLinkRegex, (match, displayText, url, index) => {
      detectedLinks.push({
        type: 'macro',
        text: displayText,
        url,
        index,
        length: match.length,
      });
      return match;
    });

    text.replace(linkRegex, (match, index) => {
      if (
        !detectedLinks.some(
          (link) => link.index <= index && index < link.index + link.length
        )
      ) {
        detectedLinks.push({
          type: 'url',
          text: match,
          url: match.startsWith('http') ? match : `https://${match}`,
          index,
          length: match.length,
        });
      }
      return match;
    });

    detectedLinks.sort((a, b) => a.index - b.index);

    lastIndex = 0;
    detectedLinks.forEach((link, i) => {
      if (lastIndex < link.index) {
        elements.push(
          <Text key={`text-${i}`}>{text.substring(lastIndex, link.index)}</Text>
        );
      }
      elements.push(
        <Text
          key={`link-${i}`}
          style={{ color: colors.incomingMessageLinksColor }}
          onPress={() => handleLinkPress(link.url)}
        >
          {link.text}
        </Text>
      );
      lastIndex = link.index + link.length;
    });

    if (lastIndex < text.length) {
      elements.push(<Text key="after-last">{text.substring(lastIndex)}</Text>);
    }

    return <>{elements}</>;
  }, [colors.incomingMessageLinksColor, handleLinkPress, text]);

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
