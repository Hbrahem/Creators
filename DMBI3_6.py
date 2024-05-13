import psycopg2
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler
from scipy.cluster.hierarchy import dendrogram, linkage, fcluster
from datetime import datetime

# Database connection parameters
dbname = 'DWBI3'
user = 'postgres'
password = '999'
host = 'localhost'
port = '5432'

# Connect to the PostgreSQL database
conn = psycopg2.connect(dbname=dbname, user=user, password=password, host=host, port=port)

# Fetch data from the database
cur = conn.cursor()
cur.execute("SELECT access_time, COUNT(DISTINCT id_custumer) as unique_customers FROM public.\"Fact_attendance\" GROUP BY access_time")
rows = cur.fetchall()
cur.close()
conn.close()

# Create a DataFrame from the fetched data
df = pd.DataFrame(rows, columns=['access_time', 'unique_customers'])

# Extract hour from access_time
df['access_hour'] = df['access_time'].apply(lambda x: x.hour)

# Normalize the data
scaler = StandardScaler()
scaled_data = scaler.fit_transform(df[['unique_customers', 'access_hour']])

# Create dendrogram
Z = linkage(scaled_data, method='ward')

# Plot dendrogram
plt.figure(figsize=(12, 6))
dendrogram(Z, leaf_rotation=90., leaf_font_size=12., show_contracted=True)
plt.title('Hierarchical Clustering Dendrogram based on Unique Customers and Access Hour')
plt.xlabel('Data point')
plt.ylabel('Distance')
plt.show()

# Assign data points to clusters
threshold = 3  # Adjust threshold to get desired number of clusters
clusters = fcluster(Z, threshold, criterion='maxclust')

# Add cluster labels to DataFrame
df['cluster'] = clusters

# Print clusters
print(df[['access_time', 'cluster']])

# Group by access hour and cluster label to find number of unique customers in each cluster at each hour
cluster_hour_group = df.groupby(['access_hour', 'cluster'])['unique_customers'].sum().unstack(fill_value=0)

# Find the top 3 clusters
top_clusters = cluster_hour_group.sum().nlargest(3).index

# Filter data for top 3 clusters
top_clusters_data = cluster_hour_group[top_clusters]

# Plot number of unique customers in each of the top 3 clusters over hours
plt.figure(figsize=(12, 6))
for cluster, data in top_clusters_data.iteritems():
    plt.plot(data.index, data.values, label=f'Cluster {cluster}', marker='o', linestyle='-')

plt.title('Number of Unique Customers in Top 3 Clusters Over Hours')
plt.xlabel('Access Hour')
plt.ylabel('Number of Unique Customers')
plt.xticks(range(24))  # Set ticks for all hours
plt.legend()
plt.tight_layout()
plt.show()
