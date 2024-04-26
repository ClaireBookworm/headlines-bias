from transformers import pipeline
import pandas as pd

# Load the CSV file
df = pd.read_csv('newscatcher_nation.csv')

# Load a pre-trained sentiment analysis model
classifier = pipeline('sentiment-analysis')

# Function to calculate sentiment
def get_sentiment(text):
    result = classifier(text)[0]
    return result['label'], result['score']

# Apply function to the title column
df['sentiment'] = df['title'].apply(get_sentiment)

# Convert 'published_date' to datetime and extract date
df['published_date'] = pd.to_datetime(df['published_date']).dt.date

# Separate the sentiment into two columns
df['sentiment_label'], df['sentiment_score'] = zip(*df['sentiment'])
df.drop('sentiment', axis=1, inplace=True)

# Select required columns
result_df = df[['published_date', 'sentiment_label', 'sentiment_score']]

# Write the results to a new CSV file
result_df.to_csv('sentiment_analysis.csv', index=False)

print("Sentiment analysis completed and saved to 'sentiment_analysis.csv'.")
 

# You can delete the cache directory (~/.cache/huggingface/transformers/), but this means you'll need to re-download the models if you use them again.