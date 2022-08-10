import * as https from "https";
import { MailMessage, RequestResponse } from "./interfaces";

export default class client {
  public static performRequest(
    hostname: string,
    key: string,
    data: MailMessage
  ): Promise<RequestResponse> {
    return new Promise((resolve, reject) => {
      let options = {
        method: "POST",
        hostname: hostname,
        path: "/api/v1/send/message",
        headers: {
          "X-Server-API-Key": key,
          "Content-Type": "application/json",
        },
        maxRedirects: 2,
      };

      var req = https.request(options, function (res) {
        let chunks: Array<any> = [];

        res.on("data", (chunk: any) => {
          chunks.push(chunk);
        });

        res.on("end", (chunk: any) => {
          var body = Buffer.concat(chunks);
          resolve(JSON.parse(body.toString()));
        });

        res.on("error", (error) => {
          reject(error);
        });
      });

      req.write(JSON.stringify(data));

      req.end();
    });
  }
}
