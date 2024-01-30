Feature: User login

  User should be able to login to demoblaze web application
    @C1 @API-UI
    Scenario: User should be able to login to demoblaze web application
      Given User open the application home page
      When User clicks on Login option
      Then User enters username and password and click login
      Then User should get logged in succesfully
   
    @C3 @API-UI
    Scenario: User should be able to login to demoblaze web application using excel data
      Given User open the application home page
      When User clicks on Login option
      Then User login using "username" and "password" from following data:
        | filename       |   filepath                | header   |  cell        |
        |  sheet1        |   datainput/testdata.xlsx | username |  C(2)        |
        |  sheet1        |   datainput/testdata.xlsx | password |  D(2)        |

    @C4 @PDF
    Scenario: User checks dummy PDF Statment File in current working directory and validates the data
      Then User validates the data in a sample PDF



