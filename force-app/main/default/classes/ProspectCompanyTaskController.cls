public class ProspectCompanyTaskController {
    @AuraEnabled(cacheable=true)
     public static list<Company_Task__c> getProspectList(Id prospectId) {
        Date today = Date.today();
        list<Company_Task__c> prospectList = [SELECT Id, Name, Due_Date__c, Status__c FROM Company_Task__c where Status__c != 'Completed' AND Status__c != 'Closed' AND Due_Date__c = today AND Prospect__c  = :prospectId];
        return prospectList;
     }

}