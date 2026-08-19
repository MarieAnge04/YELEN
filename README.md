# YELEN

Yelen is a simulated electricity outage detection platform designed around the challenge of identifying and tracking power cuts in West African communities.

The platform allows users to submit outage reports based on their location. These reports are stored and analyzed so that patterns can be identified across nearby areas and over time.

Yelen is currently a research and simulation project rather than a production utility-monitoring system.

## Why Yelen?

Power outages can sometimes be difficult to track consistently, especially in areas where real-time infrastructure data may not always be easily accessible.

Yelen explores how crowdsourced reports and machine learning could be used to identify possible electricity outages based on where and when people report losing power.

For example, if several users within the same area report losing electricity within a short period of time, Yelen can analyze those reports and determine whether they are likely part of a larger outage rather than isolated incidents.

## Features

* Submit simulated electricity outage reports
* Store outage reports and location data in PostgreSQL
* Analyze reports based on location, time, and reporting frequency
* Detect clusters of reports occurring in similar areas
* Predict whether reports are likely associated with a larger outage
* Distinguish potential outages from isolated incidents
* Display outage information through a web interface

## How It Works

Yelen uses both machine learning and spatiotemporal analysis.

Each report contains information such as:

* Location
* Time of report
* Frequency of reports in the surrounding area

The system engineers temporal and geographic features from these reports and uses them to classify whether an outage is likely occurring.

Reports that occur close together geographically and within similar time periods can also be grouped using spatiotemporal clustering.

Using simulated data, the current model achieved approximately **80% outage detection accuracy**.

## Tech Stack

**Backend**

* Python
* FastAPI

**Machine Learning**

* scikit-learn
* Feature engineering
* Classification
* Spatiotemporal clustering

**Database**

* PostgreSQL

**Frontend**

* React

## Dataset

Yelen currently uses more than **5,000 simulated geospatial outage reports**.

The simulated dataset makes it possible to test the detection and prediction pipeline without relying on real utility-company or customer data.

## Project Status

Yelen is currently a prototype built to explore how crowdsourced reporting, geographic information, and machine learning could support electricity outage detection.

Future versions could explore:

* Real-time community outage reporting
* Interactive outage maps
* More detailed geographic clustering
* Historical outage trends
* Confidence scores for predictions
* Notifications when multiple nearby reports indicate a possible outage
* Integration with real-world utility or infrastructure datasets

## Purpose

The goal of Yelen is to explore how software and machine learning can be applied to infrastructure challenges that affect communities in West Africa.

Rather than relying only on centralized outage data, Yelen investigates whether community-generated reports can provide useful signals for identifying where electricity disruptions may be happening.

---

**Note:** Yelen currently operates using simulated data and should not be used as an official source of electricity outage information.
