import pandas as pd
import numpy as np
import os

def get_kwh_for_date_range(start_date_iso, end_date_iso, random_seed):
    np.random.seed(random_seed)
    
    start_date = pd.to_datetime(start_date_iso)
    end_date = pd.to_datetime(end_date_iso)
    
    date_range = pd.date_range(start=start_date, end=end_date, freq='h')
    
    dir_path = os.path.dirname(os.path.realpath(__file__))
    file_path = os.path.join(dir_path, 'hour_wise_kwh_usage.csv')
    example_data = pd.read_csv(file_path, parse_dates=['datetime'], index_col='datetime')
    
    hourly_means = example_data['kwh'].groupby(example_data.index.hour).mean()
    base_line = hourly_means.mean()
    hourly_fluctuations = hourly_means / base_line
    
    generated_kwh = []
    for date in date_range:
        base_kwh = base_line + np.random.uniform(-0.5, 0.5) * base_line
        fluctuation_factor = hourly_fluctuations[date.hour]
        adjusted_kwh = base_kwh * fluctuation_factor
        final_kwh = adjusted_kwh * np.random.uniform(0.7, 1.3)
        generated_kwh.append(round(final_kwh, 3))
    
    generated_df = pd.DataFrame({'datetime': date_range, 'kwh': generated_kwh})
    
    return generated_df