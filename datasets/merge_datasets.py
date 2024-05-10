import pandas as pd

# Read in the first CSV file
df1 = pd.read_csv('approval_trump.csv')  # Update 'file1.csv' with the actual filename and path

# Read in the second CSV file
df2 = pd.read_csv('trump_freq.csv')  # Update 'file2.csv' with the actual filename and path

# Convert 'date' columns to datetime format
df1['date'] = pd.to_datetime(df1['date'])
df2['date'] = pd.to_datetime(df2['date'])

# Sort the dataframes by date
df1 = df1.sort_values('date')
df2 = df2.sort_values('date')


# Merge datasets based on nearest dates and keep all columns
merged_df = pd.merge_asof(df1, df2, on='date', suffixes=('_df1', '_df2'))

# Save the merged dataset as a new CSV file
merged_df.to_csv('merged_dataset.csv', index=False)