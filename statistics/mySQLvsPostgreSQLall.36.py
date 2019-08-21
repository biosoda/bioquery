import requests, os, re, json
import urllib.parse
from pprint import pprint
import datetime

url0 = 'http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight'

url1_title = "mySQL"
url1 = "http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight_mysql"

url2_title = "postgreSQL"
url2 = "http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight_postgres"

header_title = "header"
header = "header"

intermed = "?query="
restofurl = "&format=JSON&limit=100&offset=0&inference=false"

# the separator we use in our json
separator = '$$'

# add inner limits? leave an empty string if no limits are wanted
addlimits = 'LIMIT 10'

# how many requests should be done:
loops = 3
# verbose means, that the logfile gets verbose. console is always verbose
verbose = 0

# open statistics file
f = open("statisticsall", "w")
f.close()

# pstring: what to print
# thiverbose: should the string be printed into logfile also
# newline: what is to be printed after the string (typically newline)
# printbefore: what is to be printed before string
def printwrite(pstring, thisverbose = 1, newline = "\n", printbefore = ""):
    f = open("statisticsall", "a")
    tmpstr = str(pstring)
    print(tmpstr)
    if thisverbose == 1:
        f.write(printbefore + tmpstr + newline)
    f.close();

# where to get the .rq files from
targetfile = '../biosoda_frontend/src/biosodadata.json'

# initialise statistics variable
sums = {}

printwrite('LIMITS: ' + addlimits)
printwrite('url0, 1, 2: ' + url0 + ', ' + url1 + ' (' + url1_title + '), ' + url2 + ' (' + url2_title + ')')
printwrite('Loops: ' + str(loops))

with open(targetfile) as jsondata:
    data = json.load(jsondata)
    for onequery in data['questions']:
        printwrite("===============", 1, "\n", "\n")
        queryid = onequery['id']
        printwrite(queryid)

        if not queryid == 'uniprotQ3':
            nodebug = 1
            # continue # debug only

        if not 'SPARQL' in onequery:
            printwrite('no query')
            continue

        # prepare statistics
        sums[queryid] = {}

        sums[queryid]['header'] = {}
        sums[queryid]['url1'] = {}
        sums[queryid]['url2'] = {}

        sums[queryid]['header']['total'] = 'total'
        sums[queryid]['header']['avg'] = 'avg'
        sums[queryid]['url1']['total'] = 0
        sums[queryid]['url1']['avg'] = 0
        sums[queryid]['url2']['total'] = 0
        sums[queryid]['url2']['avg'] = 0

        printwrite("===============")
        printwrite(onequery['SPARQL'], verbose)

        tmpSPARQL = onequery['SPARQL']
        tmpfetchurl = onequery['fetchUrl']

        if (not tmpSPARQL.find('bgeelight') and not tmpfetchurl.find('bgeelight')):
            printwrite('no bgee involved')
            continue

        tmpQuestion = onequery['question']
        for onevariable in onequery['vars']:
            tmptoken = separator + onevariable['name'] + separator
            if 'defaultvalue' in onevariable:
                tmpSPARQL = tmpSPARQL.replace(tmptoken, onevariable['defaultvalue'])
            else:
                tmpSPARQL = tmpSPARQL.replace(tmptoken, onevariable['default'])
            tmpQuestion = tmpQuestion.replace(tmptoken, onevariable['default'])
        tmpSPARQL = tmpSPARQL.replace(separator + 'innerlimit' + separator, ' ' + addlimits + ' ')

        for x in range(loops):
            # loop over different servers
            for oneurl in ['url1', 'url2']:

                # prepare URL

                tmpThisSPARQL = tmpSPARQL.replace(url0, eval(oneurl))
                tmpFetchURL = onequery['fetchUrlShort'].replace(url0, eval(oneurl))
                printwrite("===============", verbose)
                printwrite(tmpThisSPARQL, verbose)
                tmpThisSPARQL = re.sub('#[^>\n]+\n', '\n', tmpThisSPARQL)
                printwrite("===============", verbose)
                printwrite(tmpThisSPARQL, verbose)
                tmpThisSPARQL = tmpThisSPARQL.replace('\n', ' ')
                tmpThisSPARQL = tmpThisSPARQL.replace('\t', ' ')
                tmpThisSPARQL = urllib.parse.quote_plus(tmpThisSPARQL)

                tmpurl = tmpFetchURL + intermed + tmpThisSPARQL + restofurl
                printwrite("===============", verbose)
                printwrite(tmpurl, verbose)

                # fetch result
                tmpres = requests.get(tmpurl, headers={'Cache-Control': 'no-cache'})

                printwrite("===============", verbose)
                printwrite(tmpres.text, verbose)
                tmptime = tmpres.elapsed.total_seconds()
                sums[queryid][oneurl]['total'] = sums[queryid][oneurl]['total'] + tmptime
                sums[queryid]['header']['p' + str(x)] = x
                sums[queryid][oneurl]['p' + str(x)] = str(tmptime)

                printwrite("===============", verbose)
                printwrite("\n", verbose)

                # calculate average
                sums[queryid][oneurl]['avg'] = sums[queryid][oneurl]['total']/loops

        # write single statistic to console
        printwrite("===============", 0, "\n", "\n")
        printwrite("===============", 0, "\n", "\n")
        printwrite("statistics")
        printwrite("===============")
        printwrite(str(loops) + " tries")
        for qnum, qnumdata in sums[queryid].items():
            printwrite("", 1)
            printwrite(eval(qnum + '_title'), 1, ",")
            for point, pointdata in qnumdata.items():
                printwrite(pointdata, 1, ",")
        printwrite("", 1)
        # break # used for debugging

# full statistic at the end
printwrite("===============")
printwrite("fullstat")
printwrite("===============")

for queryid, filedata in sums.items():
    printwrite(queryid)
    for qnum, qnumdata in sums[queryid].items():
        printwrite(eval(qnum + '_title'), 1, ",")
        for point, pointdata in qnumdata.items():
            printwrite(pointdata, 1, ",")
        printwrite("", 1)

printwrite('### this statistics file ist created by bioSODA mySQLvsPostgreSQLall.py (https://github.com/biosoda/bioquery/tree/master/statistics) - created at ' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
