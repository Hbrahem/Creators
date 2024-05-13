import psycopg2
import pandas as pd
import matplotlib.pyplot as plt
from textblob import TextBlob

# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(
    dbname='DWBI3',
    user='postgres',
    password='999',
    host='localhost',
    port='5432'
)

# Query to fetch data from the database table
query = "SELECT * FROM public.\"Dim_review\""

# Load data into a DataFrame
df = pd.read_sql(query, conn)

# Close the database connection
conn.close()

# Adjust the sentiment analysis function using TextBlob
def analyze_sentiment_ai(feedback):
    if isinstance(feedback, str):
        blob = TextBlob(feedback)
        sentiment_score = blob.sentiment.polarity
        # Convert sentiment score to a categorical label
        if sentiment_score > 0:
            return 5  # Positive sentiment
        elif sentiment_score < 0:
            return 1  # Negative sentiment
        else:
            return 3  # Neutral sentiment
    else:
        return 3  # Handle NaN values or non-string inputs

# Apply sentiment analysis function to each row in the dataframe
df['Sentiment'] = df['Review_text'].apply(analyze_sentiment_ai)

# Count the occurrences of each sentiment category
sentiment_counts = df['Sentiment'].value_counts()

# Calculate the average rating stars based on sentiment
average_rating = df['Sentiment'].mean()

# Create a bar plot for sentiment distribution
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
sentiment_counts.plot(kind='bar', color='skyblue')
plt.title('Distribution of Sentiment Categories')
plt.xlabel('Sentiment')
plt.ylabel('Frequency')
plt.xticks(rotation=45)

# Create a bar plot for average rating stars
plt.subplot(1, 2, 2)
plt.bar(['Average Rating'], [average_rating], color='green', width=0.3)
plt.title('Average Rating Stars')
plt.xlabel('Rating')
plt.ylabel('Average')
plt.ylim(0, 5)  # Assuming ratings are between 0 and 5
plt.tight_layout()

# Save the plot as an image file
plot_output_path = 'sentiment_and_rating_distributionBI3.png'
plt.savefig(plot_output_path)

# Save DataFrame to a CSV file with sentiment analysis
output_csv_path = 'sentiment_analysis_with_ratingBI3.csv'
df.to_csv(output_csv_path, index=False)

# Show plots
plt.show()
