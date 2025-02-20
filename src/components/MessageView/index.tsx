import React, { memo, useCallback } from 'react';
import { type Message, PayloadTypes } from '../../types/queries';
import { TextMessage } from '../TextMessage';
import { useUserInfo } from '../../hooks/userInfo';
import ImageTemplate from '../ImageTemplateMessage';
import { View, type ViewStyle } from 'react-native';
import QuickButtonsTemplateMessage from '../QuickButtonsTemplateMessage';
import UrlButtonTemplateMessage from '../UrlButtonTemplateMessage';
import VideoTemplateMessage from '../VideoTemplateMessage';
import PersistentButtonsTemplateMessage from '../PersistentButtonsTemplateMessage';
import CarouselTemplateMessage from '../CarouselTemplateMessage';
import FileMessage from '../FileMessage';
import CallButtonTemplateMessage from '../CallButtonTemplateMessage';
import { isSameDay } from '../../utils/functions';
import TimeDate from '../TimeDate';
import ErrorMessageInfo from '../ErrorMessageInfo';
import { notAllowedTypesToMessageList } from '../../utils/config';
import AgentName from '../AgentName';
import AnnouncementMessage from '../AnnouncementMessage';
import ButtonMessage from '../ButtonMessage';

interface Props {
  item: Message;
  prevItem?: Message | undefined;
  style?: ViewStyle;
  isNewest: boolean;
  scrollToLatest: () => void;
  prevItemTime: number | undefined;
  prevItemUserId: string | undefined;
  onSend: (clearInput: boolean, messageText?: string) => Promise<void>;
  onPressTryAgain: (errorMessage: Message) => void;
}
const MessageItem = ({
  item,
  style,
  isNewest,
  scrollToLatest,
  prevItemTime,
  prevItemUserId,
  onPressTryAgain,
  onSend,
  prevItem,
}: Props) => {
  const { userInfo } = useUserInfo();
  const isUser = userInfo.userId === item.author.userId || !!item?.error;
  const getMessageComponent = useCallback(() => {
    switch (item.payload.__typename) {
      case PayloadTypes.Text:
        return (
          <TextMessage
            text={item.payload.value}
            isUser={isUser}
            status={item.status}
            isNewest={isNewest}
            time={item.time}
          />
        );
      case PayloadTypes.Button:
        return prevItem &&
          prevItem.payload.__typename === PayloadTypes.QuickButtonsTemplate ? (
          <ButtonMessage
            prevItemPayload={prevItem.payload}
            buttonPayload={item.payload}
            isUser={isUser}
            status={item.status}
            isNewest={isNewest}
            time={item.time}
          />
        ) : null;
      case PayloadTypes.ImageTemplate:
        return (
          <ImageTemplate
            isUser={isUser}
            payload={item.payload}
            style={style}
            onSend={onSend}
          />
        );
      case PayloadTypes.QuickButtonsTemplate:
        return (
          <QuickButtonsTemplateMessage
            payload={item.payload}
            time={item.time}
            scrollToLatest={scrollToLatest}
            isNewest={isNewest}
            onSend={onSend}
          />
        );
      case PayloadTypes.UrlButtonTemplate:
        return (
          <UrlButtonTemplateMessage time={item.time} payload={item.payload} />
        );
      case PayloadTypes.VideoTemplate:
        return (
          <VideoTemplateMessage
            onSend={onSend}
            payload={item.payload}
            isUser={isUser}
            style={style}
          />
        );
      case PayloadTypes.PersistentButtonsTemplate:
        return (
          <PersistentButtonsTemplateMessage
            payload={item.payload}
            onSend={onSend}
          />
        );
      case PayloadTypes.CarouselTemplate:
        return (
          <CarouselTemplateMessage
            payload={item.payload}
            onSend={onSend}
            style={style}
          />
        );
      case PayloadTypes.File:
        return (
          <FileMessage
            payload={item.payload}
            onSend={onSend}
            isUser={isUser}
            draft={item.draft}
          />
        );
      case PayloadTypes.CallButtonTemplate:
        return (
          <CallButtonTemplateMessage time={item.time} payload={item.payload} />
        );

      case PayloadTypes.Announcement:
        return (
          <AnnouncementMessage payload={item.payload} isNewest={isNewest} />
        );
      default:
        return null;
    }
  }, [
    item.payload,
    item.status,
    item.time,
    item.draft,
    isUser,
    isNewest,
    prevItem,
    style,
    onSend,
    scrollToLatest,
  ]);

  const shouldShowAgentName =
    prevItemUserId !== item.author.userId &&
    item.author.userId !== userInfo.userId &&
    !notAllowedTypesToMessageList.includes(item.payload.__typename) &&
    (item.author.metadata?.firstName || item.author.metadata?.lastName);

  return (
    <View>
      {!isSameDay(item.time, prevItemTime) && (
        <TimeDate timestamp={item.time} />
      )}
      {shouldShowAgentName && (
        <AgentName
          firstName={item.author.metadata?.firstName}
          lastName={item.author.metadata?.lastName}
          isUser={isUser}
        />
      )}
      {getMessageComponent()}
      {item.error && (
        <ErrorMessageInfo
          item={item}
          isUser={isUser}
          onPressTryAgain={onPressTryAgain}
        />
      )}
    </View>
  );
};

export default memo(MessageItem);
