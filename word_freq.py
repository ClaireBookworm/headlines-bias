import csv
import json

# Read word frequencies from CSV file
word_freq = {}
with open('word_info.csv', 'r') as file:
	reader = csv.reader(file)
	next(reader)  # Skip header row
	for row in reader:
		word = row[0]
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
with open('data.json', 'w') as file:
	json.dump(data, file)

# Now you can use the 'data.json' file to create an interactive D3 graph