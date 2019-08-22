Federated Queries over Bgee, OMA and UniProt -  performance evaluation
===

This folder contains all federated queries executed in the tests and results detailed in the journal article below and they can be used to reproduce these results. Yet, some variations can be perceived due to different workloads in the server. 

Sima, A. C., De Farias, T. M., Zbinden, E., Anisimova, M., Gil, M., Stockinger, H., Stockinger, K., Robinson-Rechavi, M. & Dessimoz, C. (2019). Enabling Semantic Queries Across Federated Bioinformatics Databases. To appear in Database, Volume 2019, 2019, baz106.

A preprint of that article is available in [bioRxiv](https://www.biorxiv.org/content/10.1101/686600v1.abstract)

Last but not least, some of the corresponding federated queries shown in the current version of the Web application here: [http://biosoda.expasy.org/](http://biosoda.expasy.org/) are slightly different from the queries here. 
This is because we address performance issues that depends on the storage engine used for the Bgee relational database. 
In this application, we run the queries over PostgreSQL instead of MySQL to improve runtime performance of queries that involves the Bgee data. 