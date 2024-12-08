# Netflix Data Analysis and Visualization

## Project Overview

This project is a web application that combines a Django backend with a React frontend using Material-UI for the UI design. The purpose of the application is to analyze and visualize data from the Netflix Movies and TV Shows dataset.

## Features

### 1. Data Filtering and Analysis

* The Netflix dataset is loaded and processed using Pandas.
* Filters are applied to clean and extract meaningful insights.
* The processed data is stored in an SQLite database.

### 2. Backend (Django)

* The backend is built using Django, serving API endpoints to provide the filtered data to the frontend.
* API endpoints include the most common genres, content distribution by ratings, and the trend of additions over the years.

### 3. Frontend (React)

* The frontend is built with React and styled with Material-UI for a modern and responsive design.
* Features an interactive Bar Chart that visualizes the number of Netflix shows released per year.
* Added a line graph on the bar chart to represent the trend of additions, creating a combined bar-line chart.

### 4. Dynamic Visualizations

* Users can see graphical representations of the data using Chart.js integrated into React.
* The combined bar-line chart features dynamic data updates based on user selections, showing the most common genres, the distribution of content by ratings, and yearly additions trends.

## Technologies Used

### Backend

* Django: Web framework for building the backend API.
* SQLite: Database for storing filtered Netflix data.
* Pandas: Python library for data manipulation and analysis.

### Frontend

* **React**: For building the user interface.
* **Material-UI**: For styling and responsive components.
* **Chart.js**: For data visualization.
* **Axios**: For making API calls to fetch data from the backend.

## Installation and Setup

### Prerequisites

* Python (3.9 or higher)
* Node.js (16.x or higher)
* npm or yarn
* A web browser

### Backend Setup

1. Clone the repository: `git clone "https://github.com/AkshunChauhan/Netflix-data-insights.git"`
2. Create a virtual environment (optional but recommended): `python -m venv venv`
3. Install the required packages: `pip install -r requirements.txt`
4. Configure the database: `python manage.py migrate`
5. Run the Django development server: `python manage.py runserver`

### Frontend Setup

1. Navigate to the frontend directory: `cd frontend`
2. Install the required packages: `npm install` or `yarn install`
3. Start the React development server: `npm start` or `yarn start`

### Accessing the Application

1. Open a web browser and navigate to `http://localhost:3000` to access the React frontend.
2. The Django backend API is available at `http://localhost:8000`.

## API Endpoints

The Django backend provides the following API endpoints:

* `GET /api/most_common_genres/`: Returns the most common genres on Netflix.
* `GET /api/content_by_ratings/`: Returns the distribution of content by ratings.
* `GET /api/additions_trend/`: Returns the trend of movie and TV show additions over the years.
* `GET /api/movies/`: Returns a list of all movies in the database.
* `GET /api/tv-shows/`: Returns a list of all TV shows in the database.
* `GET /api/data/`: Returns the filtered data used for visualization.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Open a pull request to merge your changes into the main repository.

## Contributors

Developer: Akshun Chauhan (AK)


## Acknowledgments

* Netflix Movies and TV Shows dataset by Netflix
* Django and React for providing the frameworks used in this project
* Material-UI and Chart.js for providing the UI components and data visualization library used in this project