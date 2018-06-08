const path = require('path');

let userConfig;

try {
  userConfig = require('../config');
} catch (e) {
  throw new Error(`Config dosyası bulunamadı veya okunamadı! Verilen hata şuydu: ${e.message}`);
}

const defaultConfig = {
  "token": "NDU0NTYwNjQwNTM1NzU2ODEw.DfvYlQ.1hlMXhtAar2KkewQDlDu_2DMSTI",
  "mailGuildId" : "453484457354067969",
  "mainGuildId" : "444912588741148682",
  "logChannelId": "454570728667480065",

  "prefix": ".",
  "snippetPrefix": "..",

  "status": "Bana destek için mesaj gönder!",
  "responseMessage": "Thank you for your message! Our mod team will reply to you here as soon as possible.",

  "newThreadCategoryId": "454570688326402049",
  "mentionRole": "here",

  "inboxServerPermission": null,
  "alwaysReply": false,
  "alwaysReplyAnon": false,
  "useNicknames": false,
  "ignoreAccidentalThreads": false,
  "threadTimestamps": false,
  "allowMove": false,
  "typingProxy": false,
  "typingProxyReverse": false,

  "enableGreeting": false,
  "greetingMessage": null,
  "greetingAttachment": null,

  "relaySmallAttachmentsAsAttachments": false,

  "port": 8890,
  "url": null,

  "dbDir": path.join(__dirname, '..', 'db'),
  "knex": null,

  "logDir": path.join(__dirname, '..', 'logs'),
};

const required = ['token', 'mailGuildId', 'mainGuildId', 'logChannelId'];

const finalConfig = Object.assign({}, defaultConfig);

for (const [prop, value] of Object.entries(userConfig)) {
  if (! defaultConfig.hasOwnProperty(prop)) {
    throw new Error(`Invalid option: ${prop}`);
  }

  finalConfig[prop] = value;
}

// Default knex config
if (! finalConfig['knex']) {
  finalConfig['knex'] = {
    client: 'sqlite',
      connection: {
      filename: path.join(finalConfig.dbDir, 'data.sqlite')
    },
    useNullAsDefault: true
  };
}

// Make sure migration settings are always present in knex config
Object.assign(finalConfig['knex'], {
  migrations: {
    directory: path.join(finalConfig.dbDir, 'migrations')
  }
});

// Make sure all of the required config options are present
for (const opt of required) {
  if (! finalConfig[opt]) {
    console.error(`Missing required config.json value: ${opt}`);
    process.exit(1);
  }
}

// Make sure mainGuildId is internally always an array
if (! Array.isArray(finalConfig['mainGuildId'])) {
  finalConfig['mainGuildId'] = [finalConfig['mainGuildId']];
}

module.exports = finalConfig;
