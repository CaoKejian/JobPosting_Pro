const nodemailer = require('nodemailer'); //引入模块
let transporter = nodemailer.createTransport({
	//node_modules/nodemailer/lib/well-known/services.json  查看相关的配置，如果使用qq邮箱，就查看qq邮箱的相关配置
	service: 'qq', //类型qq邮箱
	port: 465,
	secure: true,
	auth: {
		user: 'caokejian@foxmail.com',
		pass: 'qjdzmfnxjfgkbcda'
	}
});
function sendMail(mail, code, call) {
	// 发送的配置项
	let mailOptions = {
		from: '"曹珂俭" <caokejian@foxmail.com>', // 发送方
		to: mail, //接收者邮箱，多个邮箱用逗号间隔
		subject: `交作业啦 的验证码为「${code}」`, // 标题
		text: '欢迎使用 交作业啦', // 文本内容
		html: `<p>您正在登录<span style="font-size: 20px; font-weight: bold;display: inline-block;border-bottom: 2px solid #000;">交作业啦</span> 验证码为 
    <div style="height: 42px;line-height: 42px;color: #7596ce;background: #000;text-align: center;">${code}</div>
  请妥善保存，以防泄密</p>`,
	};

	//发送函数
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			call(false)
		} else {
			call(true) //因为是异步 所有需要回调函数通知成功结果
		}
	});

}
function noticeMail(mail, obj, call) {
	// 发送的配置项
	let mailOptions = {
		from: '"曹珂俭" <caokejian@foxmail.com>', // 发送方
		to: mail, //接收者邮箱，多个邮箱用逗号间隔
		subject: `亲爱的${obj.name}同学你好！`, // 标题
		text: '您有一项作业未提交', // 文本内容
		html: `<h3>你的 老师/学委 正在通知你尽快提交作业</h3>
  <div class="box" style="width: 96%;background: #d2daf3;padding:32px 16px;margin: 0 auto;
    display: flex;flex-direction: column;box-sizing: border-box;border-radius: 8px;
  ">
    <span style="margin-bottom: 8px;">该项作业名称为：<span style="color:#446a76">${obj.branch}</span></span>
    <span style="margin-bottom: 8px;">发布者：<span style="color:#446a76">${obj.user}</span></span>
    <span style="margin-bottom: 8px;">作业详情：<span style="color:#446a76">${obj.content}</span></span>
    <span style="margin-bottom: 8px;">截止时间：<span style="color:#446a76">${obj.cutTime}</span></span>
    <span style="margin-bottom: 8px;">本班还有：<span style="color:#446a76">${obj.unSubmit.length}份未交</span></span>
    <span>点击链接前往 <span style="color: #5764f1;"><a href="${obj.url}" target="_blank" style="color: #5764f1;">交作业啦APP</a></span> 进行快捷提交</span>
    <p style="color: #E10505;">>>>如果链接出错，请单独提交<<<</p>
    <span>点击链接前往 <span style="color: #5764f1;"><a href="weixin://" target="_blank" style="color: #5764f1;">微信</a></span> 进行单独提交</span>
  </div>`,
	};

	//发送函数
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			call(false)
		} else {
			call(true) //因为是异步 所有需要回调函数通知成功结果
		}
	});

}
module.exports = {
	sendMail, noticeMail
}

