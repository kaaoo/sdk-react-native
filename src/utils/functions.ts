import {
  type FileType,
  type Message,
  PayloadTypes,
  type Status,
} from '../types/queries';
import { Dimensions } from 'react-native';
import type { Translations } from 'react-native-zowiesdk';
export const isTextMessage = (
  message: Message | { newMessage: Message } | undefined
): boolean => {
  if (message === undefined) {
    return false;
  }
  if ('newMessage' in message) {
    return message.newMessage.payload.__typename === 'Text';
  } else {
    return message.payload.__typename === 'Text';
  }
};

//Merge messages and get uniq and last
export function mergeMessageArrays(
  prevArray: Message[],
  nextArray: Message[]
): Message[] {
  const mergedArr = [...nextArray, ...prevArray];
  let uniqueObjects: Record<string, Message> = {};
  mergedArr.forEach((obj) => {
    const id = obj.id;
    if (!uniqueObjects[id] || obj.time > (uniqueObjects[id]?.time || 0)) {
      uniqueObjects[id] = obj;
    }
  });

  const resultArray = Object.values(uniqueObjects);

  return resultArray.sort((a, b) => b.time - a.time);
}

export const screenWidth = Dimensions.get('screen').width;

export const prepareJpegBase64 = (base64: string) =>
  `data:image/jpeg;base64,${base64}`;

export const timestampToDate = (timestamp: number | undefined): string => {
  if (timestamp === undefined) {
    return '';
  }
  const date = new Date(timestamp);
  const today = new Date();

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return `${hours}:${minutes}`;
  } else {
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
};

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMilliseconds = 300,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    // @ts-ignore
    // eslint-disable-next-line consistent-this
    const context = this;

    const later = function () {
      timeoutId = null;
      if (!immediate) func.apply(context, args);
    };

    const callNow = immediate && !timeoutId;
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(later, waitMilliseconds);

    if (callNow) func.apply(context, args);
  };
}

export function isSameDay(
  timestamp1: number,
  timestamp2: number | undefined
): boolean {
  if (timestamp2 !== undefined) {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  } else {
    return true;
  }
}

export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0,
      // eslint-disable-next-line no-bitwise
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const prepareErrorMessage = (
  text: string,
  userId: string,
  id?: string
): Message => {
  const errorMess = {
    time: Date.now(),
    id: id || generateUUID(),
    payload: {
      __typename: PayloadTypes.Text,
      value: text,
    },
    author: {
      userId: userId,
    },
    error: true,
  };
  return errorMess as Message;
};

export function mimeTypeToFileType(mimeType: string): FileType | undefined {
  switch (mimeType) {
    case 'image/jpeg':
      return 'JPEG';
    case 'image/png':
      return 'PNG';
    case 'image/gif':
      return 'GIF';
    case 'video/mp4':
      return 'MP4';
    case 'application/pdf':
      return 'PDF';
    case 'audio/mpeg':
      return 'MP3';
    case 'audio/aac':
      return 'AAC';
    case 'application/msword':
      return 'DOC';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'DOCX';
    case 'text/plain':
      return 'TXT';
    case 'application/zip':
      return 'ZIP';
    case 'application/x-rar-compressed':
      return 'RAR';
    case 'application/x-7z-compressed':
      return 'ZIP7';
    case 'text/html':
      return 'HTML';
    case 'audio/ogg':
      return 'SPX';
    case 'video/quicktime':
      return 'MOV';
    case 'video/x-msvideo':
      return 'AVI';
    case 'application/vnd.ms-excel':
      return 'XLS';
    case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      return 'XLSX';
    case 'text/csv':
      return 'CSV';
    default:
      return undefined;
  }
}

export const prepareFileDraftMessage = (
  tempId: string,
  url: string,
  type: FileType | string | undefined,
  userId: string
) => {
  const draftMessage = {
    time: Date.now(),
    id: tempId,
    payload: {
      __typename: PayloadTypes.File,
      url,
      type: type,
    },
    author: {
      userId: userId,
    },
    error: false,
    draft: true,
  };
  return draftMessage as Message;
};

/* function for cases when status subscription working faster than
onSend promise resolve and update draft message to real callback from api*/
export const isStatusHigher = (
  currentStatus: Status | null | undefined,
  newStatus: Status
): boolean => {
  const statusHierarchy: Record<Status, number> = {
    Sent: 1,
    Delivered: 2,
    Read: 3,
  };
  if (!currentStatus) return true;

  return statusHierarchy[newStatus] > statusHierarchy[currentStatus];
};

export const statusTranslate = (
  status: string | Status | null,
  translations: Translations
) => {
  switch (status) {
    case 'Sent':
      return translations.sent;
    case 'Delivered':
      return translations.delivered;
    case 'Read':
      return translations.read;
    case null:
      return null;
    default:
      return status;
  }
};

export async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 3000 } = options;

  const abortController = new AbortController();
  const id = setTimeout(() => abortController.abort(), timeout);
  const response = await fetch(url, {
    ...options,
    signal: abortController.signal,
  }).finally(() => clearTimeout(id));

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
