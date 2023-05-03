/*  @Description      :- This is a Apex Method that shows no. of task pending for today. And on a click of a button you can change your task stage.
  @ Author              :- Kavya Kothari
 @ Group                :- Webvillee Technology pvt.ltd.
 @ Last Modifield on    :- 10-04-2023
 @ Last Modification by :- Shashank
 @ Modification Log      - 
 Version           Date         Author         Modification
// 1.              10-04-2023   Kavya       Add the update and Onclick Event
// 2.              10-04-2023   Shashank    Added a method getCompanyTaskList()  
 */
public with sharing class CompanyTaskController {
    public static list<Company_Task__c> callTaskList = new List<Company_Task__c>();
    public static list<Company_Task__c> meetingAndInterviewTaskList = new List<Company_Task__c>();
    public static list<Company_Task__c> emailTaskList = new List<Company_Task__c>();
    public static list<Company_Task__c> followupTaskList = new List<Company_Task__c>();
    public static list<Company_Task__c> trackCompanyActiveOrNotTaskList = new List<Company_Task__c>();

    public CompanyTaskController() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Company_Task__c> getTask(){
        try {
              return[Select Id ,Status__c,Subject__c,Due_Date__c,Priority__c,Name  from Company_Task__c];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static List<Company_Task__c> getCallTaskList(){
        try {
            callTaskList = [Select Id ,Status__c,Subject__c,Due_Date__c,Priority__c,Name from Company_Task__c where Subject__c = 'Call'];
            return callTaskList;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
     public static List<Company_Task__c> getCompanyTaskList() {
        Date today = Date.today();
        List<Company_Task__c> taskList = [SELECT Id, Name, Due_Date__c, Status__c FROM Company_Task__c WHERE Due_Date__c = :today];
        return taskList;
     }
    // this method is use to get the record from task where subject is call and related to the prospect 
     @AuraEnabled(cacheable=true)
     public static List<Company_Task__c> getTaskSubject() {
  
        List<Company_Task__c> tasksubject = [SELECT Id,Name, Subject__c, Status__c,Description__c, Prospect__r.Name, Deal__r.Name FROM Company_Task__c where Subject__c = 'Call' AND Status__c != 'Completed' AND Status__c != 'Closed'];
        return tasksubject;
            }
    @AuraEnabled(cacheable=true)
     public static List<Company_Task__c> getTaskSubjectEmail() {
  
        List<Company_Task__c> tasksubject = [SELECT Id,Name, Subject__c,Description__c, Prospect__r.Name, Deal__r.Name FROM Company_Task__c where Subject__c = 'Email'];
        return tasksubject;
            }
    @AuraEnabled(cacheable=true)
     public static List<Company_Task__c> getTaskSubjectInterview() {
  
        List<Company_Task__c> tasksubject = [SELECT Id,Name, Subject__c,Description__c, Prospect__r.Name, Deal__r.Name FROM Company_Task__c where Subject__c = 'Interview'];
        return tasksubject;
            }

    @AuraEnabled(cacheable=true)
     public static List<Company_Task__c> getTaskSubjectMeeting() {
  
        List<Company_Task__c> tasksubjectMeeting = [SELECT Id,Name, Subject__c,Description__c, Prospect__r.Name, Deal__r.Name FROM Company_Task__c where Subject__c = 'Meeting'];
        return tasksubjectMeeting;
            }

     @AuraEnabled(cacheable=true)
            public static List<Company_Task__c> getTaskSubjectRequirement() {
         
        List<Company_Task__c> tasksubjectRequirement = [SELECT Id,Name, Subject__c,Description__c, Prospect__r.Name, Deal__r.Name FROM Company_Task__c where Subject__c = 'Requirement'];
        return tasksubjectRequirement;
                   }   


    @AuraEnabled
    public static string updateTaskDescription(object data ) {
        
        List <Company_Task__c> taskForUpdate = ( List < Company_Task__c > ) JSON.deserialize( JSON.serialize( data ),
            List < Company_Task__c >.class);
        try {
            update taskForUpdate;
            return 'Success:  updated successfully';
        }
        catch (Exception e) {
            return 'The following exception has occurred: ' + e.getMessage();
        }

    }
}