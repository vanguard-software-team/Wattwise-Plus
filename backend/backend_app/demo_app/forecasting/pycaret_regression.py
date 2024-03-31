import pandas
from pycaret.regression import *
import matplotlib.pyplot as plt
import os

dir_path = os.path.dirname(os.path.realpath(__file__))
file_path = os.path.join(dir_path, 'hour_wise_kwh_usage.csv')
data = pandas.read_csv(file_path)
data['datetime'] = pandas.to_datetime(data['datetime'])
data['HOUR'] = [i.hour for i in data['datetime']]
data['DAY'] = [i.day for i in data['datetime']]
data['MONTH'] = [i.month for i in data['datetime']]
data['YEAR'] = [i.year for i in data['datetime']]


train = data[(data['YEAR'] < 2024) | ((data['YEAR'] == 2024) & (data['MONTH'] < 2))]
test = data[(data['YEAR'] > 2024) | ((data['YEAR'] == 2024) & (data['MONTH'] >= 2))]



s = setup(
    data = train,
    test_data = test,
    target = 'kwh',
    fold_strategy = 'timeseries',
    data_split_shuffle=False,
    fold_shuffle=False,
    numeric_features = ['YEAR', 'MONTH', 'DAY','HOUR'],
    fold=3,
    transform_target = False,
    session_id = 123
)

best = compare_models(sort = 'MSE',exclude=['lightgbm']) # for some reason lightgbm fail to train

#run the best model on test data
prediction_holdout = predict_model(best)
actual_values = prediction_holdout['kwh']
predicted_values = prediction_holdout['prediction_label']


# PLOT
train_actual_values = train['kwh'] # REAL ORDERS
train_predicted_values = predict_model(best, data=train)['prediction_label']
# Assuming 'DAY' and 'HOUR' columns exist in your DataFrame
time_labels_real_orders = [f"{year}/{month}/{day} {hour}:00" for year, month, day, hour in zip(data['YEAR'], data['MONTH'], data['DAY'], data['HOUR'])]
time_labels_train = [f"{year}/{month}/{day} {hour}:00" for year, month, day, hour in zip(train['YEAR'], train['MONTH'], train['DAY'], train['HOUR'])]
time_labels_test = [f"{year}/{month}/{day} {hour}:00" for year, month, day, hour in zip(test['YEAR'], test['MONTH'], test['DAY'], test['HOUR'])]


plt.figure(figsize=(15, 6))

plt.plot(time_labels_real_orders, data['kwh'], label='kwh', marker='o')
plt.plot(time_labels_train, train_predicted_values, label='Train', marker='o')
# plt.plot(time_labels_test, actual_values, label='kwh', marker='o')
plt.plot(time_labels_test, predicted_values, label='Test Predicted', marker='o')

plt.xlabel('Year/Month', fontsize=12)
plt.ylabel('kwh', fontsize=12)
plt.legend()
plt.title('Actual vs. Predicted kwh', fontsize=14)
plt.xticks(rotation=90)
plt.show()


# FUTURE PREDICTION

# future_dates = pandas.date_range(start = '2023-09-01', end = '2024-09-01', freq = 'MS')

# future_df = pandas.DataFrame()

# future_df['YEAR'] = [i.year for i in future_dates]
# future_df['MONTH'] = [i.month for i in future_dates]
# future_df['LME_CS'] = [0 for i in future_dates]
# future_df['LME_3MONTH'] = [0 for i in future_dates]
# future_df['LME_STOCK'] = [0 for i in future_dates]
# future_df['EP_EU_NONH'] = [0 for i in future_dates]

# final_best = finalize_model(best)
# predictions_future = predict_model(final_best, data=future_df)

# print(predictions_future)