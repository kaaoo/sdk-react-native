import { TextMessage } from '../TextMessage';
import React, { memo } from 'react';
import type {
  ButtonPayload,
  QuickButtonsTemplatePayload,
} from '../../types/queries';

interface Props {
  prevItemPayload: QuickButtonsTemplatePayload;
  buttonPayload: ButtonPayload;
  isUser: boolean;
  status?: string;
  isNewest?: boolean;
  time?: number;
  error?: boolean;
}

const ButtonMessage = ({
  prevItemPayload,
  buttonPayload,
  isUser,
  status,
  isNewest,
  time,
}: Props) => {
  const caption = prevItemPayload.buttons?.find(
    (quickButton) => quickButton.buttonId === buttonPayload.buttonId
  )?.caption;

  return caption ? (
    <TextMessage
      text={caption}
      isUser={isUser}
      status={status}
      isNewest={isNewest}
      time={time}
    />
  ) : null;
};

export default memo(ButtonMessage);
