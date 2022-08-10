import { Tools } from "@bettercorp/tools/lib/Tools";
import client from "./client";
import {
  MailAttachment,
  MailMessage,
  MailResult,
  MailResultMessage,
  PostalServerBasics,
  RequestResponseError,
  RequestResponseStatus,
  RequestResponseSuccess,
} from "./interfaces";

export default class SendMessage implements PostalServerBasics {
  private _server: string = "localhost";
  private _key: string = "localhost";
  public get server(): string {
    return this._server;
  }
  public get key(): string {
    return this._key;
  }

  constructor(server: string, key: string) {
    if (!/^[0-9A-Za-z\-_.]{1,}$/g.test(server))
      throw `Invalid server hostname: eg: mail.example.com`;
    this._server = server;
    this._key = key;
  }

  to(address: string): SendMessageRequest;
  to(addresses: Array<string>): SendMessageRequest;
  to(...addresses: Array<string>): SendMessageRequest;
  to(addresses: Array<string> | string): SendMessageRequest {
    return new SendMessageRequest(this).to(...addresses);
  }

  cc(address: string): SendMessageRequest;
  cc(addresses: Array<string>): SendMessageRequest;
  cc(...addresses: Array<string>): SendMessageRequest;
  cc(addresses: Array<string> | string): SendMessageRequest {
    return new SendMessageRequest(this).cc(...addresses);
  }

  bcc(address: string): SendMessageRequest;
  bcc(addresses: Array<string>): SendMessageRequest;
  bcc(...addresses: Array<string>): SendMessageRequest;
  bcc(addresses: Array<string> | string): SendMessageRequest {
    return new SendMessageRequest(this).bcc(...addresses);
  }

  from(address: string): SendMessageRequest {
    return new SendMessageRequest(this).from(address);
  }

  sender(address: string): SendMessageRequest {
    return new SendMessageRequest(this).sender(address);
  }

  subject(message: string): SendMessageRequest {
    return new SendMessageRequest(this).subject(message);
  }

  tag(message: string): SendMessageRequest {
    return new SendMessageRequest(this).tag(message);
  }

  replyTo(address: string): SendMessageRequest {
    return new SendMessageRequest(this).replyTo(address);
  }

  plainBody(body: string): SendMessageRequest {
    return new SendMessageRequest(this).plainBody(body);
  }

  htmlBody(body: string): SendMessageRequest {
    return new SendMessageRequest(this).htmlBody(body);
  }

  attachment(
    filename: string,
    contentType: string,
    dataBase64: string
  ): SendMessageRequest {
    return new SendMessageRequest(this).attachment(
      filename,
      contentType,
      dataBase64
    );
  }
}

export class SendMessageRequest implements PostalServerBasics {
  private closed: boolean = false;
  private _to: Array<string> = [];
  private _cc: Array<string> = [];
  private _bcc: Array<string> = [];
  private _attachments: Array<MailAttachment> = [];
  private _replyTo?: string = undefined;
  private _from?: string = undefined;
  private _sender?: string = undefined;
  private _tag?: string = undefined;
  private _plainBody?: string = undefined;
  private _htmlBody?: string = undefined;
  private _subject?: string = undefined;

  private server: SendMessage;
  constructor(server: SendMessage) {
    this.server = server;
  }

  public async send(): Promise<MailResult> {
    let response = await client.performRequest(
      this.server.server,
      this.server.key,
      this.message
    );
    if (response.status !== RequestResponseStatus.success) {
      let responseData = response.data as RequestResponseError;
      throw `[${responseData.code}] ${responseData.message}`;
    }
    let responseData = response.data as RequestResponseSuccess;
    this.closed = true;
    let messages: Array<MailResultMessage> = [];
    for (let msgAddr of Object.keys(responseData.messages)) {
      messages.push({
        token: responseData.messages[msgAddr].token,
        id: responseData.messages[msgAddr].id,
        address: msgAddr,
      });
    }
    return {
      time: response.time,
      flags: response.flags,
      id: responseData.message_id,
      messages: messages,
    };
  }

  public get message(): MailMessage {
    if (
      Tools.isNullOrUndefined(this._from) &&
      Tools.isNullOrUndefined(this._sender)
    )
      throw "from and sender are not defined. Define those first";
    if (
      Tools.isNullOrUndefined(this._plainBody) &&
      Tools.isNullOrUndefined(this._htmlBody)
    )
      throw "plainBody and htmlBody are not defined. Define those first";
    if (Tools.isNullOrUndefined(this._subject))
      throw "subject is not defined. Define it first";
    return {
      to: this._to,
      cc: this._cc,
      bcc: this._bcc,
      attachments: this._attachments,
      reply_to: this._replyTo,
      from: this._from || this._sender || "sender@in.valid",
      sender: this._sender,
      tag: this._tag,
      plain_body: this._plainBody,
      html_body: this._htmlBody,
      subject: this._subject,
    };
  }

  private getSingleArray(addresses: Array<string> | string): Array<string> {
    let workingArr: Array<string> = [];
    if (Tools.isString(addresses)) {
      workingArr = [addresses as any as string];
    }
    if (Tools.isArray(addresses)) {
      for (let addr in addresses as Array<any>)
        workingArr = workingArr.concat(this.getSingleArray(addr));
    }
    return workingArr;
  }

  to(address: string): SendMessageRequest;
  to(addresses: Array<string>): SendMessageRequest;
  to(...addresses: Array<string>): SendMessageRequest;
  to(addresses: Array<string> | string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.to() to start a new chain.";
    this._to = this._to.concat(this.getSingleArray(addresses));
    return this;
  }

  cc(address: string): SendMessageRequest;
  cc(addresses: Array<string>): SendMessageRequest;
  cc(...addresses: Array<string>): SendMessageRequest;
  cc(addresses: Array<string> | string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.cc() to start a new chain.";
    this._cc = this._cc.concat(this.getSingleArray(addresses));
    return this;
  }

  bcc(address: string): SendMessageRequest;
  bcc(addresses: Array<string>): SendMessageRequest;
  bcc(...addresses: Array<string>): SendMessageRequest;
  bcc(addresses: Array<string> | string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.bcc() to start a new chain.";
    this._bcc = this._bcc.concat(this.getSingleArray(addresses));
    return this;
  }

  from(address: string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.from() to start a new chain.";
    this._from = address;
    return this;
  }

  sender(address: string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.sender() to start a new chain.";
    this._sender = address;
    return this;
  }

  subject(message: string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.subject() to start a new chain.";
    this._subject = message;
    return this;
  }

  tag(message: string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.tag() to start a new chain.";
    this._tag = message;
    return this;
  }

  replyTo(address: string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.replyTo() to start a new chain.";
    this._replyTo = address;
    return this;
  }

  plainBody(body: string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.plainBody() to start a new chain.";
    this._plainBody = body;
    return this;
  }

  htmlBody(body: string): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.htmlBody() to start a new chain.";
    this._htmlBody = body;
    return this;
  }

  attachment(
    filename: string,
    contentType: string,
    dataBase64: string
  ): SendMessageRequest {
    if (this.closed)
      throw "Data has already been sent. use SendMessage.attachment() to start a new chain.";
    this._attachments.push({
      contentType,
      filename,
      base64Data: dataBase64,
    });

    return this;
  }
}
