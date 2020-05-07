# easyBgee v14 OBDA mappings
+ **bgee_genex_materialization.obda** contains the latest mappings and includes absence of gene expression data and expression scores mappings. The materialized RDF data including infereces based on the ontology axioms are accessible via the SPARQL endpoint https://bgee.org/sparql  

+ **bgee_genex.obda mappings** are currently used to virtually generate the Bgee RDF graph from easyBgee MySQL dump (ftp://ftp.bgee.org/bgee_v14/sql_lite_dump.tar.gz) 
and accessible via  the SPARQL endpoint at  http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight

bgee_genex.obda mappings were used in the article published and available at 
Ana Claudia Sima, Tarcisio Mendes de Farias, Erich Zbinden, Maria Anisimova, Manuel Gil, Heinz Stockinger, Kurt Stockinger, Marc Robinson-Rechavi, Christophe Dessimoz, Enabling semantic queries across federated bioinformatics databases, Database, Volume 2019, 2019, baz106, https://doi.org/10.1093/database/baz106

Currently, the Bgee database is hosting his own RDF store by also including the latest data based on the bgee_genex_materialization.obda mappings and generated with [ontop tool](https://ontop-vkg.org).
