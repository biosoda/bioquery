# bioSODA - 2019.06.21
# read queries from live json and write them down one by one to single .rq files

# after: https://stackabuse.com/reading-and-writing-json-to-a-file-in-python/

import json
import sys
import os
from os import listdir
from datetime import datetime

sourcefile = '../biosoda_frontend/src/biosodadata.json'
destinationpath = './rq'

separator = '$$'

# remove all query files
allfiles = os.listdir(destinationpath)
for onefile in allfiles:
    if onefile.endswith(".rq"):
        os.remove(os.path.join(destinationpath, onefile))

with open(sourcefile) as json_file:
    data = json.load(json_file)
    now = datetime.now()
    for q in data['questions']:
        if 'rqid' in q: # todo: only create file when question has a target file name
            f = open(destinationpath + '/' + q['rqid'] + ".rq", "w") # todo: add target filename to json according to paper
            tmpSPARQL = q['SPARQL']
            tmpQuestion = q['question']
            for onevariable in q['vars']:
                tmptoken = separator + onevariable['name'] + separator
                tmpSPARQL = tmpSPARQL.replace(tmptoken, onevariable['default'])
                tmpQuestion = tmpQuestion.replace(tmptoken, onevariable['default'])
            tmpSPARQL = tmpSPARQL.replace(separator + 'innerlimit' + separator, 'LIMIT 10')
            print('==')
            content = '';
            content = content + "\n" + '### Id: ' + q['rqid']
            content = content + "\n" + '### Handled by endpoint: ' + q['fetchUrlShort']
            # toto: add metrics and data from spread sheet
            content = content + "\n" + '### Question: ' + tmpQuestion
            content = content + "\n" + '### Query characteristics (BGP, basic graph pattern): ' + q['characteristics']
            content = content + "\n" + '### Number of results: ' + q['numberresults']
            content = content + "\n" + '### Result example: ' + q['resultsexample']
            content = content + "\n" + tmpSPARQL
            content = content + "\n" + '### this .rq file ist created by bioSODA rqWriter (https://github.com/biosoda/bioquery/tree/master/rqWriter) - created at ' + now.strftime("%Y-%m-%d %H:%M:%S")
            # print(content)        
            f.write(content.strip())
            f.close()
        
