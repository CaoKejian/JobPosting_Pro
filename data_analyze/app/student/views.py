from . import student
from app.mongo import mongo
import pandas as pd
from flask import jsonify, request,  make_response
from datetime import datetime, timedelta
import os
from collections import Counter
from bson import json_util
import json
from sklearn.cluster import KMeans
from collections import Counter
import numpy as np
import os

    #type: name:string, time:string('YY-MM-DD')
    #param: name, time
    #method: 单人周频率分析
    #return: [{ day:1, week:3 }]
@student.route("/week")
def week_frequency():
    date = request.args.get('time')
    name = request.args.get('name')
    if not date or not name:
        return make_response(jsonify(message="date and name are required"), 400)
     # 将查询参数转换为 datetime 对象
    start_date = datetime.strptime(date, '%Y-%m-%d')
    # 计算出开始日期之前的7天的日期
    end_date = start_date - timedelta(days=7)

    # 查询在指定日期范围内的提交
    data = mongo.db.homeworks.find({"name": name, "time": {"$gte": end_date.timestamp()*1000, "$lt": start_date.timestamp()*1000}})
    data_list = []
    for item in data:
        item['_id'] = str(item['_id'])
        data_list.append(item)

    # 如果没有找到任何提交，返回一个表示没有提交的响应
    if not data_list:
        return jsonify([{"day": day, "week": 0} for day in ['周一', '周二', '周三', '周四', '周五', '周六', '周日']])

    # 将查询参数解析为 DataFrame
    df = pd.DataFrame(data_list)

    # 将 'time' 列转换为 datetime 对象
    df['time'] = pd.to_datetime(df['time'], unit='ms')

    # 添加一列来表示一周中的哪一天（1代表周一，7代表周日）
    df['day_of_week'] = df['time'].dt.dayofweek + 1

    # 创建一个字典，将数字映射到对应的星期几
    days = {1: '周一', 2: '周二', 3: '周三', 4: '周四', 5: '周五', 6: '周六', 7: '周日'}

    # 使用这个字典来替换 'day_of_week' 列中的值
    df['day_of_week'] = df['day_of_week'].map(days)

    # 按 'day_of_week' 列进行分组，然后计算每天的提交次数
    daily_frequency = df.groupby('day_of_week')['name'].count()

    # 使用 reindex 方法来确保返回的结果包含所有的天
    daily_frequency = daily_frequency.reindex(days.values(), fill_value=0)

    # 将结果转换为 JSON 并返回
    return jsonify(daily_frequency.reset_index().rename(columns={'day_of_week': 'day', 'name': 'week'}).to_dict(orient='records'))

    #type: name:string
    #param: name
    #method: 平均分和擅长方向分析
    #return: [{ subject:'', average: 100 }]
@student.route('/average')
def average_good():
    name = request.args.get('name')
    homeworks = list(mongo.db.homeworks.find({"name": name}))

    subjects = set(homework['subject'] for homework in homeworks)
    averages = {}

    for subject in subjects:
        scores = [homework['score'] for homework in homeworks if homework['subject'] == subject and homework['score'] > 0]
        averages[subject] = sum(scores) / len(scores) if scores else 0

    data = [{"subject": subject, "average": average} for subject, average in averages.items()]
    return jsonify(data), 200

    #type: classId:number
    #param: classId
    #method: 全班提交习惯
    #return: [{ cluster_centers:[
    #   [ 1,0 ], [0.75,0.25]
    # ], file_types:['docx', 'jpeg'],
    # student_labels:{name1:1,name2:0} }]
@student.route('/habit')
def selef_habit():
    classId = request.args.get('classId')
    homeworks = list(mongo.db.homeworks.find({"classId": int(classId)}))
    if not homeworks:
        return make_response(jsonify(message="班级没有任何提交信息"), 400) 
    # 按照学生的名字进行分组
    students = {}
    for homework in homeworks:
        name = homework['name']
        file_type = os.path.splitext(homework['file']['fileUrl'])[1][1:]
        if name not in students:
            students[name] = []
        students[name].append(file_type)

    # 确定所有可能的文件类型
    all_file_types = sorted(set(file_type for file_types in students.values() for file_type in file_types))

    # 计算每个学生的文件类型的提交频率
    student_vectors = []
    for file_types in students.values():
        type_counts = Counter(file_types)
        total = sum(type_counts.values())
        student_vector = [type_counts.get(file_type, 0) / total for file_type in all_file_types]
        student_vectors.append(student_vector)

    # 使用K-means算法进行聚类分析
    kmeans = KMeans(n_clusters=2, random_state=0).fit(student_vectors)

    # 输出每个学生的聚类标签
    student_labels = {name: int(label) for name, label in zip(students.keys(), kmeans.labels_)}

    # 输出聚类中心
    cluster_centers = kmeans.cluster_centers_.tolist()

    return jsonify({'student_labels': student_labels, 'cluster_centers': cluster_centers, 'file_types': all_file_types})
