from app.mongo import mongo
from bson import json_util
from . import index
from flask import jsonify
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score

@index.route('/', methods=['GET'])
def index_router():
    data = mongo.db.users.find({'name': '曹珂俭'}, {'_id': False})
    data_list = [item for item in data]
    return jsonify(data_list)

@index.route('/euro', methods=['GET'])
def euro12_data():
    euro12 = pd.read_csv('./app/index/Euro2012_stats.csv')

    num_teams = euro12['Team'].nunique()
    num_columns = euro12.shape[1]
    discipline = euro12[['Team', 'Yellow Cards', 'Red Cards']]
    discipline = discipline.sort_values(['Red Cards', 'Yellow Cards'], ascending = False)
    average_yellow_cards = discipline['Yellow Cards'].mean()
    teams_over_6_goals = euro12[euro12['Goals'] > 6]
    g_teams = euro12[euro12['Team'].str.startswith('G')]
    first_7_columns = euro12.iloc[:, :7]
    all_but_last_3 = euro12.iloc[:, :-3]
    teams = ['England', 'Italy', 'Russia']
    accuracy = euro12.loc[euro12['Team'].isin(teams), ['Team', 'Shooting Accuracy']]

    result = [
        {'num_teams': int(num_teams)},
        {'num_columns': int(num_columns)},
        {'discipline': discipline.to_dict(orient='records')},
        {'average_yellow_cards': average_yellow_cards},
        {'teams_over_6_goals': teams_over_6_goals.to_dict(orient='records')},
        {'g_teams': g_teams.to_dict(orient='records')},
        {'first_7_columns': first_7_columns.to_dict(orient='records')},
        {'all_but_last_3': all_but_last_3.to_dict(orient='records')},
        {'accuracy': accuracy.to_dict(orient='records')}
    ]
    return jsonify(result)

@index.route('/titanic', methods=['GET'])
def titanic_data():
    df = pd.read_csv('./app/index/titanic.csv')
    # 生存率和性别之间的关系是什么？
    # 生存率和年龄之间的关系是什么？
    # 生存率和船票等级之间的关系是什么？
    # 生存率和性别的关系
    sex_survival = (df.groupby('sex')['survived'].mean().round(4) * 100).apply(lambda x: f"{x}%").to_dict()
    # 年龄分成几个区间
    df['AgeGroup'] = pd.cut(df['age'], bins=[0, 18, 35, 60, 100], labels=['小孩', '青年', '成年', '年老' ])
    age_survival = df.groupby('AgeGroup')['survived'].mean().round(2).to_dict()
    # 生存率和船票等级的关系
    class_survival = (df.groupby('pclass')['survived'].mean().round(3) * 100).apply(lambda x: f"{x}%").to_dict()
     # 生存率和兄弟姐妹/配偶数量的关系
    sibsp_survival = (df.groupby('sibsp')['survived'].mean().round(4) * 100).apply(lambda x: f"{x}%").to_dict()
    # 生存率和父母/孩子数量的关系
    parch_survival = (df.groupby('parch')['survived'].mean().round(4) * 100).apply(lambda x: f"{x}%").to_dict()
    # 数据模型
    df.dropna(inplace=True)
    X = df.drop('survived', axis=1)
    y = df['survived']
    # 数据预处理
    scaler = StandardScaler()
    X = pd.get_dummies(X)  # one-hot 编码
    X = scaler.fit_transform(X)  # 标准化
    # 划分数据集
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    # 选择模型
    model = LogisticRegression()
    # 训练模型
    model.fit(X_train, y_train)
    # 预测
    y_pred = model.predict(X_test)
    # 评估模型
    print("Accuracy:", accuracy_score(y_test, y_pred))
    result = {
        '性别和生存率': sex_survival,
        '年龄和生存率': age_survival,
        '票级和生存率': class_survival,
        '兄弟姐妹/配偶数量和生存率': sibsp_survival,
        '父母/孩子数量和生存率': parch_survival,
        '预测(错误)': accuracy_score(y_test, y_pred)
    }

    return jsonify(result)