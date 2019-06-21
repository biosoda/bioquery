# bioSODA - 2019.06.21
# read queries from live json and write them down one by one to single .rq files

# after: https://stackabuse.com/reading-and-writing-json-to-a-file-in-python/

import json

sourcefile = '../biosoda_frontend/src/biosodadata.json'
destinationpath = './'
with open(sourcefile) as json_file:
    data = json.load(json_file)
    for q in data['questions']:
        if 'SPARQL' in q: # todo: only create file when question has a target file name
            f = open(q['id'] + ".rq", "w") # todo: add target filename to json according to paper
            print('==')
            content = '';
            content = content + "\n" + '### id: ' + q['id']
            content = content + "\n" + '### handled by endpoint: ' + q['fetchUrlShort']
            # toto: add metrics and data from spread sheet
            content = content + "\n" + '### question: ' + q['question']
            content = content + "\n" + q['SPARQL'] # todo: has to be filled with appropriate default variable values
            content = content + "\n" + '### this .rq file ist created by bioSODA rqWriter'
            print(content)        
            f.write(content.strip())
            f.close()
        
