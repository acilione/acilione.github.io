import { marked } from "marked";

let cvMd = `# Antonino Cilione
**Big Data Engineer**
Reggio Calabria, Italy | (+39) 347-252-7757
antoninocilione96@gmail.com | linkedin.com/in/antonino-cilione-1258291a6 | github.com/acilione | acilione.github.io

### Professional Summary
Big Data Engineer with extensive experience in designing scalable ETL pipelines and microservices. Proven track record in migrating legacy frameworks to modern cloud architectures and optimizing database performance. Specializes in the ingestion and processing of critical energy grid data, utilizing the Hadoop ecosystem (Spark, Kafka) and Cloud technologies.

---

### Work History

**Big Data Engineer** | **Enel** | *Jul 2022 – Present*
* **Primary Responsibility:** Engineered and maintained high-throughput data pipelines specifically for the **ingestion of medium and low voltage measurements**, ensuring data accuracy and real-time availability for grid analysis.
* **Framework Migration:** Led the complex framework migration from Cloudera Distribution Hadoop (CDH) to **Cloudera Data Platform (CDP)**, modernizing the data infrastructure.
* **ETL Development:** Developed and maintained high-performance ETL pipelines using **Apache Spark** and **Kafka**.
* **R&D & Optimization:** Researched and benchmarked **Apache Iceberg** functionalities using Spark and Flink; successfully implemented a custom "equality delete files" commit feature on Apache Spark.
* **Data Ingestion:** Designed and implemented robust data ingestion flows using **Apache NiFi**.
* **Database Management:** Optimized **MongoDB Atlas** clusters by tuning indexes, memory, and configuring auto-scaling to balance cost and performance.
* **Microservices:** Developed **Java/Kotlin microservices** (Spring Boot) to expose NoSQL data stored on MongoDB to downstream applications.
* **Automation:** Authored **Python scripts** for advanced S3 Parquet file operations (merge, deduplicate, backup, restore) and **Bash scripts** for automated Kafka/S3 status checks.
* **Performance Tuning:** Integrated **Redis cache** (Redisson) within Spark jobs to reduce latency.
* **Codebase Evolution:** Developed complex SQL procedures for data analysis and executed significant codebase refactoring.
* *Tech Stack:* Kubernetes, Docker, Git, Dremio.

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

* **Data Technologies:** Apache Spark, Kafka, MongoDB Atlas, Apache NiFi, Redis, Dremio.
* **Programming:** Java, Go, Kotlin, Python, Scala, C, SQL, Bash, TypeScript, C#.
* **Frontend & Graphics:** React, Three.js, Unity.
* **Frameworks and Libraries:** Spring Boot, React, TensorFlow Lite (TFLite).
* **Cloud & DevOps:** Kubernetes, Docker, AWS (S3), Git.
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
* **Greta's Adventures:** Developed a full platform video game using **Unity** and **C#** (Awarded First Prize at University of Catania's Game Jam).
* **Interactive Physics Lab:** Developing a fully interactive virtual physics laboratory using **React**, **TypeScript**, and **Three.js** (In Progress).

**Other Engineering Projects**
* **Computer Vision App:** Created an Android application enabling 3D model manipulation via computer vision using hand gestures.
* **C Standard Library:** Re-implemented portions of the C Standard Library to deepen understanding of low-level memory management.

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