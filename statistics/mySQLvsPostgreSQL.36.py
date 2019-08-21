import requests, os, re
import urllib.parse
from pprint import pprint
import datetime

# pstring: what to print
# thiverbose: should the string be printed into logfile also
# newline: what is to be printed after the string (typically newline)
# printbefore: what is to be printed before string
def printwrite(pstring, thisverbose = 1, newline = "\n", printbefore = ""):
    f = open("statistics", "a")
    tmpstr = str(pstring)
    print(tmpstr)
    if thisverbose == 1:
        f.write(printbefore + tmpstr + newline)
    f.close();

url1_title = "mySQL"
url1 = "http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight_mysql"

url2_title = "postgreSQL"
url2 = "http://biosoda.expasy.org:8080/rdf4j-server/repositories/bgeelight_postgres"

header_title = "header"
header = "header"

intermed = "?query="
restofurl = "&format=JSON&limit=100&offset=0&inference=false"

# how many requests should be done:
loops = 10
# verbose means, that the logfile gets verbose. console is always verbose
verbose = 0

printwrite('urls: ' + url1 + '(' + url1_title + '), ' + url2 + '(' + url2_title + ')')
printwrite('Loops: ' + str(loops))
printwrite('queries all the .rq files for their bgee light part only')

# open statistics file
f = open("statistics", "w")
f.close()

# where to get the .rq files from
targetdir = '../rqWriter/rq/'
directory = os.fsencode(targetdir)

# initialise statistics variable
sums = {}

# looooop over files
for file in os.listdir(directory):
    filename = os.fsdecode(file)
    if filename.endswith(".rq"):
        printwrite("===============", 1, "\n", "\n")
        printwrite(filename)

        # prepare statistics
        sums[filename] = {}

        sums[filename]['header'] = {}
        sums[filename]['url1'] = {}
        sums[filename]['url2'] = {}

        sums[filename]['header']['total'] = 'total'
        sums[filename]['header']['avg'] = 'avg'
        sums[filename]['url1']['total'] = 0
        sums[filename]['url1']['avg'] = 0
        sums[filename]['url2']['total'] = 0
        sums[filename]['url2']['avg'] = 0

        printwrite("===============")
        tmpfile = open(targetdir + filename, 'r')
        tmpqueryonly = ""

        tmpquery = tmpfile.read()
        printwrite("===============", verbose)
        printwrite(tmpquery, verbose)

        # read prefixes from query
        tmpquerypre = re.search('(PREFIX[\w\W]*?)SELECT', tmpquery)
        if not tmpquerypre:
            continue
        tmpquerypre = tmpquerypre.group(1)
        tmpquerypre = tmpquerypre.replace('\n', ' ')
        tmpquerypre = tmpquerypre.replace('\t', ' ')
        printwrite("===============", verbose)
        printwrite(tmpquerypre, verbose)
        tmpquerypre = urllib.parse.quote(tmpquerypre)

        # read service part from query
        tmpqueryre = re.search('SERVICE.*<.*bgeelight[^>]*>[^>]{([^}]*})', tmpquery)
        if not tmpqueryre:
            continue
        tmpqueryonly = tmpqueryre.group(1)
        # if SERVICE has no SELECT, add it
        if tmpqueryonly.find('SELECT') == -1:
            tmpqueryonly = 'SELECT * WHERE { ' + tmpqueryonly
        tmpqueryonly = tmpqueryonly.replace('\n', ' ')
        tmpqueryonly = tmpqueryonly.replace('\t', ' ')
        printwrite("===============", verbose)
        printwrite(tmpqueryonly, verbose)
        tmpqueryonly = urllib.parse.quote(tmpqueryonly)

        for x in range(loops):
            # loop over different servers
            for oneurl in ['url1', 'url2']:

                # prepare URL
                tmpurl = eval(oneurl) + intermed + tmpquerypre + '%20' + tmpqueryonly + restofurl
                printwrite("===============", verbose)
                printwrite(tmpurl, verbose)

                # fetch result
                tmpres = requests.get(tmpurl, headers={'Cache-Control': 'no-cache'})

                printwrite("===============", verbose)
                printwrite(tmpres.text, verbose)
                tmptime = tmpres.elapsed.total_seconds()
                sums[filename][oneurl]['total'] = sums[filename][oneurl]['total'] + tmptime
                sums[filename]['header']['p' + str(x)] = x
                sums[filename][oneurl]['p' + str(x)] = str(tmptime)

                printwrite("===============", verbose)
                printwrite("\n", verbose)

                # calculate average
                sums[filename][oneurl]['avg'] = sums[filename][oneurl]['total']/loops

        # write single statistic to console
        printwrite("===============", 0, "\n", "\n")
        printwrite("===============", 0, "\n", "\n")
        printwrite("statistics")
        printwrite("===============")
        printwrite(str(loops) + " tries")
        for qnum, qnumdata in sums[filename].items():
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

for filename, filedata in sums.items():
    printwrite(filename)
    for qnum, qnumdata in sums[filename].items():
        printwrite(eval(qnum + '_title'), 1, ",")
        for point, pointdata in qnumdata.items():
            printwrite(pointdata, 1, ",")
        printwrite("", 1)

printwrite('### this statistics file ist created by bioSODA mySQLvsPostgreSQL.py (https://github.com/biosoda/bioquery/tree/master/statistics) - created at ' + datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
