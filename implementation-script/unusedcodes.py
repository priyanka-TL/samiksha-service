# Open and validate program sheet 
def programsFileCheck(filePathAddPgm, accessToken, parentFolder, MainFilePath):
    program_file = filePathAddPgm
    # open excel file 
    wbPgm = xlrd.open_workbook(filePathAddPgm, on_demand=True)
    global programNameInp
    sheetNames = wbPgm.sheet_names()
    # list of sheets in the program sheet 
    pgmSheets = ["Instructions", "Program Details", "Resource Details","Program Manager Details"]

    # checking the sheets in the program sheet 
    if (len(sheetNames) == len(pgmSheets)) and ((set(sheetNames) == set(pgmSheets))):
        print("--->Program Template detected.<---")
        # iterate through the sheets 
        for sheetEnv in sheetNames:

            if sheetEnv == "Instructions":
                # skip Instructions sheet 
                pass
            elif sheetEnv.strip().lower() == 'program details':
                print("--->Checking Program details sheet...")
                detailsEnvSheet = wbPgm.sheet_by_name(sheetEnv)
                keysEnv = [detailsEnvSheet.cell(1, col_index_env).value for col_index_env in
                           range(detailsEnvSheet.ncols)]
                for row_index_env in range(2, detailsEnvSheet.nrows):
                    dictDetailsEnv = {keysEnv[col_index_env]: detailsEnvSheet.cell(row_index_env, col_index_env).value
                                      for
                                      col_index_env in range(detailsEnvSheet.ncols)}
                    programNameInp = dictDetailsEnv['Title of the Program'].encode('utf-8').decode('utf-8') if dictDetailsEnv['Title of the Program'] else terminatingMessage("\"Title of the Program\" must not be Empty in \"Program details\" sheet")
                    extIdPGM = dictDetailsEnv['Program ID'].encode('utf-8').decode('utf-8') if dictDetailsEnv['Program ID'] else terminatingMessage("\"Program ID\" must not be Empty in \"Program details\" sheet")
                    returnvalues = []
                    global entitiesPGM
                    entitiesPGM = dictDetailsEnv['Targeted state at program level'].encode('utf-8').decode('utf-8') if dictDetailsEnv['Targeted state at program level'] else terminatingMessage("\"Targeted state at program level\" must not be Empty in \"Program details\" sheet")
                    districtentitiesPGM = dictDetailsEnv['Targeted district at program level'].encode('utf-8').decode('utf-8')
                    global startDateOfProgram, endDateOfProgram
                    startDateOfProgram = dictDetailsEnv['Start date of program']
                    endDateOfProgram = dictDetailsEnv['End date of program']
                    # checking resource types and calling relevant functions 
                    # if startDateOfProgram:
                    #     startDateArr = str(startDateOfProgram).split("-")
                    #     bodySolutionUpdate = {"startDate": startDateArr[2] + "-" + startDateArr[1] + "-" + startDateArr[0] + "T00:00:00.000Z"}
                    #     solutionUpdate(parentFolder, accessToken, coursemapping, bodySolutionUpdate)
                    # if endDateOfProgram:
                    #     endDateArr = str(endDateOfProgram).split("-")
                    #     bodySolutionUpdate = {"endDate": endDateArr[2] + "-" + endDateArr[1] + "-" + endDateArr[0] + "T23:59:59.000Z"}
                    global scopeEntityType
                    scopeEntityType = "state"


                    if districtentitiesPGM:
                        entitiesPGM = districtentitiesPGM
                        EntityType = "district"
                    else:
                        entitiesPGM = entitiesPGM
                        EntityType = "state"

                    scopeEntityType = EntityType

                    global entitiesPGMID
                    entitiesPGMID = fetchEntityId(parentFolder, accessToken,
                                                  entitiesPGM.lstrip().rstrip().split(","), scopeEntityType)
                    global orgIds
                    if environment == "staging":
                        orgIds = "01269934121990553633"
                    elif environment == "dev":
                        orgIds = "0137541424673095687"
                    else:
                        orgIds=fetchOrgId(environment, accessToken, parentFolder, OrgName)


                    if not getProgramInfo(accessToken, parentFolder, programNameInp.encode('utf-8').decode('utf-8')):
                        extIdPGM = dictDetailsEnv['Program ID'].encode('utf-8').decode('utf-8') if dictDetailsEnv['Program ID'] else terminatingMessage("\"Program ID\" must not be Empty in \"Program details\" sheet")
                        if str(dictDetailsEnv['Program ID']).strip() == "Do not fill this field":
                            terminatingMessage("change the program id")
                        descriptionPGM = dictDetailsEnv['Description of the Program'].encode('utf-8').decode('utf-8') if dictDetailsEnv[
                            'Description of the Program'] else terminatingMessage(
                            "\"Description of the Program\" must not be Empty in \"Program details\" sheet")
                        keywordsPGM = dictDetailsEnv['Keywords'].encode('utf-8').decode('utf-8')
                        entitiesPGM = dictDetailsEnv['Targeted state at program level'].encode('utf-8').decode('utf-8') if dictDetailsEnv['Targeted state at program level'] else terminatingMessage("\"Targeted state at program level\" must not be Empty in \"Program details\" sheet")
                        districtentitiesPGM = dictDetailsEnv['Targeted district at program level'].encode('utf-8').decode('utf-8')
                        # selecting entity type based on the users input 
                        if districtentitiesPGM:
                            entitiesPGM = districtentitiesPGM
                            EntityType = "district"
                        else:
                            entitiesPGM = entitiesPGM
                            EntityType = "state"

                        scopeEntityType = EntityType

                        mainRole = dictDetailsEnv['Targeted role at program level'] if dictDetailsEnv['Targeted role at program level'] else terminatingMessage("\"Targeted role at program level\" must not be Empty in \"Program details\" sheet")
                        global rolesPGM
                        rolesPGM = dictDetailsEnv['Targeted subrole at program level'] if dictDetailsEnv['Targeted subrole at program level'] else terminatingMessage("\"Targeted subrole at program level\" must not be Empty in \"Program details\" sheet")
                        
                        if "teacher" in mainRole.strip().lower():
                            rolesPGM = str(rolesPGM).strip() + ",TEACHER"
                        userDetails = fetchUserDetails(environment, accessToken, dictDetailsEnv['Diksha username/user id/email id/phone no. of Program Designer']).encode('utf-8').decode('utf-8')
                        creatorKeyCloakId = userDetails[0]
                        creatorName = userDetails[2]
                        
                        messageArr = []

                        scopeEntityType = EntityType
                        # fetch entity details 
                        entitiesPGMID = fetchEntityId(parentFolder, accessToken,entitiesPGM.lstrip().rstrip().split(","), scopeEntityType)
                        
                        # sys.exit()
                        # fetch sub-role details 
                        rolesPGMID = fetchScopeRole(parentFolder, accessToken, rolesPGM.lstrip().rstrip().split(","))
                        
                        # sys.exit()

                        # call function to create program 
                        programCreation(accessToken, parentFolder, extIdPGM, programNameInp, descriptionPGM,keywordsPGM.lstrip().rstrip().split(","), entitiesPGMID, rolesPGMID, orgIds,creatorKeyCloakId, creatorName,entitiesPGM,mainRole,rolesPGM)
                        # sys.exit()
                        programmappingpdpmsheetcreation(MainFilePath, accessToken, program_file, extIdPGM,parentFolder)

                        # map PM / PD to the program 
                        Programmappingapicall(MainFilePath, accessToken, program_file,parentFolder)

                        # check if program is created or not 
                        if getProgramInfo(accessToken, parentFolder, extIdPGM):
                            print("Program Created SuccessFully.")
                        else :
                            terminatingMessage("Program creation failed! Please check logs.")

            elif sheetEnv.strip().lower() == 'resource details':
                # checking Resource details sheet 
                print("--->Checking Resource Details sheet...")
                detailsEnvSheet = wbPgm.sheet_by_name(sheetEnv)
                keysEnv = [detailsEnvSheet.cell(1, col_index_env).value for col_index_env in
                           range(detailsEnvSheet.ncols)]
                # iterate through each row in Resource Details sheet and validate 
                for row_index_env in range(2, detailsEnvSheet.nrows):
                    dictDetailsEnv = {keysEnv[col_index_env]: detailsEnvSheet.cell(row_index_env, col_index_env).value
                                      for
                                      col_index_env in range(detailsEnvSheet.ncols)}
                    resourceNamePGM = dictDetailsEnv['Name of resources in program'].encode('utf-8').decode('utf-8') if dictDetailsEnv['Name of resources in program'] else terminatingMessage("\"Name of resources in program\" must not be Empty in \"Resource Details\" sheet")
                    resourceTypePGM = dictDetailsEnv['Type of resources'].encode('utf-8').decode('utf-8') if dictDetailsEnv['Type of resources'] else terminatingMessage("\"Type of resources\" must not be Empty in \"Resource Details\" sheet")
                    resourceLinkOrExtPGM = dictDetailsEnv['Resource Link']
                    resourceStatusOrExtPGM = dictDetailsEnv['Resource Status'] if dictDetailsEnv['Resource Status'] else terminatingMessage("\"Resource Status\" must not be Empty in \"Resource Details\" sheet")
                    # setting start and end dates globally. 
                    global startDateOfResource, endDateOfResource
                    startDateOfResource = dictDetailsEnv['Start date of resource']
                    endDateOfResource = dictDetailsEnv['End date of resource']
                    # checking resource types and calling relevant functions 
                    if resourceTypePGM.lstrip().rstrip().lower() == "course":
                        coursemapping = courseMapToProgram(accessToken, resourceLinkOrExtPGM, parentFolder)
                        if startDateOfResource:
                            startDateArr = str(startDateOfResource).split("-")
                            bodySolutionUpdate = {"startDate": startDateArr[2] + "-" + startDateArr[1] + "-" + startDateArr[0] + "T00:00:00.000Z"}
                            solutionUpdate(parentFolder, accessToken, coursemapping, bodySolutionUpdate)
                        if endDateOfResource:
                            endDateArr = str(endDateOfResource).split("-")
                            bodySolutionUpdate = {
                                "endDate": endDateArr[2] + "-" + endDateArr[1] + "-" + endDateArr[0] + "T23:59:59.000Z"}
                            solutionUpdate(parentFolder, accessToken, coursemapping, bodySolutionUpdate)
   

def generateAccessToken(solutionName_for_folder_path):
    # production search user api - start
    headerKeyClockUser = {'Content-Type': config.get(environment, 'keyclockAPIContent-Type')}
    
    responseKeyClockUser = requests.post(url=config.get(environment, 'host') + config.get(environment, 'keyclockAPIUrl'), headers=headerKeyClockUser,
                                         data=config.get(environment, 'keyclockAPIBody'))
    messageArr = []
    messageArr.append("URL : " + str(config.get(environment, 'keyclockAPIUrl')))
    messageArr.append("Body : " + str(config.get(environment, 'keyclockAPIBody')))
    messageArr.append("Status Code : " + str(responseKeyClockUser.status_code))
    if responseKeyClockUser.status_code == 200:
        responseKeyClockUser = responseKeyClockUser.json()
        accessTokenUser = responseKeyClockUser['access_token']
        messageArr.append("Acccess Token : " + str(accessTokenUser))
        createAPILog(solutionName_for_folder_path, messageArr)
        fileheader = ["Access Token","Access Token succesfully genarated","Passed"]
        apicheckslog(solutionName_for_folder_path,fileheader)
        print("--->Access Token Generated!")
        return accessTokenUser
    
    print("Error in generating Access token")
    print("Status code : " + str(responseKeyClockUser.status_code))
    createAPILog(solutionName_for_folder_path, messageArr)
    fileheader = ["Access Token", "Error in generating Access token", "Failed",responseKeyClockUser.status_code+"Check access token api"]
    apicheckslog(solutionName_for_folder_path, fileheader)
    fileheader = ["Access Token", "Error in generating Access token", "Failed","Check Headers of api"]
    apicheckslog(solutionName_for_folder_path, fileheader)
    terminatingMessage("Please check API logs.")


    # Function to search for programs
def getProgramInfo(accessTokenUser, solutionName_for_folder_path, programNameInp):
    global programID, programExternalId, programDescription, isProgramnamePresent, programName
    programName = programNameInp
    programUrl = config.get(environment, 'INTERNAL_KONG_IP') + config.get(environment, 'fetchProgramInfoApiUrl') + programNameInp.lstrip().rstrip()
    terminatingMessage
    headersProgramSearch = {'Authorization': config.get(environment, 'Authorization'),
                            'Content-Type': 'application/json', 'X-authenticated-user-token': accessTokenUser,
                            'internal-access-token': config.get(environment, 'internal-access-token')}
    responseProgramSearch = requests.post(url=programUrl, headers=headersProgramSearch)
    messageArr = []

    messageArr.append("Program Search API")
    messageArr.append("URL : " + programUrl)
    messageArr.append("Status Code : " + str(responseProgramSearch.status_code))
    messageArr.append("Response : " + str(responseProgramSearch.text))
    createAPILog(solutionName_for_folder_path, messageArr)
    messageArr = []
    if responseProgramSearch.status_code == 200:
        print('--->Program fetch API Success')
        messageArr.append("--->Program fetch API Success")
        responseProgramSearch = responseProgramSearch.json()
        countOfPrograms = len(responseProgramSearch['result']['data'])
        messageArr.append("--->Program Count : " + str(countOfPrograms))
        if countOfPrograms == 0:
            messageArr.append("No program found with the name : " + str(programName.lstrip().rstrip()))
            messageArr.append("******************** Preparing for program Upload **********************")
            print("No program found with the name : " + str(programName.lstrip().rstrip()))
            print("******************** Preparing for program Upload **********************")
            createAPILog(solutionName_for_folder_path, messageArr)
            fileheader = ["Program name fetch","Successfully fetched program name","Passed"]
            apicheckslog(solutionName_for_folder_path,fileheader)
            return False
        else:
            getProgramDetails = []
            for eachPgm in responseProgramSearch['result']['data']:
                if eachPgm['isAPrivateProgram'] == False:
                    programID = eachPgm['_id']
                    programExternalId = eachPgm['externalId']
                    programDescription = eachPgm['description']
                    isAPrivateProgram = eachPgm['isAPrivateProgram']
                    getProgramDetails.append([programID, programExternalId, programDescription, isAPrivateProgram])
                    if len(getProgramDetails) == 0:
                        print("Total " + str(len(getProgramDetails)) + " backend programs found with the name : " + programName.lstrip().rstrip())
                        messageArr.append("Total " + str(len(getProgramDetails)) + " backend programs found with the name : " + programName.lstrip().rstrip())
                        createAPILog(solutionName_for_folder_path, messageArr)
                        fileheader = ["program find api is running","found"+str(len(
                            getProgramDetails))+"programs in backend","Failed","found"+str(len(
                            getProgramDetails))+"programs ,check logs"]
                        apicheckslog(solutionName_for_folder_path,fileheader)
                        terminatingMessage("Aborting...")
                    elif len(getProgramDetails) > 1:
                        print("Total " + str(len(getProgramDetails)) + " backend programs found with the name : " + programName.lstrip().rstrip())
                        messageArr.append("Total " + str(len(getProgramDetails)) + " backend programs found with the name : " + programName.lstrip().rstrip())
                        createAPILog(solutionName_for_folder_path, messageArr)
                        terminatingMessage("Aborting...")

                    else:
                        programID = getProgramDetails[0][0]
                        programExternalId = getProgramDetails[0][1]
                        programDescription = getProgramDetails[0][2]
                        isAPrivateProgram = getProgramDetails[0][3]
                        isProgramnamePresent = True
                        messageArr.append("programID : " + str(programID))
                        messageArr.append("programExternalId : " + str(programExternalId))
                        messageArr.append("programDescription : " + str(programDescription))
                        messageArr.append("isAPrivateProgram : " + str(isAPrivateProgram))
                    createAPILog(solutionName_for_folder_path, messageArr)
    else:
        print("Program search API failed...")
        print(responseProgramSearch)
        messageArr.append("Program search API failed...")
        createAPILog(solutionName_for_folder_path, messageArr)
        terminatingMessage("Response Code : " + str(responseProgramSearch.status_code))
    return True
