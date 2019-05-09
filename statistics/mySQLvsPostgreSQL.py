import requests

# http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight?query=PREFIX%20up%3A%20%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0APREFIX%20orth%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0APREFIX%20obo%3A%20%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0ASELECT%20%3Fname%20%7B%0A%09%3Fgene%20a%20orth%3AGene%20.%0A%09%3Fgene%20rdfs%3Alabel%20%3FgeneName%20.%0A%09%3Fgene%20orth%3Aorganism%20%3Forganism%20.%20%23orth%20v2%0A%09%3Forganism%20obo%3ARO_0002162%20%3Ftaxon%20.%20%23label%3A%20in%20taxon%20.%0A%09%3Ftaxon%20up%3AscientificName%20%3Fname%20.%0A%09FILTER%20(%20UCASE(%3FgeneName)%20%3D%20UCASE(%27Mt-co1%27)%20)%0A%7D&format=JSON&limit=100&offset=0&inference=false
# http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight?query=PREFIX%20orth%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0APREFIX%20genex%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0APREFIX%20obo%3A%20%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0ASELECT%20%3FanatEntity%20%3FanatName%20%7B%0A%09%3Fseq%20a%20orth%3AGene%20.%0A%09%3Fexpr%20genex%3AhasSequenceUnit%20%3Fseq%20.%0A%09%3Fseq%20rdfs%3Alabel%20%3FgeneName%20.%0A%09%3Fexpr%20genex%3AhasExpressionCondition%20%3Fcond%20.%0A%09%3Fcond%20genex%3AhasAnatomicalEntity%20%3FanatEntity%20.%0A%09%3FanatEntity%20rdfs%3Alabel%20%3FanatName%20.%0A%09FILTER%20(%20LCASE(%3FgeneName)%20%3D%20LCASE(%27apoc1%27)%20)%0A%7D%20LIMIT%2010&format=JSON&limit=100&offset=0&inference=false

url1_title = "mySQL"
url1 = "http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight"
url2_title = "postgreSQL"
url2 = "http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight_postgres"
intermed = "?query="
query = "PREFIX%20up%3A%20%3Chttp%3A%2F%2Fpurl.uniprot.org%2Fcore%2F%3E%0APREFIX%20orth%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0APREFIX%20obo%3A%20%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0ASELECT%20%3Fname%20%7B%0A%09%3Fgene%20a%20orth%3AGene%20.%0A%09%3Fgene%20rdfs%3Alabel%20%3FgeneName%20.%0A%09%3Fgene%20orth%3Aorganism%20%3Forganism%20.%20%23orth%20v2%0A%09%3Forganism%20obo%3ARO_0002162%20%3Ftaxon%20.%20%23label%3A%20in%20taxon%20.%0A%09%3Ftaxon%20up%3AscientificName%20%3Fname%20.%0A%09FILTER%20(%20UCASE(%3FgeneName)%20%3D%20UCASE(%27Mt-co1%27)%20)%0A%7D"
query = "PREFIX%20orth%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fnet%2Forth%23%3E%0APREFIX%20genex%3A%20%3Chttp%3A%2F%2Fpurl.org%2Fgenex%23%3E%0APREFIX%20obo%3A%20%3Chttp%3A%2F%2Fpurl.obolibrary.org%2Fobo%2F%3E%0ASELECT%20%3FanatEntity%20%3FanatName%20%7B%0A%09%3Fseq%20a%20orth%3AGene%20.%0A%09%3Fexpr%20genex%3AhasSequenceUnit%20%3Fseq%20.%0A%09%3Fseq%20rdfs%3Alabel%20%3FgeneName%20.%0A%09%3Fexpr%20genex%3AhasExpressionCondition%20%3Fcond%20.%0A%09%3Fcond%20genex%3AhasAnatomicalEntity%20%3FanatEntity%20.%0A%09%3FanatEntity%20rdfs%3Alabel%20%3FanatName%20.%0A%09FILTER%20(%20LCASE(%3FgeneName)%20%3D%20LCASE(%27apoc1%27)%20)%0A%7D%20LIMIT%2010"
restofurl = "&format=JSON&limit=100&offset=0&inference=false"
loops = 1

f = open("statistics", "w")
f.close()

def printwrite(pstring):
    f = open("statistics", "a")
    print(pstring)
    f.write(pstring + "\n")
    f.close();

sums = {}
sums['url1'] = 0
sums['url2'] = 0
for x in range(loops):
    for oneurl in ['url1', 'url2']:
        printwrite("===============")
        tmpurl = eval(oneurl) + intermed + query + restofurl
        printwrite(tmpurl)
        tmpres = requests.get(tmpurl, headers={'Cache-Control': 'no-cache'})
        printwrite(tmpres.text)
        tmptime = tmpres.elapsed.total_seconds()
        sums[oneurl] = sums[oneurl] + tmptime
        printwrite (eval(oneurl+"_title") + ": " + str(tmptime))
        printwrite("===============")
        printwrite("\n")

printwrite("===============")
printwrite("===============")
printwrite("statistics")
printwrite("===============")
printwrite(str(loops) + " tries")
for oneurl in ['url1', 'url2']:
    printwrite (eval(oneurl + "_title") + ": " + str(sums[oneurl]/loops))
