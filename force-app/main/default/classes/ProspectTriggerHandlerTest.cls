//  @Description      :- This is a Unit Test Class for ProspectTriggerHandler.
//  @ Author              :- Shashank Mall
// @ Group                :- Webvillee Technology pvt.ltd.
// @ Last Modifield on    :- 03-04-2023
// @ Last Modification by :- Shashank Mall
// @ Modification Log      - 

        


@isTest
private class ProspectTriggerHandlerTest {
    
    @testSetup
    static void setup() {
        list<Prospect__c> prospectList = new list<Prospect__c>();
        // Create a test record for Prospect__c
        for(integer i=0; i<200; i++){
            Prospect__c testProspect = new Prospect__c();
            testProspect.Name = 'Test Prospect';
            testProspect.Prospect_Status__c = 'New Prospect';
            testProspect.Prospect_Source__c ='Cold Call';
            testProspect.Technology__c = 'AWS';
            testProspect.Requirement_Type__c = 'On-site';
            testProspect.Email__c = 'shashankmall7@gmail.com';
            //  testProspect.RecordTypeId = Schema.SObjectType.Prospect__c.getRecordTypeInfosByName().get('Webvillee').getRecordTypeId());
            prospectList.add(testProspect);
        }
        insert prospectList;
    }
    
    @isTest
    static void testConvertToDealWithError() {
        // Set up test data
        Prospect__c testProspect = [SELECT Id, Prospect_Status__c, Company_Name__c, Company_Contact__c, RecordTypeId FROM Prospect__c LIMIT 1];
        testProspect.Prospect_Status__c = 'Convert to Deal';
        testProspect.Company_Name__c = null;
        testProspect.Company_Contact__c = null;
        // update testProspect;
        
        Test.startTest();
        Database.SaveResult  result = Database.update(testProspect, false);
        Test.stopTest();
        
        System.assert(!result.isSuccess());
        System.assert(result.getErrors().size() > 0);
        System.assertEquals('Cannot convert to Deal. Company Name and Contact fields cannot be null.',result.getErrors()[0].getMessage()); 
    }
    static testMethod void testConvertToDeal() {
        // Create a test record for Prospect__c
        Prospect__c testProspect = new Prospect__c();
        testProspect.Name = 'Test Prospect';
        testProspect.Prospect_Status__c = 'New Prospect';
        testProspect.Prospect_Source__c ='Cold Call';
        testProspect.Technology__c = 'AWS';
        testProspect.Requirement_Type__c = 'On-site';
        testProspect.Email__c = 'shashankmall7@gmail.com';
        insert testProspect;
        // inserting Company record:
        Company__c c = new Company__c();
        c.Name = 'Test Company';
        c.Company_Website__c = 'ApexHours.com';
        c.Company_Ownership__c = 'Other';
        c.Company_Type__c ='Vendor';
        c.Address__c = 'Test';
        c.City__c = 'Test';
        c.Country__c = 'Test';
        insert c;
        // inserting Company Contact record:
        Company_Contact__c cc = new Company_Contact__c();
        cc.Name = 'Test Contact';
        cc.Email__c = 'abc@gmail.com';
        cc.Company_Name__c = c.Id;
        cc.Mobile__c = '666666666';
        cc.Address__c = 'Test';
        cc.City__c = 'Test';
        cc.Country__c = 'Test';
        insert cc;
        
        // Update the Prospect record to trigger the after update event
        testProspect.Prospect_Status__c = 'Convert to Deal';
        testProspect.Company_Name__c = c.Id;
        testProspect.Company_Contact__c = cc.id;  
        Test.startTest();
        update testProspect;
        Test.stopTest();
        
        // Verify that a new Deal record is created
        List<Deal__c> deals = [SELECT Id, Company_Name__c, Name, Contact__c FROM Deal__c];
        System.debug('Deals: ' + deals);
        System.debug('Number of deals: ' + deals.size());
        System.assertEquals(1, deals.size());
    }
}