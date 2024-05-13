import psycopg2
import numpy as np
from sklearn.linear_model import LinearRegression
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Database connection parameters
dbname = 'DWBI3'
user = 'postgres'
password = '999'
host = 'localhost'
port = '5432'

# Connect to the PostgreSQL database
conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)

# Create a cursor
cur = conn.cursor()

# Query data
cur.execute("""
    SELECT dd.access_date, SUM(fs.number_person) AS total_persons
    FROM public."Fact_sales" AS fs
    JOIN public.dim_date AS dd ON fs.id_date = dd.id_date
    GROUP BY dd.access_date
    ORDER BY dd.access_date
""")

# Fetch all rows
rows = cur.fetchall()

# Close cursor and connection
cur.close()
conn.close()

# Separate dates and total persons
dates = [row[0] for row in rows]
total_persons = [row[1] for row in rows]

# Convert dates to numeric format
dates_numeric = np.array(range(len(dates))).reshape(-1, 1)

# Perform linear regression
model = LinearRegression()
model.fit(dates_numeric, total_persons)

# Predict total persons using the model
predicted_total_persons = model.predict(dates_numeric)

# Calculate evaluation metrics
mae = mean_absolute_error(total_persons, predicted_total_persons)
mse = mean_squared_error(total_persons, predicted_total_persons)
r2 = r2_score(total_persons, predicted_total_persons)

# Print evaluation metrics
print("Mean Absolute Error (MAE):", mae)
print("Mean Squared Error (MSE):", mse)
print("R-squared (R2) Score:", r2)

# Plot the data and regression line
plt.scatter(dates, total_persons, color='blue', label='Actual Data')
plt.plot(dates, predicted_total_persons, color='red', label='Regression Line')
plt.xlabel('Date')
plt.ylabel('Total Persons')
plt.title('Linear Regression of Total Persons by Date')
plt.legend()
plt.show()
