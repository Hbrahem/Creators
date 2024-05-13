import pandas as pd

# Read the CSV file with specified encoding
df = pd.read_csv('./DisneylandReviews.csv', encoding='latin1')

# Write the DataFrame to an Excel file
df.to_excel('DisneylandReviews.xlsx', index=False)  # You can specify index=True if you want to include row numbers
