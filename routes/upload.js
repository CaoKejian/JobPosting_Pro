var express = require('express');
var router = express.Router();
const multer = require("multer")

const qiniu = require('qiniu')
let accessKey = 'MFEjgT54HYsC1eHtUbnQ4QxvfkTW_dd_M8ucpRAu';
let secretKey = '0MRyacfATDghILQcro_wPH4G6GTcof44JXB-W2mH';

let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
let options = {
    scope: 'jiaozuoyela', 
};
let putPolicy = new qiniu.rs.PutPolicy(options);
let uploadToken = putPolicy.uploadToken(mac);
let config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;//华东区
config.useHttpsDomain = true;
config.useCdnDomain = true;
const baseUrl = 'ryjt0vld4.hd-bkt.clouddn.com' //七牛云空间访问的域名

const upload = multer();

router.post('/file', upload.single('file'), function (req, res, next) {
  if (req.file) {
      const { originalname, buffer } = req.file;
      const key = Date.now().toString() + '_' + originalname; // 生成七牛云存储的文件名
      const formUploader = new qiniu.form_up.FormUploader(config);
      const putExtra = new qiniu.form_up.PutExtra();
      // 文件上传
      formUploader.put(uploadToken, key, buffer, putExtra, function (respErr, respBody, respInfo) {
        console.log(respErr, respBody, respInfo);
          if (respErr) {
              console.error('上传失败', respErr);
              res.status(500).json({
                  code: 500,
                  message: '上传失败'
              });
          } else {
              if (respInfo.statusCode == 200) {
                  console.log('上传成功', respBody);
                  // 上传数据库
                  res.json({
                      code: 200,
                      message: '上传成功',
                      fileName: originalname,
                      url: `http://${baseUrl}/${key}`
                  });
              } else {
                  console.error('上传失败', respBody);
                  res.status(500).json({
                      code: 500,
                      message: '上传失败'
                  });
              }
          }
      });
  } else {
      res.status(400).json({
          code: 400,
          message: '未上传文件'
      });
  }
});


module.exports = router;
