public class CompanyTaskControler {
     @AuraEnabled(cacheable=true)
     public static List<Company_Task__c> getCompanyTaskList() {
        Date today = Date.today();
        List<Company_Task__c> taskList = [SELECT Id, Name, Due_Date__c, Status__c FROM Company_Task__c WHERE Due_Date__c = :today];
        return taskList;
     }
}