import csv
import json

# Define common filter words
common_words = ["and", "or", "to", "on", "what", "how", "be", "have", "as", "it", "are", "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "cnn", "cnnpolitics", "us", "new"]

# Read the CSV file
with open('word_info.csv', 'r') as file:
	reader = csv.reader(file)
	next(reader)  # Skip the header row
	word_freq = {row[0]: int(row[1]) for row in reader}

# Filter out common words
filtered_words = {word: freq for word, freq in word_freq.items() if word.lower() not in common_words}

# Sort the words by frequency in descending order
sorted_words = sorted(filtered_words.items(), key=lambda x: x[1], reverse=True)


# Generate JSON data for D3 graph
data = []
for word, freq in sorted_words:
	data.append({'word': word, 'frequency': freq})

top_words = data[:25]

# Save JSON data to a file
with open('top_words.json', 'w') as file:
	json.dump(top_words, file)

# # Get the top 25 most frequent words
# top_words = sorted_words[:25]
# # Save the top words as a JSON file
# with open('top_words.json', 'w') as file:
# 	json.dump(top_words, file)
