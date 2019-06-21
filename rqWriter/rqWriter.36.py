# bioSODA - 2019.06.21
# read queries from live json and write them down one by one to single .rq files

# after: https://stackabuse.com/reading-and-writing-json-to-a-file-in-python/

import json

sourcefile = '../biosoda_frontend/src/biosodadata.json'
destinationpath = './'
with open(sourcefile) as json_file:
    data = json.load(json_file)
    for q in data['questions']:
        print('==')
        print('id: ' + q['id'])
        
