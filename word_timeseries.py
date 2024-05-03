import pandas as pd

import matplotlib.pyplot as plt

# Read the CSV file into a pandas DataFrame
data = pd.read_csv('datasets/aggregated_headlines_dates.csv')
word = "analysis"
# Filter the DataFrame to include only rows with the specific word in the headline column
filtered_data = data[data['headline'].str.contains(word, case=False)]

# Group the filtered data by date and count the occurrences of the word
word_counts = filtered_data.groupby('date').size()
# Calculate the number of headlines on each date
# headline_counts = data.groupby('date').size()

# Regularize the word frequency by dividing it by the number of headlines on that date
# regularized_word_counts = word_counts / headline_counts

# print (regularized_word_counts)

word_counts_list = list(word_counts.items())
# print(word_counts_list)

# # Save the date and frequency of the word into a CSV file
word_counts_list_df = pd.DataFrame(word_counts_list, columns=["Date", "Frequency"])
word_counts_list_df.to_csv(f"word_counts_{word}.csv", index=False)

# # Plot the timeseries graph
# plt.plot(regularized_word_counts.index, regularized_word_counts.values)
# plt.xlabel('Date')
# plt.ylabel('Number of occurrences')
# plt.title('Timeseries of word "trump" occurrences')
# plt.show()