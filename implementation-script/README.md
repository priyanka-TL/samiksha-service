# Python scripts for program and resource implementation

Python script to upload a program and add multiple resources like Projects , Surveys , Observations (with and without rubrics) to it.

### Resource templates

- [Surveys](https://docs.google.com/spreadsheets/d/1iA0lm_jq0IAgrvZRed8Vdj3uVdtvKAqni-SshiPbCo4/edit?usp=share_link)
- [Observation with out rubrics](https://docs.google.com/spreadsheets/d/1SuVYi4jmTMKAxR3uK-OA5SmkagCBmZZpaazBAylyxuI/edit#gid=2105966740)
- [Observation with rubrics](https://docs.google.com/spreadsheets/d/18QOcMMszRatkKbbElMkrOn18ntbo6bkMwAB17UD5XKM/edit#gid=283741602)

  This are the sample files

## Initial steps to set up script in local

- Pull the code only from `master` branch.
- create a virtual environment in python.
  `python3 -m venv path/to/virtualEnv`
- Once the virtual environment is created, activate the virtual environment.
  In Linux
  `source { relative path to virtualEnv}/bin/activate`
  In Windows
  `{ relative path to virtualEnv}/Scripts/activate`
- Install all the dependencies using requirement.txt using following command.
  ` pip3 install -r requirement.txt`
- Make sure there are no errors in the install.
- If there are any errors in the install, try to install the same version of the libraries seperatly.
- make sure Google Sheet link should have view access to anyone with link
- Command to run the script.
  `python3 main.py --env {Environment Name} --resourceLinkOrExtPGM {Google Sheet link with all deatils of solution}`
  Example:
  `python3 main.py --env dev --resourceLinkOrExtPGM https://docs.google.com/spreadsheets/d/1fkEDShkMHChzjJonk7p5r0ib6nkSUYt2P0kS-Hyv-Qo/edit#gid=349978120`
