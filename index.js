const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.argv.length == 2 ? process.env.token : "";
const moment = require("moment");
require("moment-duration-format");
const adminUserId = 250693463065100298;//이건 일단 나중에 알려드릴게요.

client.on('ready', () => {
  console.log('켰다.');
  client.user.setPresence({ game: { name: '!도움을 쳐보세요.' }, status: 'online' })

  let state_list = [//봇의 상태메세지를 변환하여줍니다.
    '!도움을 쳐보세요.',
    'dm문의 !Apple#7777',
    '샵주소 https://discord.gg/6V5vQKr',
    '2호점 https://discord.gg/v5r7vDW',
    '코로나 증상이 있을땐 국번없이 1339',
    '구매문의 !Apple#7777',
    '중요한거아니면 dm하지 말아주세요',
    '앞메 뒷메 확인시 즉시차단'
  ]
  let state_list_index = 1;
  let change_delay = 5000;

  function changeState() {
    setTimeout(() => {
      client.user.setPresence({ game: { name: state_list[state_list_index] }, status: 'online' })
      state_list_index += 1;
      if(state_list_index >= state_list.length) {
        state_list_index = 0;
      }
      changeState()
    }, change_delay);
  }

  changeState();
});

client.on("messageUpdate", (message) => {
  MessageSave(message, true)
});

client.on('message', (message) => {//자신 이외에 멤버가 봇에 메세지를 남겼을경우 봇이 dm으로 메세지를 전달해줍니다.
  MessageSave(message)
  if(message.author.bot) return;

  if(message.channel.type == '!문의') {
    if(message.author.id == adminUserId) return;
    let embed = new Discord.RichEmbed()
    let img = message.author.avatar ? `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}.webp?size=256` : undefined;
    let user = message.author.username+'#'+message.author.discriminator
    let msg = message.content;
    embed.setColor('#186de6')
    embed.setAuthor(user+'이(가) 메세지를 보냈습니다.', img)
    embed.setFooter(`시리 ❤️`)
    embed.addField('메세지 내용', msg, true);
    embed.setTimestamp()
    client.users.find(x => x.id == adminUserId).send(embed);
  }

  if(message.content == '!주의사항') {
    return message.reply('욕설,앞메,뒷메 확인시 바로 차단');
  }

  if(message.content == '!서버정보') {//!서버정보를 했을때 현재 서버 상태를 표기합니다.
    let embed = new Discord.RichEmbed()
    let img = 'https://cdn.discordapp.com/icons/419671192857739264/6dccc22df4cb0051b50548627f36c09b.webp?size=256';
    var duration = moment.duration(client.uptime).format(" D [일], H [시간], m [분], s [초]");
    embed.setColor('#186de6')
    embed.setAuthor('server info of 시리', img)
    embed.setFooter(`시리 ❤️`)
    embed.addBlankField()
    embed.addField('RAM usage',    `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);
    embed.addField('running time', `${duration}`, true);
    embed.addField('user',         `${client.users.size.toLocaleString()}`, true);
    embed.addField('server',       `${client.guilds.size.toLocaleString()}`, true);
    embed.addField('Discord.js',   `v${Discord.version}`, true);
    embed.addField('Node',         `${process.version}`, true);
    let arr = client.guilds.array();
    let list = '';
    list = `\`\`\`css\n`;
    for(let i=0;i<arr.length;i++) {
      list += `${arr[i].name}\n`
    }
    list += `\`\`\`\n`
    embed.addField('list:',        `${list}`);

    embed.setTimestamp()
    message.channel.send(embed);
  }

  if(message.content == 'embed') {//embed를 했을때 임베드 예제를 표기합니다.
    let img = 'https://cdn.discordapp.com/icons/419671192857739264/6dccc22df4cb0051b50548627f36c09b.webp?size=256';
    let embed = new Discord.RichEmbed()
      .setTitle('타이틀')
      .setURL('http://www.naver.com')
      .setAuthor('나긋해', img, 'http://www.naver.com')
      .setThumbnail(img)
      .addBlankField()
      .addField('Inline field title', 'Some value here')
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here', true)
      .addField('Inline field title', 'Some value here1\nSome value here2\nSome value here3\n')
      .addBlankField()
      .setTimestamp()
      .setFooter('나긋해가 만듬', img)

    message.channel.send(embed)
  } else if(message.content == '!도움') {//!help를 했을때 도움말을 표기합니다.
    let helpImg = 'https://ifh.cc/g/BdqjJC.png';//https://ifh.cc/ ifh는 이미지를 호스팅해서 링크화 시켜주는 사이트입니다.
    let commandList = [
      {name: '!도움', desc: '도와준다'},
      {name: '1호점', desc: 'https://discord.gg/6V5vQKr'},
      {name: '2호점', desc: 'https://discord.gg/v5r7vDW'},
      {name: '!정리', desc: '청소를 해준다/!청소도됨'},
      {name: '!서버정보', desc: '서버정보를 알려준다'},
      {name: '!주의사항', desc: '주의사항을 알려준다'},
      {name: '!초대코드', desc: '샵주소'},
      {name: '!야', desc: '봇이 랜덤 대답'},
      {name: '!뽑기', desc: '숫자 뽑기'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('!도움 of 시리', helpImg)
      .setColor('#186de6')
      .setFooter(`시리❤️`)
      .setTimestamp()
    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  } else if(message.content == '!초대코드2') {//!초대코드2 를 했을때 봇이 들어가 있는 모든 채널의 초대코드를 표기하여 줍니다.
    client.guilds.array().forEach(x => {
      x.channels.find(x => x.type == 'text').createInvite({maxAge: 0})
        .then(invite => {
          message.channel.send(invite.url)
        })
        .catch((err) => {
          if(err.code == 50013) {
            message.channel.send('**'+x.channels.find(x => x.type == 'text').guild.name+'** 채널 권한이 없어 초대코드 발행 실패')
          }
        })
    });
  } else if(message.content == '!초대코드') {//!초대코드 를 했을때 채널에 서버초대코드를 표기합니다.
    if(message.channel.type == 'dm') {
      return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
    }
    message.guild.channels.get(message.channel.id).createInvite(0)
      .then(invite => {
        message.channel.send(invite.url)
      })
      .catch((err) => {
        if(err.code == 50013) {
          message.channel.send('**'+message.guild.channels.get(message.channel.id).guild.name+'** 채널 권한이 없어 초대코드 발행 실패')
        }
      })
  } else if(message.content.startsWith('/dm')) {//!전체공지를 했을때 텍스트 형식으로 서버에 있는 모든 멤버에게 공지를 보냅니다.(임베드)
    if(checkPermission(message)) return
    if(message.member != null) {
      let contents = message.content.slice('/dm'.length);
      let embed = new Discord.RichEmbed()
        .setAuthor('공지')
        .setColor('#186de6')
        .setFooter(`시리 ❤️`)
        .setTimestamp()
  
      embed.addField('공지: ', contents);
  
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(embed)
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  } else if(message.content.startsWith('!dm')) {//!전체공지를 했을때 텍스트 형식으로 서버에 있는 모든 멤버에게 공지를 보냅니다.
    if(checkPermission(message)) return
    if(message.member != null) {
      let contents = message.content.slice('!dm'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<@${message.author.id}> ${contents}`);
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  } else if(message.content.startsWith('!정리')) {//!청소 (1~99) 를 했을때 (1~99)개의 줄(이거 줄이라고 설명되어있는데 정확한 표현은 덩어리입니다)을 지이워줍니다.
    if(message.channel.type == 'dm') {
      return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
    }
    
    if(message.channel.type != 'dm' && checkPermission(message)) return

    var clearLine = message.content.slice('!정리 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) {
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        let _cnt = 0;

        message.channel.fetchMessages().then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
        })
        .catch(console.error)
    }
  } else if(message.content.startsWith('!킥')) {//!강퇴 (유저멘션) 을 했을때 특정 유저를 강퇴시켜줍니다.
    if(message.channel.type == 'dm') {
      return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
    }
    
    if(message.channel.type != 'dm' && checkPermission(message)) return

    console.log(message.mentions);

    let userId = message.mentions.users.first().id;
    let kick_msg = message.author.username+'#'+message.author.discriminator+'이(가) 강퇴시켰습니다.';
    
    message.member.guild.members.find(x => x.id == userId).kick(kick_msg)
  } else if(message.content.startsWith('!밴')) {//!밴 (유저멘션) 을 했을때 특정 유저를 밴해줍니다.
    if(message.channel.type == 'dm') {
      return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
    }
    
    if(message.channel.type != 'dm' && checkPermission(message)) return

    console.log(message.mentions);

    let userId = message.mentions.users.first().id;
    let kick_msg = message.author.username+'#'+message.author.discriminator+'이(가) 강퇴시켰습니다.';

    message.member.guild.members.find(x => x.id == userId).ban(kick_msg)
  } else if(message.content.startsWith('!뽑기')) {
    let min = 1;
    let max = 100;
    let dice_num = parseInt(Math.random() * (max - min) + min);
    return message.reply(`${dice_num}가 나왔습니다.`);
  } else if(message.content.startsWith('!야')) { //!야 쳤을때 왜, 뭐, 뭠마를 봇이 랜덤으로 표기
    let arr = [
      '왜',
      '뭐',
      '뭠마',
    ]
    let min = 0;
    let max = arr.length;
    let index = parseInt(Math.random() * (max - min) + min);
    return message.reply(`${arr[index]}`);//원래는 왜, 뭐, 임마 중 하나가 선택되고 뒤에 '가 나왔습니다.' 가 붙는데 싫으시다면 '가 나왔습니다.'는 지워주셔도 네됩니다.
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}

function MessageSave(message) {
  imgs = []
  if (message.attachments.array().length > 0) {
    message.attachments.array().forEach(x => {
      imgs.push(x.url+'\n')
    });
  }

  username = message.author.username.match(/[\u3131-\uD79D^a-zA-Z^0-9]/ugi)
  channelName = message.channel.type != 'dm' ? message.channel.name : ''
  try {
    username = username.length > 1 ? username.join('') : username
  } catch (error) {}

  try {
    channelName = channelName.length > 1 ? channelName.join('') : channelName
  } catch (error) {}
}

client.login(token);

//message.content 옆이나 message.reply 옆을 건들어주심됩니다 
//message.reply는 사람멘션+정해진코멘트이고 message.channel.send는 그냥 정해진 코멘트입니다 멘션되는거 싫으시면 바꾸셔도되요. 
//필요없는거같다 싶으시면 묶인거만 전체 지워주시면 됩니다.
//딱 보고 수정해도 될거 같다 싶으시면 수정해주세요
//제가 지금 막 바쁜일이 생겨서 나머지는 나중에 해드릴게요 내일까지 수정해오는거 숙제!
//봇은 안켜질거에요 아직 헤로쿠에 호스팅을 안해놓은 상태라 내일까지 숙제해오시면 내일 이시간에 저 불러서 호스팅해달라고 해주세요 [민경서#1428]