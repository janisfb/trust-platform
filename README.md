# trust-platform
A Vue.js / Express.js proof-of-concept for cloud accountability on digital platforms using extensive protocolling.

This is a concept platform developed specifically for the practical part of a bachelor thesis on data sovereignty. The main idea is to use a Logger in each of the platforms backend components. The Logger can then be utilized to log every action that is performed on the data. Part of the concept is a visual representation of the recorded log messages which has been enriched with tools to explore the information they contain. 

## architecture
[UML component diagram](./Komponentendiagramm.pdf)

### components:

* __VueFrontend:__ Frontend of the platform - Vue.js.
* __Kong:__ API gateway. Includes plugins for session, auth and cors. 
The login credentials are (test,test) and (admin,admin).
* __FileExplorer:__ Plain directory folder as db for files.
* __data-management__: Service that handles all CRUD-operations for files on the platform.
* __service-management:__ Service that handles the execution of microservices (on the files).
* __log-management:__ Service that exposes API for the retrieval of recorded log messages.
* __proof-management:__ Service that builds a proof-of-work-blockchain on the recorded logs.
* __service_db:__ DB which stores metadata about the microservices.
* __Kafka:__ Streaming bus/platform for centralizing the logs.
* __Logstash:__ Pipeline for the logs.
* __Elasticsearch:__ DB for storing the logs.
* __proof_db:__ DB that stores the proof-of-work-blockchain.

## usage
All components of the platform can be installed and started via docker-compose:
``` bash
docker-compose up --build
```

The endpoints are:
* __Frontend:__ http://localhost:8080/
* __Log-API:__ http://localhost:8080/api/logs
* __Proof-API:__ http://localhost:8080/api/proofs

---
### known problems
**Problems with logstash:**
Logstash requires a minimum amount of allocated memory. The error can be fixed with:
``` bash
sysctl -w vm.max_map_count=262144
```

**Problems with docker containers:**
Especially at first build/start timeouts can occur. The database connection between MongoDB and the Express.js-apps or the connection between the message bus and pipeline could fail. In this case a rebuild/restart of all containers will usually solve the problems.

---
## notes
The platform has been tested on the following platforms:
| OS | details |
| ------ | ----------- |
| Windows 10 (20H2)   | i5-6500 Quad-Core (3.2 GHz); 16 GB RAM; Docker version 20.10.5, build 55c4c88, WSL2 backend (Ubuntu)|                                      
| macOS (10.15.3) | i5 Dual-Core (2.3 GHz); 8 GB RAM; Docker version 20.10.6, build 370c289, ressources set to: 3 cores, 4GB memory, 2GB swap  |

---
Note that this is not a release version. The frontend was optimised for an aspect ration of 16:9 (1920x1080px).
