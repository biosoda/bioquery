# EasyBgee v15.0 OBDA mappings
+ **bgee_v15_genex.obda** contains all latest mappings adapted to the EasyBgee v15 data schema and data. It also includes post-composition terms (e.g. cell in organ) modelled as at least two assertions of the property [genex:hasAnatomicalEntity](https://biosoda.github.io/genex/#hasAnatomicalEntity). The materialized RDF data including infereces based on the ontology axioms will be accessible  early 2022 via the SPARQL endpoint https://bgee.org/sparql/. More information will be available at https://bgee.org/?page=sparql.  
+ **split_mappings_bgee_v15** folder contains the same mappings as **bgee_v15_genex.obda** but within separated files in order to ease the RDF triple  materialization by avoiding the union of mappings to derive the triples.
# EasyBgee v14, v14.1 and v14.2 OBDA mappings
+ **bgee_v14_genex.obda** contains the latest mappings and includes absence of gene expression and expression scores mappings. The materialized RDF data including infereces based on the ontology axioms are accessible via the SPARQL endpoint https://bgee.org/sparql/. More information is available at https://bgee.org/?page=sparql.  

Currently, the Bgee database is hosting its own RDF store by also including the latest data based on the [bgee_v14_genex.obda](bgee_v14_genex.obda) mappings and generated with the [ontop tool](https://ontop-vkg.org).

# Deprecated OBDA mappings

+ **bgee_genex.obda mappings** are used to virtually generate the Bgee RDF graph from easyBgee MySQL dump (ftp://ftp.bgee.org/bgee_v14/sql_lite_dump.tar.gz) 
and accessible via  the SPARQL endpoint at  http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight

bgee_genex.obda mappings were used in the article published and available at 
Ana Claudia Sima, Tarcisio Mendes de Farias, Erich Zbinden, Maria Anisimova, Manuel Gil, Heinz Stockinger, Kurt Stockinger, Marc Robinson-Rechavi, Christophe Dessimoz, Enabling semantic queries across federated bioinformatics databases, Database, Volume 2019, 2019, baz106, https://doi.org/10.1093/database/baz106


