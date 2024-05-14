# -*- coding: utf-8 -*-
from app import create_app
app = create_app()

if __name__ == '__main__':
    print('\x1b[36m%s\x1b[0m' % 'Python启动成功')
    print('\x1b[36m%s\x1b[0m' % '请访问： http://localhost:3001')
    app.run(host='127.0.0.1', debug=True, port=3001)
