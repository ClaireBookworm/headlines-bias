from transformers import pipeline
import pandas as pd
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from transformers import AutoModelForSequenceClassification
from transformers import TFAutoModelForSequenceClassification
from transformers import AutoTokenizer, AutoConfig
import numpy as np
from scipy.special import softmax

# Load the CSV file
df = pd.read_csv('datasets/aggregated_headlines_dates.csv', names=['date', 'headline'])
# Create two lists for the 'date' and 'headline' columns
date_list = df['date'].tolist()
headline_list = df['headline'].tolist()

# Load the pre-trained sentiment analysis model
# sentiment_task = pipeline("sentiment-analysis", model=model_path, tokenizer=model_path)
# model_name = 'distilbert-base-uncased-finetuned-sst-2-english'
model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
model = AutoModelForSequenceClassification.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Define a function to get the sentiment rating for a given text
def get_sentiment_rating(text):
    encoded_input = tokenizer(text, return_tensors='pt')
    output = model(**encoded_input)
    scores = output[0][0].detach().numpy()
    scores = softmax(scores)
    # inputs = tokenizer(text, padding=True, truncation=True, return_tensors='pt')
    # outputs = model(**inputs)
    # logits = outputs.logits
    # probabilities = logits.softmax(dim=1)
    # sentiment_score = probabilities[0][1].item()  # Assuming positive sentiment is at index 1
    # return sentiment_score

# Create an instance of the sentiment analysis model
sentiment_model = get_sentiment_rating

# Create empty lists to store the ratings
trump_ratings = []
clinton_ratings = []
election_ratings = []

# Iterate through the headlines and get the sentiment ratings
for headline in headline_list:
    # Get the sentiment rating for Trump
    trump_rating = sentiment_model(headline.replace('Trump', ''))
    trump_ratings.append(trump_rating)
    
    # Get the sentiment rating for Clinton
    clinton_rating = sentiment_model(headline.replace('Clinton', ''))
    clinton_ratings.append(clinton_rating)
    
    # Get the sentiment rating for elections in general
    election_rating = sentiment_model(headline.replace('elections', ''))
    election_ratings.append(election_rating)

# Create a DataFrame to store the ratings and date_list
ratings_df = pd.DataFrame({'Date': date_list, 'Trump Rating': trump_ratings, 'Clinton Rating': clinton_ratings, 'Election Rating': election_ratings})

# Save the DataFrame to a CSV file
ratings_df.to_csv('ratings.csv', index=False)

# Print the ratings
print("Trump Ratings:", trump_ratings)
print("Clinton Ratings:", clinton_ratings)
print("Election Ratings:", election_ratings)
