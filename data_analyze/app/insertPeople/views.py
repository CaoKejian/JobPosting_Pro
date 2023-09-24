from . import insertPeople
from flask import request, make_response, jsonify
from app.mongo import mongo
import pandas as pd

@insertPeople.route("/", methods=['POST'])
def insert_people():
  data = request.json

  if data is None or 'url' not in data:
        return jsonify({'error': 'Invalid JSON data'})

  excel_url = data['url']
  df = pd.read_excel(excel_url)
  repeat_data = []
  
  for index, row in df.iterrows():
    stu_id = row['stuId']
    document = {
      'name': row['name'], 
      'stuId': stu_id,  
      'classId': 123123,
      'isRoot': False,
      'isAuth': False
    }
    
    existing_doc = mongo.db.text.find_one({'stuId': stu_id})
    
    if existing_doc:
      repeat_data.append({'stuId': stu_id, 'name': row['name']})
    else:
      result = mongo.db.text.insert_one(document)
  
  
  return jsonify({'repeat': repeat_data, 'data':'success'})