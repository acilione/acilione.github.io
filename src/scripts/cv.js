import { marked } from "marked";

let cvMd = `## Work History

**Big Data Engineer** | Enel | Jul 2022 - Present
* Led framework migration from **CDH to CDP (Cloudera Platform)**.
* Developed/maintained high-performance **ETL pipelines (Spark, Kafka)**.
* Researched/benchmarked Apache Iceberg functionalities using Apache Spark and Apache Flink; implemented **custom equality delete files** commit feature on Apache Spark.
* Designed/implemented **Apache Nifi** data pipelines.
* Managed/optimized **MongoDB Atlas** (indexes, memory, autoscale for cost/performance).
* Developed **Java/Kotlin microservices**(Spring) exposing NoSQL data stored on MongoDB.
* Authored **Python scripts** for S3 Parquet file operations (merge, deduplicate, backup, update, delete, restore).
* Developed **Bash scripts** for automated Kafka/S3 status checks.
* Set up/utilized **Redis cache** (Redisson) in Spark.
* Developed **SQL procedures** for data analysis.
* Executed significant **codebase refactoring**.
* Utilized **Kubernetes, Docker, Git, Dremio**.

**Android Developer** | Iriscube Reply | Feb 2022 - Jul 2022
* Developed/maintained Android banking app, migrating Java to Kotlin.
* Implemented new features and performed bug fixing.

## Education

**B.Eng. in Software Engineering** | Oct 2018 - Mar 2022
University of Catania | Catania, Italy

**Thesis**: Implementation of learning algorithms on microcontrollers (HAR model on STM microcontroller using TFLite).

## Skills

* **Data Technologies:** Spark, Kafka, MongoDB Atlas, Nifi, Redis, Dremio
* **Programming:** Java, Go, Kotlin, Python, Scala, C, SQL, Bash
* **Frameworks and libraries:** Spring, Redisson, TFLite
* **Cloud & DevOps:** Kubernetes, Docker, AWS (S3), Git
* **Other:** ETL, Data Pipelines, Microservices, Code Refactoring, Performance Optimization, Android, ML, IoT/Embedded (Academic), Unity (Academic)
* **Languages:** English (proficient), Italian (native)

## Awards and Honors

**First Prize**, University Game Jam | 2019
* Developed a platform videogame in 48hrs.

## Personal Projects

* Survey Android App: Survey creation, answering, nearby device interaction.
* Computer Vision Android App: 3D model manipulation using hand gestures.
* Fullstack Website (Acad.): Laravel + JS Vanilla. SQL DB design. Features: multi-role login, circulars, grades, attendances, timetables, API integrations.
* C Standard Library reimplementation.

## Certifications

* Cambridge English: First (FCE)
* Coursera: Algorithm Toolbox - UC San Diego
* Coursera: Improving Deep Neural Networks - DeepLearning.AI
* Coursera: Getting and Cleaning Data - Johns Hopkins University
* Coursera: R Programming - Johns Hopkins University
* Coursera: The Data Scientist’s Toolbox - Johns Hopkins University  
`
document.getElementById("cv-content").innerHTML = 
    marked.parse(cvMd)