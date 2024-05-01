import csv
from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd

title_list = []
description_list = []

with open('datasets/aggregated_headlines_dates.csv', 'r') as file:
	reader = csv.reader(file)
	next(reader)  # Skip the header row
	for row in reader:
		title_list.append(row[0])
		description_list.append(row[1])

# print("Titles:", title_list)
# print("Descriptions:", description_list)

trump_count = 0

for title, description in zip(title_list, description_list):
	if "Trump" in title or "Trump" in description:
		trump_count += 1

print("Number of headlines and descriptions mentioning Trump:", trump_count)

# Combine title and description into a single list of documents
documents = [title + " " + description for title, description in zip(title_list, description_list)]

# Create the TF-IDF vectorizer
vectorizer = TfidfVectorizer()

# Compute the TF-IDF matrix
tfidf_matrix = vectorizer.fit_transform(documents)

# Get the feature names (words)
feature_names = vectorizer.get_feature_names_out()

# Create a list to store the word frequency and associated info
word_info_list = []

# Iterate over each word in the feature names
for word_index, word in enumerate(feature_names):
	# Get the TF-IDF values for the current word
	tfidf_values = tfidf_matrix[:, word_index].toarray().flatten()
	
	# Calculate the frequency of the word
	word_frequency = sum(tfidf_values > 0)
	
	# Get the associated info for the word
	word_info = [word, word_frequency]
	
	# Append the word info to the list
	word_info_list.append(word_info)

# Create a DataFrame for the word info
word_info_df = pd.DataFrame(word_info_list, columns=["Word", "Frequency"])

# Save the word info to a new CSV file
word_info_df.to_csv('/Users/clairebookworm/github/headlines-bias/word_info_dataset2.csv', index=False)

# Print a success message
print("Word info saved to word_info.csv")