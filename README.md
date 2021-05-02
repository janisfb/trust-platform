# trust-platform
A Vue.js / Express.js proof-of-concept for cloud accountability on digital platforms using extensive protocolling.

This is a concept platform developed specifically for the practical part of a bachelor thesis on data sovereignty. The main idea is to use a Logger in each of the platforms backend components. The Logger can then be utilized to log every action that is performed on the data. Part of the concept is a visual representation of the recorded log messages which has been enriched with tools to explore the information they contain. 

## architecture
![UML component diagram](./Komponentendiagramm.pdf)

Components:
---
* __VueFrontend:__ The frontend of the platform uses Vue.js.
* __Kong:__ The API gateway that has been used. Includes plugins for session, auth and cors. 
The login credentials are (test,test) and (admin,admin).
* __FileExplorer:__ Just a plain folder in the directory.
* __data-management__: Service that handles all CRUD-operations for uploading files on the platform.
* __service-management:__ Service that handles the execution of microservices on the files.
* __log-management:__ Service that exposes the API for the retrieval of the recorded log messages.
* __proof-management:__ Service that handles a proof-of-work-blockchain on the recorded logs.
* __service_db:__ DB which stores metadata about the microservices.
* __Kafka:__ Streaming platform used for the logging.
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

Problems with logstash:
Logstash requires a minimum amount of allocated memory. The error can be fixed with:
``` bash
sysctl -w vm.max_map_count=262144
```