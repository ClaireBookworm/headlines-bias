import pandas as pd

# Load the CSV file
df = pd.read_csv('newscatcher.csv', sep=';')

# Filter rows where the topic is 'NATION' and the language is 'en'
filtered_df = df[(df['topic'] == 'NATION') & (df['lang'] == 'en')]

# Remove the 'link' column
filtered_df = filtered_df.drop('link', axis=1)

# Convert published_date to datetime to sort correctly
filtered_df['published_date'] = pd.to_datetime(filtered_df['published_date'])

# Sort the dataframe by 'published_date'
filtered_df = filtered_df.sort_values('published_date')

# Select only the columns we need
final_df = filtered_df[['published_date', 'title', 'domain']]

# Write the filtered and sorted data to a new CSV file
final_df.to_csv('filtered_news.csv', index=False)

print("The file 'filtered_news.csv' has been created with the filtered and sorted data.")
