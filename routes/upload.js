var express = require('express');
var router = express.Router();
const multer = require("multer");
const COS = require('qcloud-cos');
const iconv = require('iconv-lite');
// 腾讯云 COS 配置
const cos = new COS({
  SecretId: 'AKIDRlurc9TaRFtNcS5YwAHHEGA5s047A7Zz',
  SecretKey: 'ZxEKEwiKm0ymMiV2Upy1sbI0lfbTAe6T',
});

const upload = multer();

/** 
  * @param {file}
  * @method 上传文件
  * @type {file: File}
  */

router.post('/file', upload.single('file'), function (req, res, next) {
  if (req.file) {
    const { originalname, buffer } = req.file;
    const key = iconv.decode(Buffer.from(req.file.originalname, 'binary'), 'utf-8');
    console.log(originalname)
    cos.putObject({
      Bucket: 'jobpost-file-1314966552',
      Region: 'ap-shanghai',
      Key: key,
      Body: buffer,
    }, function (err, data) {
      if (err) {
        console.error('上传失败', err);
        res.status(500).json({
          code: 500,
          message: '上传失败'
        });
      } else {
        console.log('上传成功', data);
        const url = cos.getObjectUrl({
          Bucket: 'jobpost-file-1314966552',
          Region: 'ap-shanghai',
          Key: key,
        });
        console.log(url)
        // 上传数据库
        res.json({
          code: 200,
          message: '上传成功',
          fileName: key,
          url: url.split('?')[0],
        });
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
