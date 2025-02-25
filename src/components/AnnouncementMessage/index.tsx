import { Text, View, Image, Linking, Platform } from 'react-native';
import React, { memo, useMemo } from 'react';
import type { AnnouncementPayload } from '../../types/queries';
import styles from './styles';
import { useColors } from '../../hooks/colors';
import type { DetectedLink } from '../../types/other';
import { isDeepLink } from '../../utils/functions';

interface Props {
  payload: AnnouncementPayload;
  isNewest: boolean;
}

const AnnouncementMessage = ({ payload, isNewest }: Props) => {
  const { colors } = useColors();

  const handleLinkPress = async (url: string) => {
    try {
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
  };

  const detectLinks = useMemo(() => {
    const { text } = payload;
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
          <Text
            style={[
              styles.infoText,
              {
                color: colors.announcementTextColor,
              },
            ]}
            key={`text-${i}`}
          >
            {text.substring(lastIndex, link.index)}
          </Text>
        );
      }
      elements.push(
        <Text
          key={`link-${i}`}
          style={[
            styles.infoText,
            styles.linkText,
            {
              color: colors.announcementTextColor,
            },
          ]}
          onPress={() => handleLinkPress(link.url)}
        >
          {link.text}
        </Text>
      );
      lastIndex = link.index + link.length;
    });

    if (lastIndex < text.length) {
      elements.push(
        <Text
          style={[
            styles.infoText,
            {
              color: colors.announcementTextColor,
            },
          ]}
          key="after-last"
        >
          {text.substring(lastIndex)}
        </Text>
      );
    }

    return <>{elements}</>;
  }, [colors.announcementTextColor, payload]);

  return isNewest || payload.visibility === 'Persistent' ? (
    <View
      style={[
        styles.container,
        {
          borderColor: colors.announcementBorderColor,
          backgroundColor: colors.announcementBackgroundColor,
        },
      ]}
    >
      <Image
        tintColor={colors.announcementTextColor}
        source={require('../../assets/time.png')}
        style={styles.image}
      />
      <Text
        style={[
          styles.infoText,
          {
            color: colors.announcementTextColor,
          },
        ]}
      >
        {detectLinks}
      </Text>
    </View>
  ) : null;
};

export default memo(AnnouncementMessage);
