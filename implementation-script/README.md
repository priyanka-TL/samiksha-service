# Python scripts for program and resource implementation

Python script to upload a program and add multiple resources like   Surveys , Observations (with and without rubrics) to it.
### Resource templates
- [Programs](https://docs.google.com/spreadsheets/d/1Q4z1d1aUHY5VVrco2TvHPuWEq7314glUjFxB-jYjfiY/edit?usp=share_link)

- [Surveys](https://docs.google.com/spreadsheets/d/1iA0lm_jq0IAgrvZRed8Vdj3uVdtvKAqni-SshiPbCo4/edit?usp=share_link)
- [Observation with out rubrics](https://docs.google.com/spreadsheets/d/1uErekrCkuOXMdIvXsCSOr7YiBk4HcS4iJrh0tdALlsw/edit?usp=share_link)
- [Observation with rubrics](https://docs.google.com/spreadsheets/d/1doPfZrAlKc62E6YAS050E0keMyiPbDGLDQAjFNIn1AY/edit?usp=share_link)


## Initial steps to set up script in local
-Pull the code from latest release branch

 To clone the repository  git clone -b latestBranch <git-link>

-Navigate to samiksha-service/implementation-script folder  samiksha-service/implementation-script/main.py
- create a virtual environment in python.
``` python3 -m venv path/to/virtualEnv ```
- Once the virtual environment is created, activate the virtual environment.
In Linux
``` source { relative path to virtualEnv}/bin/activate ```
In Windows
``` { relative path to virtualEnv}/Scripts/activate ```
- Install all the dependencies using requirement.txt using following command. 
```  pip3 install -r requirement.txt ```
- Make sure there are no errors in the install.
- If there are any errors in the install, try to install the same version of the libraries seperatly.
- Download the user given template and save it in the same file where the code is hosted.
- Command to run the script.
```  python3 main.py --env dev --programFile input.xlsx ```
We have ```dev ``` and ``` development ``` as environment.

i. For programTemplate :
for QA  python3 main.py --env QA --programFile ProgramTemplate.xlsx
This command will upload the program data from ProgramTemplate.xlsx to the QA environment. -for DEV  python3 main.py --env dev --programFile ProgramTemplate.xlsx
This command will upload the program data from ProgramTemplate.xlsx to the development environment. -for LOCAL  python3 main.py --env local --programFile ProgramTemplate.xlsx
This command will upload the program data from ProgramTemplate.xlsx to the local environment. ii. For projectTemplate : -for QA  python3 main.py --QA --project ProjectTemplate.xlsx

ii. For ResourceTemplate :

for QA  python3 main.py --env QA --resourceFile surveyTemplate.xlsx
This command will upload the resource (Survey, Observation) from surveyTemplate.xlsx to the QA environment.
 -for DEV  python3 main.py --env dev --resourceFile surveyTemplate.xlsx
This command will upload the resource (Survey, Observation) from surveyTemplate.xlsx to the development environment.
 -for LOCAL  python3 main.py --env local --resourceFile surveyTemplate.xlsx
This command will upload the (Survey, Observation) data from surveyTemplate.xlsx to the local environment. 