import pandas as pd
from textblob import TextBlob

# Load the CSV file
df = pd.read_csv('datasets/aggregated_headlines_dates.csv', names=['date', 'headline'])
# Create two lists for the 'date' and 'headline' columns
date_list = df['date'].tolist()
headline_list = df['headline'].tolist()

# Function to calculate sentiment polarity
def get_polarity(text):
    return TextBlob(text).sentiment.polarity

# Function to calculate sentiment subjectivity
def get_subjectivity(text):
    return TextBlob(text).sentiment.subjectivity

# Apply functions to the title column
df['polarity'] = df['headline'].apply(get_polarity)
df['subjectivity'] = df['headline'].apply(get_subjectivity)

# Convert 'published_date' to datetime and extract date
# df['published_date'] = pd.to_datetime(date_list).dt.date

# Select required columns
result_df = df[['date', 'headline', 'polarity', 'subjectivity']]

# Write the results to a new CSV file
result_df.to_csv('sentiment_dataset2.csv', index=False)

print("Sentiment analysis completed and saved to 'sentiment_analysis.csv'.")
