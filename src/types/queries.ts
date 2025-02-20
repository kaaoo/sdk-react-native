export type MessagesMutationResponse = {
  messages: Pagination;
};

type UserInput = 'Enabled' | 'Disabled';

export type Status = 'Read' | 'Delivered' | 'Sent';

type Pagination = {
  edges: Edge[];
  prev: number;
  next?: number | null;
};

export type Edge = {
  node: Message;
};

export type Message = {
  id: string;
  author: User;
  time: number;
  sequence: number;
  payload: Payload;
  status: Status;
  userInput: UserInput;
  error?: boolean;
  draft?: boolean;
};

type User = {
  instanceId: string;
  appId: string;
  userId?: string;
  metadata: UserMetadata;
};

type UserMetadata = {
  instanceId: string;
  appId: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
};

export type QuickButtonsTemplatePayload = {
  message: string;
  buttons: QuickButton[];
};

export type QuickButton = {
  caption: string;
  buttonId: string;
};

export type PersistentButtonsTemplatePayload = {
  message: string;
  buttons: ActionButton[];
};

export type CarouselTemplatePayload = {
  elements: CarouselTemplateElement[];
  ratio: Ratio;
};

type CarouselTemplateElement = {
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  defaultAction: DefaultAction;
  buttons: ActionButton[];
};

type Ratio = 'Horizontal' | 'Vertical' | 'Square';

type DefaultAction = DefaultActionUrl | DefaultActionReferral;

type DefaultActionReferral = {
  value: string;
};

type DefaultActionUrl = {
  value: string;
};

export enum PayloadTypes {
  Text = 'Text',
  File = 'File',
  Button = 'Button',
  Referral = 'Referral',
  Location = 'Location',
  UrlButtonTemplate = 'UrlButtonTemplate',
  CallButtonTemplate = 'CallButtonTemplate',
  LocationTemplate = 'LocationTemplate',
  QuickButtonsTemplate = 'QuickButtonsTemplate',
  PersistentButtonsTemplate = 'PersistentButtonsTemplate',
  CarouselTemplate = 'CarouselTemplate',
  ImageTemplate = 'ImageTemplate',
  VideoTemplate = 'VideoTemplate',
  AudioTemplate = 'AudioTemplate',
  Announcement = 'Announcement',
  TypingOn = 'TypingOn',
  TypingOff = 'TypingOff',
}

type Payload =
  | ({ __typename: PayloadTypes.Text } & TextPayload)
  | ({ __typename: PayloadTypes.File } & FilePayload)
  | ({ __typename: PayloadTypes.Button } & ButtonPayload)
  | ({ __typename: PayloadTypes.Referral } & ReferralPayload)
  | ({ __typename: PayloadTypes.Location } & LocationPayload)
  | ({ __typename: PayloadTypes.UrlButtonTemplate } & UrlButtonTemplatePayload)
  | ({
      __typename: PayloadTypes.CallButtonTemplate;
    } & CallButtonTemplatePayload)
  | ({ __typename: PayloadTypes.LocationTemplate } & LocationTemplatePayload)
  | ({
      __typename: PayloadTypes.QuickButtonsTemplate;
    } & QuickButtonsTemplatePayload)
  | ({
      __typename: PayloadTypes.PersistentButtonsTemplate;
    } & PersistentButtonsTemplatePayload)
  | ({ __typename: PayloadTypes.CarouselTemplate } & CarouselTemplatePayload)
  | ({ __typename: PayloadTypes.ImageTemplate } & ImageTemplatePayload)
  | ({ __typename: PayloadTypes.VideoTemplate } & VideoTemplatePayload)
  | ({ __typename: PayloadTypes.AudioTemplate } & AudioTemplatePayload)
  | ({ __typename: PayloadTypes.Announcement } & AnnouncementPayload)
  | ({ __typename: PayloadTypes.TypingOn } & TypingOnPayload)
  | ({ __typename: PayloadTypes.TypingOff } & TypingOffPayload);

export type TextPayload = {
  value: string;
};

export type FilePayload = {
  fileId: string;
  url: string;
  type: FileType;
  dimensions?: Dimensions;
};

export type ButtonPayload = {
  buttonId: string;
};

type ReferralPayload = {
  referralId: string;
};

type LocationPayload = {
  latitude: number;
  longitude: number;
};

export type UrlButtonTemplatePayload = {
  message: string;
  caption: string;
  url: string;
};

export type CallButtonTemplatePayload = {
  message: string;
  caption: string;
  phoneNumber: string;
};

type LocationTemplatePayload = {
  message: string;
};

type Dimensions = {
  width: number;
  height: number;
};

export type FileType =
  | 'JPEG'
  | 'PNG'
  | 'GIF'
  | 'MP4'
  | 'PDF'
  | 'MP3'
  | 'AAC'
  | 'DOC'
  | 'DOCX'
  | 'TXT'
  | 'ZIP'
  | 'RAR'
  | 'ZIP7'
  | 'HTML'
  | 'SPX'
  | 'MOV'
  | 'AVI'
  | 'XLS'
  | 'XLSX'
  | 'CSV';

export type ImageTemplatePayload = {
  url: string;
  buttons: ActionButton[];
  dimensions?: Dimensions;
};

export type VideoTemplatePayload = {
  url: string;
  buttons: ActionButton[];
};

type AudioTemplatePayload = {
  url: string;
  buttons: ActionButton[];
};

export type AnnouncementPayload = {
  text: string;
  visibility: AnnouncementVisibility;
};

export type ActionButton =
  | ({ __typename: 'ActionButtonCall' } & ActionButtonCall)
  | ({ __typename: 'ActionButtonDefault' } & ActionButtonDefault)
  | ({ __typename: 'ActionButtonUrl' } & ActionButtonUrl);

type ActionButtonCall = {
  caption: string;
  phoneNumber: string;
};

type ActionButtonDefault = {
  caption: string;
  buttonId: string;
};

type ActionButtonUrl = {
  caption: string;
  url: string;
};

export type AnnouncementVisibility = 'Persistent' | 'Temporary';

type TypingOnPayload = {
  placeholder: boolean;
};

type TypingOffPayload = {
  placeholder: boolean;
};

interface MessageStatus {
  id: string;
  author: {
    userId: string;
  };
  time: number;
  offset: number;
  status: string;
}

export interface NewStatusSubscriptionData {
  newStatus: MessageStatus;
}

export interface CustomParamInput {
  name: string;
  value: string;
}
