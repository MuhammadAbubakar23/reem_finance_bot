import { IconType } from "../../enums/icon.enum";

export interface IconItem {
  icon: IconType;
  tooltip: string;
  link: string;
  name?:string;
}
export interface InboxItem extends IconItem {
  channel: string;
  title: string;
  count: number;
}
