# Yelen Salone technical notes

Yelen Salone is a local outage detection simulation for Sierra Leone.

## Architecture

The interface uses HTML, CSS, and JavaScript. Reports are sent to a FastAPI service. The service stores reports permanently in a local SQLite database and supports PostgreSQL through the `YELEN_DATABASE_URL` environment variable. The detection pipeline uses a scikit learn Random Forest model and groups reports within three kilometers and thirty minutes.

## Reproducible evaluation

Run `python backend/train_model.py` from the project folder. This recreates 6,000 simulated records with seed 42, trains the model, and writes the measured results to `models/metrics.json`.

The current held out results are:

* Accuracy: 0.9307
* Precision: 0.8940
* Recall: 0.9478
* ROC AUC: 0.9820

These measurements apply to synthetic data. They do not establish real world performance in Sierra Leone.

## Storage

The default local database is `data/yelen.db`. It keeps submitted reports after the app closes. PostgreSQL can be enabled by setting `YELEN_DATABASE_URL` to a PostgreSQL connection string before launch.

## API

* `GET /api/health`
* `GET /api/reports`
* `POST /api/reports`
* `GET /api/outages`

FastAPI documentation is available locally at `http://127.0.0.1:8765/docs` while the app is running.
