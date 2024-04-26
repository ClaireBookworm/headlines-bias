import pandas as pd
from textblob import TextBlob

# Load the CSV file
df = pd.read_csv('newscatcher_nation.csv')

# Function to calculate sentiment polarity
def get_polarity(text):
    return TextBlob(text).sentiment.polarity

# Function to calculate sentiment subjectivity
def get_subjectivity(text):
    return TextBlob(text).sentiment.subjectivity

# Apply functions to the title column
df['polarity'] = df['title'].apply(get_polarity)
df['subjectivity'] = df['title'].apply(get_subjectivity)

# Convert 'published_date' to datetime and extract date
df['published_date'] = pd.to_datetime(df['published_date']).dt.date

# Select required columns
result_df = df[['published_date', 'polarity', 'subjectivity']]

# Write the results to a new CSV file
result_df.to_csv('sentiment_analysis.csv', index=False)

print("Sentiment analysis completed and saved to 'sentiment_analysis.csv'.")
