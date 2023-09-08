# Python scripts for program and resource implementation

Python script to upload a program and add multiple resources like Projects , Surveys , Observations (with and without rubrics) to it.
### Resource templates
- [Programs](https://docs.google.com/spreadsheets/d/1Q4z1d1aUHY5VVrco2TvHPuWEq7314glUjFxB-jYjfiY/edit?usp=share_link)
- [Projects](https://docs.google.com/spreadsheets/d/1YnWTcHrmvDYVedGktKr2V25G7qBNUmYjwk1huHwGwNc/edit?usp=share_link)
- [Surveys](https://docs.google.com/spreadsheets/d/1iA0lm_jq0IAgrvZRed8Vdj3uVdtvKAqni-SshiPbCo4/edit?usp=share_link)
- [Observation with out rubrics](https://docs.google.com/spreadsheets/d/1uErekrCkuOXMdIvXsCSOr7YiBk4HcS4iJrh0tdALlsw/edit?usp=share_link)
- [Observation with rubrics](https://docs.google.com/spreadsheets/d/1doPfZrAlKc62E6YAS050E0keMyiPbDGLDQAjFNIn1AY/edit?usp=share_link)
- [Observation with rubrics with IMPs](https://docs.google.com/spreadsheets/d/1GL_vImNemnBEaMRL64dOpul3Xc5-WKAV7S-pY2tmx6k/edit?usp=share_link)

To know more about the resources : https://diksha.gov.in/help/getting-started/explore-diksha/index.html
## Initial steps to set up script in local

- Pull the code only from ```master``` branch.
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
```  python3 main.py --env pre-prod --programFile input.xlsx ```
We have ``` pre-prod ``` and ``` production ``` as environment.
