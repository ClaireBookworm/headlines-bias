import csv
import json
from collections import defaultdict

words = ["analysis", "clinton", "democrats", "impeachment", "investigation", "justice", "mueller", "opinion", "perspective", "power", "republicans", "russia", "trump"]

word_csvs = []

for word in words:
    word_csvs.append("word_counts/word_counts_" + word + ".csv")

aggregated_csv = "datasets/aggregated_headlines_dates.csv"

output_file = "overall_timeseries.json"

def process_csvs(aggregated_csv, word_csvs, output_file):
    # Read the aggregated CSV to get dates and headlines
    date_headlines = defaultdict(list)
    with open(aggregated_csv, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            date = row['date']
            headline = row['headline']
            date_headlines[date].append(headline)
    
    # Read each word frequency CSV
    date_words = defaultdict(list)
    for word_csv in word_csvs:
        with open(word_csv, newline='') as csvfile:
            reader = csv.DictReader(csvfile)
            word = word_csv.split('_')[-1].split('.')[0]  # assuming file name represents the word
            for row in reader:
                date = row['Date']
                frequency = int(row['Frequency'])
                date_words[date].extend([word] * frequency)
    # print(date_words)
    # Combine data into the desired format
    output_data = []
    for date in date_headlines:
        if date_words[date] == []:
            continue
        output_data.append({
            'date': date,
            'words': date_words[date],
            'headlines': date_headlines[date]
        })
    
	# Write JSON data to the output file
    with open(output_file, 'w') as jsonfile:
        json.dump(output_data, jsonfile, indent=4)
    
	# return json.dumps(output_data, indent=4)

# Example usage
json_output = process_csvs(aggregated_csv, word_csvs, output_file)
# print(json_output)
