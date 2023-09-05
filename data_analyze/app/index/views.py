from app.mongo import mongo
from bson import json_util
from . import index
from flask import jsonify
import pandas as pd

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
    
    return '1'