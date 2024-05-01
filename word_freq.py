import csv
import json

common_words = ["and", "or", "to", "on", "what", "how", "be", "have", "as", "it", "are", "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your", "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she", "her", "hers", "herself", "it", "its", "itself", "they", "them", "their", "theirs", "themselves", "what", "which", "who", "whom", "this", "that", "these", "those", "am", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an", "the", "and", "but", "if", "or", "because", "as", "until", "while", "of", "at", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "to", "from", "up", "down", "in", "out", "on", "off", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can", "will", "just", "don", "should", "now", "cnn", "cnnpolitics", "us", "new", "be", "the", "to", "of", "on", "what", "with", "he", "who", "has", "will", "can", "was", "is", "in", "ed", "like", "time", "one", "watergate", "opinion", "analysis", "tv", "time", "first", "get", "week", "op", "says"]

# Read word frequencies from CSV file
word_freq = {}
with open('word_info_dataset2.csv', 'r') as file:
	reader = csv.reader(file)
	next(reader)  # Skip header row
	for row in reader:
		word = row[0]
		if word in common_words:
			continue
		freq = int(row[1])
		word_freq[word] = freq

# Sort word frequencies in descending order
sorted_freq = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)

# Select top 50 words and their frequencies
top_words = [word for word, freq in sorted_freq[:50]]
top_freqs = [freq for word, freq in sorted_freq[:50]]

# Generate JSON data for D3 graph
data = []
for word, freq in zip(top_words, top_freqs):
	data.append({'word': word, 'frequency': freq})

# Save JSON data to a file
with open('dataset2_top_words.json', 'w') as file:
	json.dump(data, file)

# Now you can use the 'data.json' file to create an interactive D3 graph