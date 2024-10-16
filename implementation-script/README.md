# Python scripts for program and resource implementation

Python script to upload a program and add multiple resources like   Surveys , Observations (with and without rubrics) to it.
### Resource templates
- [Programs](https://github.com/ELEVATE-Project/samiksha-service/blob/main/implementation-script/sampleTempletes/ProgramTemplete.xlsx)

- [Surveys](https://github.com/ELEVATE-Project/samiksha-service/blob/main/implementation-script/sampleTempletes/SurveyTemplete.xlsx)
- [Observation with out rubrics](https://github.com/ELEVATE-Project/samiksha-service/blob/main/implementation-script/sampleTempletes/ObservationWithoutRubrics.xlsx)
- [Observation with rubrics](https://github.com/ELEVATE-Project/samiksha-service/blob/main/implementation-script/sampleTempletes/Copy%20of%20Observation%20with%20rubrics%20.xlsx)


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
for QA  python3 main.py --env qa --programFile ProgramTemplate.xlsx
This command will upload the program data from ProgramTemplate.xlsx to the QA environment. -for DEV  python3 main.py --env dev --programFile ProgramTemplate.xlsx
This command will upload the program data from ProgramTemplate.xlsx to the development environment. -for LOCAL  python3 main.py --env local --programFile ProgramTemplate.xlsx
This command will upload the program data from ProgramTemplate.xlsx to the local environment.

ii. For ResourceTemplate :

for QA  python3 main.py --env qa --resourceFile surveyTemplate.xlsx
This command will upload the resource (Survey, Observation) from surveyTemplate.xlsx to the QA environment.
 -for DEV  python3 main.py --env dev --resourceFile surveyTemplate.xlsx
This command will upload the resource (Survey, Observation) from surveyTemplate.xlsx to the development environment.
 -for LOCAL  python3 main.py --env local --resourceFile surveyTemplate.xlsx
This command will upload the (Survey, Observation) data from surveyTemplate.xlsx to the local environment. 