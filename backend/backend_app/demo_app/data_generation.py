import pandas as pd
import numpy as np
import os

def calculate_max_kwh(base_kwh, fluctuation_factor):
    dynamic_max = base_kwh * fluctuation_factor * 0.1
    return dynamic_max

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
        
        dynamic_max = calculate_max_kwh(base_kwh, fluctuation_factor)
        
        final_kwh = round(min(final_kwh, dynamic_max), 3)
        generated_kwh.append(final_kwh)
    
    generated_df = pd.DataFrame({'datetime': date_range, 'kwh': generated_kwh})
    
    return generated_df


def get_forecating_data_for_date_range(start_date_iso, end_date_iso, random_seed):
    generated_df = get_kwh_for_date_range(start_date_iso, end_date_iso, random_seed)
    generated_df['forecasted_kwh'] = round(generated_df['kwh'] * np.random.uniform(0.5, 1.5),3)
    return generated_df