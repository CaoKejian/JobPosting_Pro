from app.mongo import mongo
from bson import json_util
from . import index
from flask import jsonify

@index.route('/', methods=['GET'])
def index_router():
    data = mongo.db.users.find({'name': '曹珂俭'}, {'_id': False})
    data_list = [item for item in data]
    return jsonify(data_list)

