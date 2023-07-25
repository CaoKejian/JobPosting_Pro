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

module.exports = {
	sendMail
}

