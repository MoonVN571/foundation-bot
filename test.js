﻿const Discord = require("discord.js");
const client = new Discord.Client();

const footer = "Revolution 2021";
const color = "0xB0B0B0";

const prefix = "%";

var db = require('quick.db')

const token = require('dotenv').config();

const config = {
  token: process.env.token
};

client.on('ready', () => {
	console.log('Bot is online!');
	client.user.setActivity(prefix + "help for commands!", {type: 'LISTENING'});
});

client.on("message", async message => {
	const cancelexecute = new Discord.MessageEmbed()
			.setDescription(`Bạn không thể dùng được lênh này.`)
			.setTimestamp();
	
	// Bots
	if(message.author.bot) return;
	if(message.author == client.user) return;

	// Prefix
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	
	const args2 = message.content.slice("".length).trim().split(/ +/g);
	const cmd = args2.shift().toLowerCase();

	// role  758298370535587861 792019422264819723 792738140220686356 758327218140610610s
	let star = message.member.roles.cache.find(r => r.id === '758298370535587861');
	let dot = message.member.roles.cache.find(r => r.id === '792019422264819723');
	let commander = message.member.roles.cache.find(r => r.id === '760489374545739787');

	// Team
	let team = message.member.roles.cache.find(r => r.id === '758327218140610610');

	var all = star || dot || commander;

	// morderation channel 793819712924549121
	let moderator = client.channels.cache.get('793819712924549121');
	
	// Auto react infor
	if(message.channel.id === '792631698147377192') {
		const up = client.emojis.cache.find(emoji => emoji.name === "up");
		const down = client.emojis.cache.find(emoji => emoji.name === "down");

		if(all || team) return;

		message.react(up).then(r => {
			message.react(down);
        });
	}

	// Verify react
	if (message.author.id === '425599739837284362') {
		if(message.channel.id === '792631698147377192') return;

		const verify = client.emojis.cache.find(emoji => emoji.name === "verify");
		message.react(verify);
	}

	// On cats command
	if(cmd === "cats" || cmd === ",s") {
		// bot bot2 cat
		let bot = message.channel.id === '782617703445692437';
		let cmdBot = message.channel.id === '756030382595637258';
		let cats = message.channel.id === '756487071148933143';
		let allInOne = bot || cmdBot || cats;
		
		// on this
		const channel1 = client.channels.cache.get('782617703445692437').toString();
		const channel2 = client.channels.cache.get('756030382595637258').toString();
		const channel3 = client.channels.cache.get('756487071148933143').toString();

		// check role
		var valid;
		if(team) {
			valid = `${channel1} , ${channel2} hoặc ${channel3}`;
		} else {
			valid = `${channel2}`;
		}

		var embed = new Discord.MessageEmbed()
							.setColor(color)
							.setTitle('[Bot Message]')
							.setDescription(`Hãy sang ${valid} để cats!.`)
							.setFooter(footer)
							.setTimestamp();
		
		if (all && !allInOne) {
			setTimeout(function(){
				message.delete().catch(err => { })
			}, 60000);
			return;
		}

		if(!all && !allInOne) {
			// send the message to user, because of not allowed role
			message.author.send(embed);

			setTimeout(function(){
				message.delete().catch(err => { })
			}, 60000);
			return;
		}
		
	}

	// must be here to cancel prefix
	if(!message.content.startsWith(prefix)) return;

	// Mention bot
	if(message.mentions.has(client.user, { ignoreDirect: true, ignoreRoles: true, ignoreEveryone: true })) {

		const embed = new Discord.MessageEmbed()
								.setColor(color)
								.setTitle('[Bot Message]')
								.setDescription(`Prefix mặc định của bot là **${prefix}**`)
								.setFooter(footer)
								.setTimestamp();

		message.channel.send(embed).then(message => {
			message.delete({ timeout: 10000 });
		});
	}

	// Purge command
	if(command === "purge") {
		if(!message.guild.member(message.author).hasPermission("MANAGE_CHANNELS"))
				return message.channel.send(cancelexecute).then(msg => {
					msg.delete({ timeout: 10000 });
				});

		const deleteCount = parseInt(args[0], 10);
    
		if(!deleteCount || deleteCount < 2 || deleteCount > 999)
		  return message.reply("bạn cần nhập số tin nhắn cần xoá.").then(msg => {
				msg.delete({ timeout: 10000 });
		  });
    
		message.channel.bulkDelete(deleteCount).catch(error => message.reply(`Couldn't delete messages because of: ${error}`)).then(msg => {
			msg.delete({ timeout: 10000 });
		});

		setTimeout(function() {
			message.delte();
		}, 15000)
	}

	// Warning command
	if(command === 'warn') {
		if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR"))
            return message.channel.send(cancelexecute).then(msg => {
				msg.delete({ timeout: 10000 });
			});

		const usernotfound2 = new Discord.MessageEmbed()
				.setTitle('[Warn Command]')
				.setDescription(`Không tìm thấy user. - ` + '`' + prefix + 'warn [NAME] [REASON]`')
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const noYourSelf = new Discord.MessageEmbed()
				.setTitle("[Warn Command]")
				.setDescription(`Không thể gán cảnh cáo cho bản thân.`)
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const noWarnBot = new Discord.MessageEmbed()
				.setTitle("[Warn Command]")
				.setDescription(`Không thể gán cảnh cáo bot.`)
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const noArgs = new Discord.MessageEmbed()
				.setTitle("[Warn Command]")
				.setDescription(`Bạn cần nhập thông tin. ` + '`' + prefix + 'warn [NAME] [REASON]`')
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const threeWarns = new Discord.MessageEmbed()
				.setTitle("[Warn Command]")
				.setDescription(`${message.mentions.users.first()} đã có 3 cảnh cáo.`)
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const user = message.mentions.members.first();
		
		// with warn no args
		if(!args[0]) {
			return message.channel.send(noArgs).then(msg => {
				message.delete({ timeout: 10000 });
			});
		}

		if(!user) {
			return message.channel.send(usernotfound2).then(msg => {
				msg.delete({ timeout: 10000 });
			})
		}

		// do it
		let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)

		if(warnings === 3) {
			return message.channel.send(threeWarns).then(msg => {
				msg.delete({ timeout: 10000 });
			})
		}

		const reason = args.slice(1).join(" ");
    
		const nonSuccess = new Discord.MessageEmbed()
				.setTitle("[Warn Command]")
				.setDescription(`Bạn phải cung cấp lý do. ` + '`' + prefix  + 'warn [NAME] [REASON]`')
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		if(!reason) {
			return message.channel.send(nonSuccess).then(msg => {
				msg.delete({ timeout: 10000 });
			});
		}

		const warningAUser = new Discord.MessageEmbed()
				.setTitle("[Warn]")
				.setDescription(`Bạn đã bị cảnh cáo với lý do: **${reason}**. Xem tại: ${moderator.toString()}`)
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const success = new Discord.MessageEmbed()
				.setTitle("[Warn Command]")
				.setDescription(`**${message.author.username}** đã cảnh cáo **${message.mentions.users.first().tag}** với lý do: **${reason}**`)
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const successful = new Discord.MessageEmbed()
						.setColor(color)
						.setTitle('[Warn]')
						.setDescription(`Cảnh cáo được thực hiện bởi **${message.author.username}**`)
						.addField(`User bị cảnh cáo`, `${message.mentions.users.first().tag}`)
						.addField(`Lý do`, `${reason}`)
						.setFooter(footer)
						.setTimestamp();
		
		if(warnings === null) {
			db.set(`warnings_${message.guild.id}_${user.id}`, 1)
			user.send(warningAUser);
			
			await message.channel.send(success).then(msg => {
				moderator.send(successful);
				msg.delete({ timeout: 10000 });
			});

			setTimeout(function() {
				message.delete();
			}, 10000);

		} else if(warnings !== null) {
			db.add(`warnings_${message.guild.id}_${user.id}`, 1)
			user.send(warningAUser);

			await message.channel.send(success).then(msg => {
				moderator.send(successful);
				msg.delete({ timeout: 10000 });
			});
		}

		setTimeout(function() {
			message.delete();
		}, 10000);
			
	}
	// check warn
	if(command === "warnings") {
		const user = message.mentions.members.first() || message.author

		let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)
		if(warnings === null) warnings = 0;

		const success = new Discord.MessageEmbed()
							.setTitle('[Warnings Command]')
							.setDescription(`Hiện tại bạn có **${warnings}** cảnh cáo.`)
							.setColor(color)
							.setFooter(footer)
							.setTimestamp();

		message.channel.send(success).then(msg => {
			msg.delete({ timeout: 10000 })
		})

		setTimeout(function() {
			message.delete();
		}, 10000);

	}
	// restart warn
	if(command === "resetwarn") {
		if(!message.guild.member(message.author).hasPermission("ADMINISTRATOR"))
            return message.channel.send(cancelexecute).then(msg => {
				msg.delete({ timeout: 10000 });
			});
		
		const noargs = new Discord.MessageEmbed()
									.setTitle('[Resetwarns Command]')
									.setDescription(`Bạn cần nhập thông tin. - ` + '`' + prefix + 'resetwarn [NAME]`')
									.setColor(color)
									.setFooter(footer)
									.setTimestamp();

		const usernotfound2 = new Discord.MessageEmbed()
									.setTitle('[Resetwarns Command]')
									.setDescription(`Không tìm thấy user. - ` + '`' + prefix + 'resetwarn [NAME]`')
									.setColor(color)
									.setFooter(footer)
									.setTimestamp();

		const cannotreset = new Discord.MessageEmbed()
									.setTitle('[Resetwarns Command]')
									.setDescription(`Không thể tự reset warn của bản thân.`)
									.setColor(color)
									.setFooter(footer)
									.setTimestamp();

		const user = message.mentions.members.first()
		let warnings = db.get(`warnings_${message.guild.id}_${user.id}`)
		
		if(!args[0]) {
			return message.channel.send(noargs)
		}

		if(!user) {
			return message.channel.send(usernotfound2)
		}

		if(message.mentions.users.first().bot) return
		
		if(message.author.id === user.id) {
			return message.channel.send(cannotreset)
		}

		const resetnotif = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('[Resetwarns]')
					.setDescription(`Cảnh cáo của bạn đã được xoá bởi ${message.author.username}`)
					.setFooter(footer)
					.setTimestamp();

		const success = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('[Resetwarns Command]')
					.setDescription(`Bạn đã xoá cảnh cáo của ${message.mentions.users.first()}.`)
					.setFooter(footer)
					.setTimestamp();
		
		const cancel = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('[Resetwarns Command]')
					.setDescription(`User ${message.mentions.users.first()} không có bất kì cảnh cáo nào.`)
					.setFooter(footer)
					.setTimestamp();

		if(warnings === null) {
			return message.channel.send(cancel).then(msg => {
				msg.delete({ timeout: 10000 });
			})
		}

		db.delete(`warnings_${message.guild.id}_${user.id}`)
		user.send(resetnotif)
		await message.channel.send(success)

		setTimeout(function() {
			message.delete();
		}, 10000);
	}

	// off command
	if(command === "off") {
		const user = message.author;
		const say = args.join(" ");

		const noInTeam = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('[Info]')
					.setDescription(`Bạn không thể sự dụng lệnh này khi không có trong team.`)
					.setFooter(footer)
					.setTimestamp();
	
		const noContent = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('[Channel]')
					.setDescription(`Bạn cần lý do để thông báo. - ` + '`' + prefix + 'off [lý do và thời gian]`')
					.setFooter(footer)
					.setTimestamp();
		 
		if(!team && !all) {
			return message.channel.send(noInTeam).then(msg => {
				msg.delete( { timeout: 10000 });
			});
		}

		if (!args[0]) return message.channel.send(noContent).then(msg => {
			msg.delete({ timeout: 10000 });
		});

		// delete first
		const success = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('[Offlines Command]')
					.setDescription(`Bạn đã thông báo thành công.`)
					.setFooter(footer)
					.setTimestamp();

		message.channel.send(success).then(msg => {
			msg.delte({ timeout: 10000 });
		});

		// offline channel
		let channel = client.channels.cache.get("793454375438778369");

		const embed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('[Offlines]')
					.setDescription(`**${message.author.username}**: ${say}`)
					.setFooter(footer)
					.setTimestamp();

		await channel.send(embed);
		
		setTimeout(function() {
			message.delete();
		}, 10000);
	}


	// Ban Command
	if(command === "ban") {
		if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS"))
			return message.channel.send(cancelexecute);

		var reason = args.join(" ").slice(22) || "None";
		const user = message.mentions.users.first();

		setTimeout(function() {
			message.delete();
		}, 10000);

		const usernotfound2 = new Discord.MessageEmbed()
				.setTitle("[Ban Command]")
				.setDescription(`Không tìm thấy user. ` + '`' + prefix  + 'ban [NAME] [REASON]`')
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const noargs = new Discord.MessageEmbed()
				.setTitle("[Ban Command]")
				.setDescription(`Không cần nhập thông tin. ` + '`' + prefix  + 'ban [NAME] [REASON]`')
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		if(!user) return message.channel.send(usernotfound2).then(msg => {
			msg.delete({ timeout: 10000 });
		});

		if(!args[0]) return message.channel.send(noargs).then(msg => {
			msg.delete({ timeout: 10000 });
		});
		
		if(args[1]) {
			const embed = new Discord.MessageEmbed()
						.setColor(color)
						.setTitle('[Ban]')
						.setDescription(`Bạn đã bị cấm khỏi server. Với lý do: **${reason}**`)
						.setFooter(footer)
						.setTimestamp();

			user.send(embed);
				
		}
		const member = message.guild.member(user);

		const embed = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle('[Ban Command]')
				.setDescription(`Đã chặn **${user.tag}** ra khỏi server. Với lý do: **${reason}**`)
				.setFooter(footer)
				.setTimestamp();
				
		if(member) {
			member.ban().then((member) => {
				// do it
				const successful = new Discord.MessageEmbed()
								.setColor(color)
								.setTitle('[Ban]')
								.setDescription(`User đã bị cấm bởi **${message.author.username}**`)
								.addField(`User đã bị cấm`, `${member.user.tag}`)
								.addField(`Lý do`, `${reason}`)
								.setFooter(footer)
								.setTimestamp();
				message.channel.send(embed).then(msg => {
					msg.delete({ timeout: 10000 });
					moderator.send(successful);

					// send author
					message.author.send(`*${member.user.id}*`);
					message.author.send(`ID này sẽ cần dùng bỏ chặn cho **${user.tag}**`);
				})

			}).catch(() => {
				message.channel.send(cancelexecute).then(msg => {
					msg.delete({ timeout: 10000 });
				});
			});

		}
		 
	}

	// unban
	if(command === "unban") {
		if(!message.guild.member(message.author).hasPermission("BAN_MEMBERS"))
			return message.channel.send(cancelexecute);
		const whoBanning = new Discord.MessageEmbed()
						.setColor(color)
						.setTitle('[Unban Command]')
						.setDescription(`Bạn cần kiểm tra DM với bot để lấy ID user hoặc tag#id. ` + '`' + prefix  + 'unban [NAME]`')
						.setFooter(footer)
						.setTimestamp();

		let User = args[0];
		let Reason = `Unbanned by ${message.author.id}`;

		if (!User) return message.channel.send(whoBanning).then(msg => {
			msg.delete({ timeout: 10000 });
		});
		
		const usernotfound = new Discord.MessageEmbed()
				.setTitle("[Unban Command]")
				.setDescription(`Không tìm thấy user. - ` + '`' + prefix  + 'unban [NAME]`')
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const embed = new Discord.MessageEmbed()
				.setColor(color)
				.setTitle('[Ban Command]')
				.setDescription(`Đã bỏ cấm **${User}** thành công!`)
				.setFooter(footer)
				.setTimestamp();
		
		// trying unbaning, add try
		message.guild.fetchBans().then(bans => {
			if (bans.some(u => User.includes(u.username))) {
				let user = bans.find(user => user.username === User);

				message.guild.unban(user.id, Reason);

				message.channel.send(embed).then(msg =>{
					msg.delete({ timeout: 10000 });
				});
			} else if (bans.some(u => User.includes(u.id))) {

				message.guild.unban(User, Reason);

				message.channel.send(embed).then(msg =>{
					msg.delete({ timeout: 10000 });
				});

			}
		});

		setTimeout(function() {
			message.delete();
		}, 10000);
		
	}

	// Kick command
	if(command === "kick") {
		if(!message.guild.member(message.author).hasPermission("KICK_MEMBERS"))
            return message.channel.send(cancelexecute);

		const usernotfound = new Discord.MessageEmbed()
				.setTitle("[Kick Command]")
				.setDescription(`Không tìm thấy user. - ` + '`' + prefix  + 'kick [NAME] [REASON]`')
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const notaguser = new Discord.MessageEmbed()
				.setTitle("[Kick Command]")
				.setDescription(`Bạn cần tag user. - ` + '`' + prefix  + 'kick [NAME] [REASON]`')
				.setColor(color)
				.setFooter(footer)
				.setTimestamp();

		const cannotkick = new Discord.MessageEmbed()
						.setTitle("[Kick Command]")
						.setDescription(`Không thể kick user này.`)
						.setColor(color)
						.setFooter(footer)
						.setTimestamp();

		const user = message.mentions.users.first();

		var reason = args.join(" ").slice(22) || "None";

		if(args[1]) {
			const embed = new Discord.MessageEmbed()
						.setColor(color)
						.setTitle('[Kick]')
						.setDescription(`Bạn đã bị kick khỏi server. Với lý do: **${reason}**`)
						.setFooter(footer)
						.setTimestamp();
			user.send(embed);
				
		}

		if(user){
			const member = message.guild.member(user);

			const embed = new Discord.MessageEmbed()
					.setColor(color)
					.setTitle('[Kick Command]')
					.setDescription(`Đã kick **${user.tag}** ra khỏi server. Với lý do: **${reason}`)
					.setFooter(footer)
					.setTimestamp();

			if(member){
				member.kick().then(() =>{
					// do it
					message.channel.send(embed);
				}).catch(err =>{
					message.channel.send(cannotkick).then(msg => {
					message.delete({ timeout: 10000});
					});
				});
			} else {
				message.channel.send(usernotfound).then(msg => {
					message.delete({ timeout: 10000});
				});
			}
		} else {
			message.channel.send(notaguser).then(msg => {
					message.delete({ timeout: 10000});
			});
		}

		setTimeout(function() {
			message.delete();
		}, 10000);
	}

	// Help command
    if(command === "help") {
		if(all) {
			var embed = new Discord.MessageEmbed()
						.setColor(color)
						.setTitle('Help Command - Moderator only')
						.setDescription(`${prefix}help \n${prefix}kick @mention [lý do] \n${prefix}ban @mention [lí do] \n${prefix}warn @mention [lí do] \n${prefix}off [lí do]`)
						.setFooter(footer)
						.setTimestamp();

			await message.channel.send(embed).then(message => {
				message.delete({ timeout: 30000 });
			});
		} else if (team && !all) {
			var embed = new Discord.MessageEmbed()
						.setColor(color)
						.setTitle('Help Command - Team only')
						.setDescription(`${prefix}help\n ${prefix}off [lí do]`)
						.setFooter(footer)
						.setTimestamp();

			await message.channel.send(embed).then(message => {
				message.delete({ timeout: 30000 });
			});

		} else {
			var embed = new Discord.MessageEmbed()
						.setColor(color)
						.setTitle('Help Command - Able commands')
						.setDescription(`${prefix}help`)
						.setFooter(footer)
						.setTimestamp();

			await message.channel.send(embed).then(message => {
				message.delete({ timeout: 30000 });
			});
		}

	}
	
	setTimeout(function() {
		message.delete();
	}, 10000);
});

client.on("error", (e) => console.error(e));
client.login(config.token);
