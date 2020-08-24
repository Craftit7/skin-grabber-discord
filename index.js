const { Client, MessageEmbed } = require('discord.js');
const client = new Client();
const { token, } = require("./config.json")
const fs = require('fs');

var download = require('download-file')
const db = require('quick.db')

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

//get prefix
client.on('message', async msg => {
  let fetched = db.fetch(`prefix_${msg.guild.id}`)
  if (fetched === null) prefix = '>>'
  else prefix = fetched;
  //console.log(prefix)
})

//setprefix
client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  
  if(command === 'setprefix') {
    if(!msg.member.hasPermission('MANAGE_MESSAGES')) return msg.channel.send('you dont have manage messages perms')

    db.set(`prefix_${msg.guild.id}`, args.join(' '))
    msg.channel.send('Succesfully changed prefix to `' + args + '`')  
    }
    
});

//set prefix on guildJoin
client.on('guildCreate', guild => {
  db.set(`prefix_${guild.id}`, '>>')
  console.log(`prefix set for guild id: ${guild.id}`)
})

//ping command
client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  
  if(command === 'ping') {
      var ping = Math.round(client.ws.ping);
      msg.channel.send({embed: {
        color: 3447003,
        title: "Pong! :ping_pong:",
        description: "Bot latency is " + ping +'ms',
    }})
    //break;
  }
});
//grab command
client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if(command === 'grab') {
    console.log(args)
    if (args.length < 3) return msg.channel.send('Minimum character limit is 3')
    if (args.length > 14) return msg.channel.send('Maximum character limit is 14')

    var url = "https://minotar.net/body/" + args
    
    var options = {
        directory: "./images/",
        filename: "skin.png"
    }
    
    download(url, options, function(err){
        if (err) throw err
        console.log("skin download for user: " + args)
        msg.channel.send(`${args}'s skin:`, { files: ["./images/skin.png"] });
    })
    
//---------------------------
  }
})
//download avatar
client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  
  if(command === 'download-skin') {
      if (args.length < 3) return msg.channel.send('Minimum character limit is 3')
      else if (args.length > 14) return msg.channel.send('Maximum character limit is 14')
    let downloadembed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Click here to download skin of: ${args}`)
      .setURL('https://minotar.net/download/' + args)
      .setAuthor('Skin Grabber')
      .setThumbnail('https://minotar.net/helm/' + args)
    
    msg.channel.send(downloadembed)
  }
});
//invite command
client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if(command === 'invite') {
    let invembed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`Invite Skin Grabber`)
      .setURL('https://discord.com/oauth2/authorize?client_id=734476629954265108&scope=bot&permissions=117768' + args)
      //.setAuthor('Skin Grabber')
    msg.channel.send(invembed)
  }
})
//help command
client.on('message', msg => {
  if (!msg.content.startsWith(prefix) || msg.author.bot) return;

  const args = msg.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  let inline = true

  if (command === `help`) {

      let helpembed = new MessageEmbed()
      helpembed.setColor("#00ff00")
      helpembed.setTitle("Help!")
      helpembed.addField(`${prefix}invite`, 'Invite Skin Grabber to your server!')
      helpembed.addField('Skin commands', '-----------------------------')
      helpembed.addField(`${prefix}grab <username>`, "Grab the skin of the provided user")
      helpembed.addField(`${prefix}download-skin <username>`, 'Get a download link to the user\'s skin\n-----------------------------')

      
      helpembed.addField('Moderator commands', '-----------------------------')
      helpembed.addField(`${prefix}setprefix <new prefix>`, 'Set a new prefix for the server\n-----------------------------')
      helpembed.setFooter('Developed by Her0ic#3762.\nAPI: Minotar api')

      msg.author.send(helpembed)
      msg.react('✅')
      msg.channel.send('Check yo dm\'s!')
      
  }
});
client.login(token);
