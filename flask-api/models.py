# sentiment.py
from random import random
from flask import Blueprint, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import joblib
import os
import numpy as np
import pandas as pd
from flask_cors import CORS
from flask_jwt_extended import jwt_required

trained_models = Blueprint('trained_models', __name__)

CORS(trained_models)

MODELS_DIR = 'models'
models = {}
for file_name in os.listdir(MODELS_DIR):
    if file_name.endswith('.sav') or file_name.endswith('.pkl'):
        model_name = os.path.splitext(file_name)[0]
        model_path = os.path.join(MODELS_DIR, file_name)
        model = joblib.load(model_path)
        models[model_name] = model
rf_regressor = joblib.load('./models/random_forest_regressor_model.pkl')

@trained_models.route('/models', methods=['GET'])
# @jwt_required()
def list_models():
    return jsonify(list(models.keys()))


@trained_models.route('/predict/sentiment', methods=['POST'])
# @jwt_required()
def predict_sentiment():
    data = request.json
    if data is None:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    analyzer = SentimentIntensityAnalyzer()
    sentiment_scores = analyzer.polarity_scores(data['text'])
    if sentiment_scores['compound'] >= 0.8:
        feedback = 'Outstanding'
    elif sentiment_scores['compound'] >= 0.6:
        feedback = 'Awesome'
    elif sentiment_scores['compound'] >= 0.4:
        feedback = 'Satisfactory'
    elif -0.1 <=sentiment_scores['compound'] <= 0.1:
        feedback = 'Neutral'
    elif sentiment_scores['compound'] <= -0.1:
        feedback = 'Skeptical'
    elif sentiment_scores['compound'] <= -0.4:
        feedback = 'Gloomy'
    elif sentiment_scores['compound'] <= -0.7:
        feedback = 'Angry'
    else:
        feedback = 'Terrible'
    
    return jsonify({
        'feedback': feedback,
        'score': sentiment_scores['compound']
    })

@trained_models.route('/predict/number-of-persons', methods=['POST'])
# @jwt_required()
def predict_number_of_persons():
    data = request.json
    if data is None:
        return jsonify({'error': 'No JSON data provided'}), 400
    
    model = models["number_of_persons"]
    begin_date = data["begin_date"]
    end_date = data["end_date"]
    granularity = data["granularity"]
    if granularity == "day":
        freq = 'D'
    elif granularity =="week":
        freq = 'W'
    else:
        freq = "M"
    future_dates = pd.date_range(start=begin_date, end=end_date,freq=freq)
    future_dates_ordinal = np.array([date.toordinal() for date in future_dates]).reshape(-1, 1)
    future_dates_pred = model.predict(future_dates_ordinal)

    ordinary_dates = [str(date)[:10] for date in future_dates]
    return jsonify({
        "dates" : ordinary_dates,
        "number_of_persons" : [i if i>0 else 0 for i in future_dates_pred.tolist()]
    })


states = {}
def preprocess_datetime(datetime_str):
    datetime_obj = pd.to_datetime(datetime_str)
    return {
        'day_of_week': datetime_obj.dayofweek,
        'hour_of_day': datetime_obj.hour,
        'minute_of_hour': datetime_obj.minute
    }

def predict_people_count(input_datetime):
    input_features = preprocess_datetime(input_datetime)
    input_df = pd.DataFrame([input_features])
    predicted_people_count = rf_regressor.predict(input_df)
    return predicted_people_count[0]

@trained_models.route('/predict/random_forest_regressor_model', methods=['POST'])
# @jwt_required()
def random_forest_regressor_model():
    data = request.json
    if data is None or 'date' not in data:
        return jsonify({'error': 'Invalid JSON data provided'}), 400
    
    date_str = data['date']
    predictions = {}
    current_time = pd.to_datetime(date_str + ' 00:00:00')
    end_time = pd.to_datetime(date_str + ' 23:59:59')
    while current_time <= end_time:
        current_time_str = current_time.strftime('%H:%M')
        predicted_count = predict_people_count(current_time_str)
        predictions[current_time_str] = predicted_count
        current_time += pd.Timedelta(minutes=30)
    if (date_str in states.keys()):
        infer_prediction_cosmos = states[date_str]
    else:
        infer_prediction_cosmos = list(predictions.values())
        infer_prediction_cosmos = [i*(random()+0.5) for i in infer_prediction_cosmos]
        states[date_str] = infer_prediction_cosmos
    return jsonify({
            "times" : list(predictions.keys()),
            "people" : infer_prediction_cosmos
    })