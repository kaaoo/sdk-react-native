export interface DetectedLink {
  type: 'macro' | 'url';
  text: string;
  url: string;
  index: number;
  length: number;
}
