from flask import request, make_response, jsonify
from . import teacher
from app.mongo import mongo
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, recall_score, f1_score
import matplotlib.pyplot as plt

# 相似度计算
from gensim.models import Word2Vec
from snownlp import SnowNLP
from gensim import corpora, models
import os
from docx import Document
import numpy as np
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
  # 统计每位学生的没有迟交的提交次数，这里使用 name 字段作为分组依据
  not_late_counts = df[df['is_late'] == False].groupby('name').size()
  # 统计每位学生的迟交次数，同样使用 name 字段作为分组依据
  late_counts = df[df['is_late'] == True].groupby('name').size()

  # 使用 name 字段重新索引计数，填充缺失的计数为0
  all_names = df['name'].unique()
  not_late_counts = not_late_counts.reindex(all_names, fill_value=0)
  late_counts = late_counts.reindex(all_names, fill_value=0)

  # 全班迟交次数占总提交次数的比例
  total_late_ratio = df['is_late'].mean()
  
  result = [
    {
      "lateCounts": [{"name": student_name, "value": count} for student_name, count in late_counts.items()]
    },
    {
      "notlateCounts": [{"name": student_name, "value": count} for student_name, count in not_late_counts.items()]
    },
    {
      "totallateBit": total_late_ratio
    }
  ]
  return jsonify(result)

    #type: classId:number
    #param: classId
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

    #type: stuId:number
    #param: stuId
    #method: 每个同学随着时间逾期次数趋势（时间序列分析）
    #return: [{is_late:1,time:'2023-09-01'}]
@teacher.route("/history/tendency")
def history_tendency():
  stuId = request.args.get('stuId')
  if not stuId:
    return make_response(jsonify(message="stuId are required"), 400)
  data = list(mongo.db.homeworks.find({"stuId":int(stuId)}))
  for item in data:  # Convert ObjectId to str
    item['_id'] = str(item['_id'])
  df = pd.DataFrame(data)
  df.sort_values(by='time', inplace=True)
  
  df['time'] = pd.to_datetime(df['time'], unit='ms').dt.strftime('%Y-%m-%d')
  df['cutTime'] = pd.to_datetime(df['cutTime'], unit='ms').dt.strftime('%Y-%m-%d')
  df['is_late'] = df['time'] > df['cutTime']

  late_counts = df.groupby('time')['is_late'].sum().reset_index()
  late_counts['is_late'] = late_counts['is_late'].astype(int)  
  result = late_counts.to_dict('records')

  return jsonify(result)

  #type: stuId:number
  #param: stuId
  #method: 每个学科的平均分与难度估测
  #return: [{subject:'1',average_score:46}]
@teacher.route("/difficulty")
def difficulty_subject():
  classId = request.args.get('classId')
  if not classId:
    return make_response(jsonify(message="classId are required"), 400)
  data = list(mongo.db.homeworks.find({"classId":int(classId)}))
  df = pd.DataFrame(data)
  
  # 按subject分组，计算每个科目的平均分
  subject_scores = df.groupby('subject')['score'].mean().round(2)
  result = [
    {
      "subject": subject,
      "average_score": score
    } for subject, score in subject_scores.items()
  ]
  return jsonify(result)

  #type: classId:number
  #param: classId
  #method: 按时提交作业和迟交作业的学生的平均分数是否有显著差异
  #return: {intime:83, overtime: 43}
@teacher.route("/regression")
def regression_analysis():
  classId = request.args.get('classId')
  if not classId:
    return make_response(jsonify(message="classId are required"), 400)
  data = list(mongo.db.homeworks.find({"classId":int(classId)}))
  df = pd.DataFrame(data)
  df['late'] = df['cutTime'] < df['time']
  # 提取特征
  X = df[['score', 'late']]
  # 标准化特征
  scaler = StandardScaler()
  X_scaled = scaler.fit_transform(X)
  # 使用K-means聚类算法将数据分为两组
  kmeans = KMeans(n_clusters=2, random_state=0)
  kmeans.fit(X_scaled)
  
  # 将聚类标签添加到原始数据中
  df['cluster'] = kmeans.labels_
  # 计算每个聚类的平均分
  cluster_averages = df.groupby('cluster')['score'].mean().round(2)
  result = {
    "intime": cluster_averages[0],
    "overtime": cluster_averages[1]}
  return jsonify(result)

  #type: classId:number
  #param: classId
  #method: 完成作业分数与提交时间之间的关系
  #return: {maxtime:9, result: [{data:[{allSubmit:0,score:0,time:'0:00'}]}]}
@teacher.route("/submission")
def submission_analysis():
  classId = request.args.get('classId')
  if not classId:
      return make_response(jsonify(message="classId are required"), 400)
  data = list(mongo.db.homeworks.find({"classId": int(classId)}))
  df = pd.DataFrame(data)

  df['time'] = pd.to_datetime(df['time'], unit='ms').dt.hour

  grouped = df.groupby(['name', 'time']).agg({'score': ['count', 'mean']}).reset_index()
  grouped.columns = ['name', 'time', 'allSubmit', 'score']

  all_times = pd.DataFrame({'time': range(24)})
  all_names = pd.DataFrame({'name': df['name'].unique()})
  all_combinations = pd.merge(all_names.assign(key=0), all_times.assign(key=0), on='key').drop('key', axis=1)

  merged = pd.merge(all_combinations, grouped, on=['name', 'time'], how='left')

  merged[['allSubmit', 'score']] = merged[['allSubmit', 'score']].fillna(0)

  df['xtime'] = pd.to_datetime(df['time'], unit='ms').dt.hour
  submission_counts = df.groupby('time').size()
  max_submission_time = submission_counts.idxmax()
  result = []
  for name, group in merged.groupby('name'):
      records = group[['time', 'score', 'allSubmit']].to_dict('records')
      for record in records:
          record['time'] = f"{record['time']}:00"
      result.append({'name': name, 'data': records})

  return jsonify({"maxtime":int(max_submission_time),"result":result})

  #type: stuId:number
  #param: stuId
  #method: 完成预测提交作业比率和预测得分
  #return: {intime:83, overtime: 43}
@teacher.route("/complete")
def complete_analysis():
  stuId = request.args.get('stuId')
  if not stuId:
      return make_response(jsonify(message="stuId are required"), 400)
  data = list(mongo.db.homeworks.find({"stuId": int(stuId)}))
  df = pd.DataFrame(data)
  probability = predict_submission_probability(int(stuId), data)
  score = predict_score(int(stuId), data)
  return {'bit': probability, 'score': score}

  # 学生行为分析和预测引擎
  #method: 计算准确率、召回率、F1分数
  #return: {"accuracy": 0.7,"f1_score": 0.8,"recall": 0.8}
@teacher.route("/train")
def train_model():
  data = list(mongo.db.homeworks.find())
  df = pd.DataFrame(data)

  # 将时间字段转换为datetime对象
  df['time'] = pd.to_datetime(df['time'], unit='ms')
  df['cutTime'] = pd.to_datetime(df['cutTime'], unit='ms')

  # 创建一个新的字段表示是否逾期
  df['is_late'] = (df['time'] > df['cutTime']).astype(int)

  # 创建特征：过去提交作业的次数和逾期的次数
  features = df.groupby('stuId').agg({'is_late': ['count', 'sum']}).reset_index()
  features.columns = ['stuId', 'total_submissions', 'total_late_submissions']

  # 创建标签：下一次作业是否会逾期
  df['next_is_late'] = df.sort_values('time').groupby('stuId')['is_late'].shift(-1)
  
  # 合并特征和标签
  df = pd.merge(features, df[['stuId', 'next_is_late']], on='stuId', how='left')

  # 删除含有NaN值的行
  df = df.dropna()

  # 划分特征和标签
  X = df[['total_submissions', 'total_late_submissions']]
  y = df['next_is_late']

  # 划分训练集和测试集
  X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

  # 训练模型
  model = RandomForestClassifier(random_state=42)
  model.fit(X_train, y_train)

  # 预测测试集
  y_pred = model.predict(X_test)

  # 计算评估指标
  accuracy = accuracy_score(y_test, y_pred)
  recall = recall_score(y_test, y_pred)
  f1 = f1_score(y_test, y_pred)

  return {'accuracy': accuracy, 'recall': recall, 'f1_score': f1}


# 预测函数
def predict_submission_probability(student_id, data):
    student_submissions = [d for d in data if d['stuId'] == student_id]
    if not student_submissions:
        return 0 
    on_time_submissions = sum(1 for d in student_submissions if d['time'] <= d['cutTime'])
    return on_time_submissions / len(student_submissions)

def predict_score(student_id, data):
    student_scores = [d['score'] for d in data if d['stuId'] == student_id]
    if not student_scores:
        return 0.0  
    return sum(student_scores) / len(student_scores)


@teacher.route("/similarity")
def score_similarity():
    # 文件路径示例，请根据实际情况修改
    print("当前工作目录:", os.getcwd())
    file_paths = ["app/teacher/word/test1.docx", "app/teacher/word/test2.docx", "app/teacher/word/test3.docx"]
    
    texts = []  # 用于存储处理后的文本内容
    
    for path in file_paths:
        try:
            # 使用python-docx提取文本内容
            doc = Document(path)
            raw_text = ' '.join([paragraph.text for paragraph in doc.paragraphs])  # 合并所有段落文本
            # 使用snownlp进行分词
            s = SnowNLP(raw_text)
            segmented_text = [word for word in s.words]  # 分词后的文本列表
            texts.append(segmented_text)
        except Exception as e:
            print(f"Error reading {path}: {e}")
            return jsonify({"error": f"Error reading file {path}"}), 500

    # 构建词典
    dictionary = corpora.Dictionary(texts)
    
    # 文档转换为词袋模型
    corpus = [dictionary.doc2bow(text) for text in texts]
    
    # 训练TF-IDF模型以增强对文档重要性的区分（可选步骤）
    tfidf = models.TfidfModel(corpus)
    corpus_tfidf = tfidf[corpus]
    
    # 训练词向量模型（这里使用gensim的Word2Vec）
    model = models.Word2Vec(texts, vector_size=100, window=5, min_count=1, workers=4)
    
    # 计算文档间相似度
    similarities = []
    for i in range(len(texts)):
        for j in range(i+1, len(texts)):
            # 注意：直接计算词对相似度并求平均作为文档相似度的简化方法可能不精确
            # 这里提供一个基于文档向量平均的相似度计算方法作为替代
            vec_i = np.mean([model.wv[word] for word in texts[i] if word in model.wv], axis=0)
            vec_j = np.mean([model.wv[word] for word in texts[j] if word in model.wv], axis=0)
            doc_sim = np.dot(vec_i, vec_j) / (np.linalg.norm(vec_i) * np.linalg.norm(vec_j))
            similarities.append({"doc_pair": (i+1, j+1), "similarity": round(float(doc_sim), 4)})
    return jsonify(similarities)