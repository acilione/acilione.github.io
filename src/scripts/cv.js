import { marked } from "marked";

let cvMd = `# Antonino Cilione
**Big Data Engineer**
Reggio Calabria, Italy | (+39) 347-252-7757
antoninocilione96@gmail.com | linkedin.com/in/antonino-cilione-1258291a6 | github.com/acilione | acilione.github.io

### Professional Summary
Big Data Engineer with 4+ years of experience building and optimizing distributed data platforms for the energy sector. Specialized in Apache Spark, Kafka, Cloudera CDP, MongoDB and cloud-based data pipelines. Experienced in platform migrations, high-volume grid-data ingestion, ETL performance tuning and Java/Kotlin microservices.

---

### Work History

**Big Data Engineer** | **Enel** | *Jul 2022 – Present*
* Engineered and maintained high-throughput pipelines for the **ingestion of medium- and low-voltage measurements**, ensuring data accuracy and real-time availability for grid analysis.
* Led the migration from Cloudera Distribution Hadoop (CDH) to **Cloudera Data Platform (CDP)**, modernizing the data infrastructure.
* Developed and maintained high-performance ETL workloads using **Apache Spark** and **Kafka**.
* Researched and benchmarked **Apache Iceberg** with Spark and Flink, and implemented a custom equality-delete file commit feature in Apache Spark.
* Designed and implemented robust data ingestion flows using **Apache NiFi**.
* Optimized **MongoDB Atlas** clusters by tuning indexes and memory usage and configuring auto-scaling to balance cost and performance.
* Developed **Java/Kotlin microservices** with Spring Boot to expose NoSQL data stored in MongoDB to downstream applications.
* Automated advanced S3 Parquet operations—including merge, deduplication, backup and restore—with **Python**, and created **Bash** scripts for Kafka and S3 status checks.
* Integrated a **Redis cache** through Redisson into Spark jobs to reduce latency.
* Developed complex SQL procedures for data analysis and performed significant codebase refactoring.
* Built a desktop application in **Go** with the **Fyne** framework to automate Excel manipulation, data-filtering pipelines and report generation.
* *Environment:* Spark, Kafka, CDP, Iceberg, Flink, NiFi, MongoDB Atlas, Redis, Java, Kotlin, Python, AWS S3, Kubernetes, Docker, Git and Dremio.

**Android Developer** | **Iriscube Reply** | *Feb 2022 – Jul 2022*
* Developed and maintained a corporate Android banking application.
* Migrated the codebase from **Java** to **Kotlin**.
* Implemented new user-facing features and performed critical bug fixing to ensure app stability.

---

### Education

**B.Eng. in Software Engineering** | **University of Catania** | *Oct 2018 – Mar 2022*
* **Thesis:** *Implementation of learning algorithms on microcontrollers.* Developed a Human Activity Recognition (HAR) model on an STM microcontroller using **TFLite**.

---

### Skills

* **Data Engineering:** Apache Spark, Kafka, Apache Flink, Apache Iceberg, Apache NiFi, Dremio, Parquet.
* **Databases & Caching:** MongoDB Atlas, Redis, SQL.
* **Programming:** Java, Kotlin, Python, Scala, SQL, Bash.
* **Cloud & Platform:** Cloudera CDH/CDP, AWS S3, Kubernetes, Docker, Git.
* **Backend:** Spring Boot, REST APIs, Microservices.
* **Additional Technologies:** Go, C, C#, React, TypeScript, Three.js, Unity, TensorFlow Lite (TFLite).
* **Languages:** English (Proficient), Italian (Native).

---

### Side Projects

**Physics Simulations**
* Implemented complex physics papers using **Three.js** to create realistic browser-based visualizations.
* **Simulations developed:**
    * *Heron's Fountain:* A fluid dynamics simulation demonstrating pneumatic and hydraulic pressure.
    * *Unblowing bubbles: Understanding the physics of bubble deflation through a straw:* A simulation modeling surface tension and air pressure dynamics.
    * *Boyle's Perpetual Movement Flask:* (In Progress) A simulation of the classic hydrostatic paradox.

**Videogames & Interactive Media**
* **Quantum Dungeon Crawler:** Designed a dungeon crawler where real quantum computing algorithms (Grover, Shor, Bernstein-Vazirani, VQE, QAOA) become core gameplay mechanics. Features an in-game circuit composer, temperature-driven decoherence system, and progressive level design teaching quantum concepts. (In Progress)
* **Kamisado:** Built a real-time multiplayer Kamisado board game with Socket.IO-based communication, synchronized game state using **TypeScript**, **Node.js**, **Express**, and **Socket.IO**.
* **Greta's Adventures:** Developed a full platform video game using **Unity** and **C#** (Awarded First Prize at University of Catania's Game Jam).
* **Interactive Physics Lab:** Developing a fully interactive virtual physics laboratory using **React**, **TypeScript**, and **Three.js** (In Progress).

**Other Engineering Projects**
* **Computer Vision App:** Created an Android application enabling 3D model manipulation via computer vision using hand gestures.
* **C Standard Library:** Re-implemented portions of the C Standard Library to deepen understanding of low-level memory management.

---

### Competitions

* **MALLORN Astronomical Classification Challenge** (Kaggle): Classified astronomical transients to detect Tidal Disruption Events (stars torn apart by black holes). Ranked **58th out of 894** participants.

---

### Certifications

* **Coursera:** The Data Scientist’s Toolbox - Johns Hopkins University
* **Coursera:** Algorithm Toolbox - UC San Diego
* **Coursera:** Improving Deep Neural Networks - DeepLearning.AI
* **Coursera:** Getting and Cleaning Data - Johns Hopkins University
* **Cambridge English:** First (FCE)
`
document.getElementById("cv-content").innerHTML =
    marked.parse(cvMd)
