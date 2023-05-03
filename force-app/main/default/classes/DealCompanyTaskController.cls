public class DealCompanyTaskController {
    @AuraEnabled(cacheable=true)
     public static list<Company_Task__c> getDealList(Id dealId) {
        Date today = Date.today();
        list<Company_Task__c> dealList = [SELECT Id, Name, Due_Date__c, Status__c FROM Company_Task__c where Status__c != 'Completed' AND Status__c != 'Closed' AND Due_Date__c = today AND Deal__c  = :dealId];
        return dealList;
     }

}