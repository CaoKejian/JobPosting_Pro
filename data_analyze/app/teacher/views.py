from flask import request, make_response, jsonify
from . import teacher
from app.mongo import mongo
import pandas as pd

    #type: classId:number
    #param: classId, time
    #method: 个人提交历史监控（分组聚合）
    #return: [{"lateCounts": [{"id": 2001063037,"value": 6},{"id": 2001062028,"value": 1}]},{"notlateCounts": [{"id": 2001063037,"value": 1},{"id": 2001062028,"value": 0}]},{"totallateBit": 0.875}]
@teacher.route("/history")
def history_hand():
  classId = request.args.get('classId')
  if not classId:
    return make_response(jsonify(message="classId are required"), 400)
  data = list(mongo.db.homeworks.find({"classId":int(classId)}))
  df = pd.DataFrame(data)
  
  df['is_late'] = df['time'] > df['cutTime']
  # 统计每位学生的没有迟交的提交次数
  not_late_counts = df[df['is_late'] == False].groupby('stuId').size()
  # 统计每位学生的迟交次数
  late_counts = df[df['is_late'] == True].groupby('stuId').size()
  # 创建一个包含所有学生ID的完整索引
  all_stu_ids = df['stuId'].unique()
  # 使用完整索引重新索引计数，填充缺失的计数为0
  not_late_counts = not_late_counts.reindex(all_stu_ids, fill_value=0)
  late_counts = late_counts.reindex(all_stu_ids, fill_value=0)
  # 全班迟交次数占总提交次数的比例
  total_late_ratio = df['is_late'].mean()
  result = [
    {
      "lateCounts": [{"id": stu_id, "value": count} for stu_id, count in late_counts.items()]
    },
    {
      "notlateCounts": [{"id": stu_id, "value": count} for stu_id, count in not_late_counts.items()]
    },
    {
      "totallateBit": total_late_ratio
    }
  ]
  return jsonify(result)

    #type: classId:number
    #param: classId, time
    #method: 班级、学科提交历史监控(聚类分析)
    #return: [{"subject": [{"name": 'xxx',"bit": 6}]},{"class": [{"id": 123123,"bit": 1}]}]
@teacher.route("/history/subject")
def history_hand_subject():
  classId = request.args.get('classId')
  if not classId:
    return make_response(jsonify(message="classId are required"), 400)
  data = list(mongo.db.homeworks.find({"classId":int(classId)}))
  data2 = list(mongo.db.homeworks.find())
  df = pd.DataFrame(data)
  df2 = pd.DataFrame(data2)
  
  df['is_late'] = df['time'] > df['cutTime']
  df2['is_late'] = df2['time'] > df2['cutTime']
  # 按subject和classId分组，计算每个组的迟交比率
  subject_late_ratios = df.groupby('subject')['is_late'].mean()
  class_late_ratios = df2.groupby('classId')['is_late'].mean()
  result = [
    {
      "subject": [
        {
          "name": subject,
          "bit": ratio
        } for subject, ratio in subject_late_ratios.items()
      ]},
      {
      "class": [
        {
          "id": class_id,
          "bit": ratio
        } for class_id, ratio in class_late_ratios.items()
      ]
    }
  ]
  return jsonify(result)