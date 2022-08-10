import { IDictionary } from "@bettercorp/tools/lib/Interfaces";
import { SendMessageRequest } from "./index";

export enum RequestResponseStatus {
  success = "success",
  error = "error",
}
export interface RequestResponseError {
  code: string;
  message: string;
}
export interface RequestResponseSuccessMessage {
  id: number;
  token: string;
}
export interface RequestResponseSuccess {
  message_id: string;
  messages: IDictionary<RequestResponseSuccessMessage>;
}
export interface RequestResponse {
  status: RequestResponseStatus;
  time: number;
  flags: any;
  data: RequestResponseError | RequestResponseSuccess;
}

export interface MailMessage {
  to?: Array<string>;
  cc?: Array<string>;
  bcc?: Array<string>;
  from: string;
  sender?: string;
  subject?: string;
  tag?: string;
  reply_to?: string;
  plain_body?: string;
  html_body?: string;
  attachments?: Array<MailAttachment>;
}
export interface MailAttachment {
  contentType: string;
  filename: string;
  base64Data: string;
}

export interface MailResult {
  id: string;
  messages: Array<MailResultMessage>;
  time: number;
  flags: any;
}
export interface MailResultMessage {
  id: number;
  token: string;
  address: string;
}

export interface PostalServerBasics {
  to(address: string): SendMessageRequest;
  to(addresses: Array<string>): SendMessageRequest;
  to(...addresses: Array<string>): SendMessageRequest;
  to(addresses: Array<string> | string): SendMessageRequest;

  cc(address: string): SendMessageRequest;
  cc(addresses: Array<string>): SendMessageRequest;
  cc(...addresses: Array<string>): SendMessageRequest;
  cc(addresses: Array<string> | string): SendMessageRequest;

  bcc(address: string): SendMessageRequest;
  bcc(addresses: Array<string>): SendMessageRequest;
  bcc(...addresses: Array<string>): SendMessageRequest;
  bcc(addresses: Array<string> | string): SendMessageRequest;

  from(address: string): SendMessageRequest;
  sender(address: string): SendMessageRequest;
  subject(message: string): SendMessageRequest;
  tag(message: string): SendMessageRequest;
  replyTo(address: string): SendMessageRequest;
  plainBody(body: string): SendMessageRequest;
  htmlBody(body: string): SendMessageRequest;

  attachment(
    filename: string,
    contentType: string,
    dataBase64: string
  ): SendMessageRequest;
}
