# Postal for Node

** 
documentation in progress for migration to TypeScript.  
TS version works similar to the original nodeJS version below, just follow the types.  
**  

This library helps you send e-mails through the open source mail delivery
platform, [Postal](https://github.com/BetterCorp/node-postal) in Node.

## Installation

Install the library using [NPM](https://www.npmjs.com/):

```
$ npm install @bettercorp/postal --save
```

## Usage

Sending an email is very simple. Just follow the example below. Before you can
begin, you'll need to login to your installation's web interface and generate
new API credentials.

```typescript
// Include the Postal library
import { SendMessage as PostalClient } from '@bettercorp/postal';

// Create a new Postal client using a server key generated using your
// installation's web interface
const client = new PostalClient('postal.yourdomain.com', 'your-api-key');

// Create a new message
let message = client.to('john@example.com');

// Add some recipients
message.to('mary@example.com');
message.cc('mike@example.com');
message.bcc('secret@awesomeapp.com');

// Specify who the message should be from - this must be from a verified domain
// on your mail server
message.from('test@test.postal.io');

// Set the subject
message.subject('Hi there!');

// Set the content for the e-mail
message.plainBody('Hello world!');
message.htmlBody('<p>Hello world!</p>');

// Add any custom headers
//message.header('X-PHP-Test', 'value');

// Attach any files
message.attach('textmessage.txt', 'text/plain', 'Hello world!');

// Send the message and get the result
await message.send()
```
