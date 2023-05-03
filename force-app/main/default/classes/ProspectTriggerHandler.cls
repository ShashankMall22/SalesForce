//  @Description      :- This is a Component that used for the Update Followup indicator and open model and record form onclick event
//  @ Author              :- Narendra Narole
// @ Group                :- Webvillee Technology pvt.ltd.
// @ Last Modifield on    :- 30-03-2023
// @ Last Modification by :- 
// @ Modification Log      - 
// Version           Date      Author         Modification
// 1              29/30-03-2023   Narendra       Written  before update and After update Trigger for Prospect__c for creating new Deal record
// 2              30-03-2023      Kavya          issue related with RecordType resolved by Kavya 
// 3			  10-03-2023      Narendra       Working on Related Records of Prospect to pass on to newly created Deal Records.
// 				  11-03-2023	  Narendra		 Facing Issues in Logic 
// 4			  12-03-2023	  Kavya          Issues Resolved by Kavya ,completed the ProspectTrigger 
// Trigger on Prospect__c ,
// Before update Event-  will validte whether Company_Name__c and Company_Contact__c are avialabel or not 

// After update Event- It is written for creating a new Deal and deleting the Corresponding Prospect Record



public class ProspectTriggerHandler {
    
    //static method for before update ,Check for Company Name and Contact before creating new Deal
    public static void handleBeforeConvertToDeal(List<Prospect__c> prospects) {
        Map<Id, Prospect__c> prospectMap = new Map<Id, Prospect__c>(prospects);
        Map<Id, Deal__c> dealMap = new Map<Id, Deal__c>();
        List<Deal__c> dealsToCreate = new List<Deal__c>();
        List<Follow_Up__c> followUpsToUpdate = new List<Follow_Up__c>();
        List<Company_Task__c> tasksToUpdate = new List<Company_Task__c>();
        
        for (Prospect__c prospect : prospects) {
            
                if (prospect.Prospect_Status__c == 'Convert to Deal'){
                     system.debug('##Prospect Id'+prospect);
                     if (prospect.Company_Name__c == null || prospect.Company_Contact__c == null || prospect.RecordTypeId == null  ) {
                        system.debug('##Prospect Id 22');
                        prospect.Company_Name__c.addError('Cannot convert to Deal. Company Name and Contact fields cannot be null.');
                    }else {                
        // Create a new Deal record
                        Deal__c newDeal = new Deal__c();
                        
                        // Set the field values on the new Deal record
                        newDeal.Company_Name__c = prospect.Company_Name__c;
                        newDeal.Name = prospect.Name ;
                        newDeal.Contact__c = prospect.Company_Contact__c; 
                        newDeal.Prospect_Source__c = prospect.Prospect_Source__c;
                        
                        string recordTypeName =  Schema.getGlobalDescribe().get('Prospect__c').getDescribe().getRecordTypeInfosById().get(prospect.RecordTypeId).getName();
                        if(recordTypeName == 'Webvillee' || recordTypeName == 'MotionVillee'){
                            Id dynamicRecordTypeId = Schema.SObjectType.deal__c.getRecordTypeInfosByDeveloperName().get(recordTypeName).getRecordTypeId();
                            newDeal.RecordTypeId = dynamicRecordTypeId;
                            newDeal.Prospect_Id__c= prospect.Id;
                            
                            
                        }
                        dealsToCreate.add(newDeal);
                        // Add the new Deal record to the dealMap
                        // dealMap.put(prospect.Id, newDeal);
                        // System.debug('##New Deal: ' + newDeal);
                        
                    }                  
                    
                    
                }
        }
        if (!dealsToCreate.isEmpty()) {
            Database.insert(dealsToCreate, false);
        }
        
        // Create the new Deal records
        //if (!dealMap.isEmpty()) {
        //	 Database.insert(dealMap.values(),false) ;
        // }
        for(Deal__c deal : dealsToCreate){
            for(Follow_Up__c followUps : [SELECT Id,Deal_Name__c FROM Follow_Up__c WHERE Prospect_Name__c =: deal.Prospect_Id__c ]){
                followUps.Deal_Name__c = deal.Id;
                followUpsToUpdate.add(followUps);
            }
            for(Company_Task__c companyTask : [SELECT Id,Deal__c FROM Company_Task__c WHERE Prospect__c =: deal.Prospect_Id__c ]){
                companyTask.Deal__c = deal.Id;
                tasksToUpdate.add(companyTask);
            }
        }       
        
        if (!tasksToUpdate.isEmpty()) {
            update tasksToUpdate;
        }
        if (!followUpsToUpdate.isEmpty()) {
            update followUpsToUpdate;
        }
        
        
    }
    // Static Method for after update Trigger,here new Deal record is created and corresponding Prospect Record is get deleted
    public static void handleAfterConvertToDeal(List<Prospect__c> prospectList) {
        List<Deal__c> dealsToCreate = new List<Deal__c>();
        Set<ID> prospectIdsToDelete = new Set<ID>();
        
        System.debug('####In handleAfterConvertToDeal method');
        for (Prospect__c prospect : prospectList) {
            if (prospect.Prospect_Status__c == 'Convert to Deal' ) {
                prospectIdsToDelete.add(prospect.Id);
            }
        }        
        // Create a new Deal Record
        if (!dealsToCreate.isEmpty()) {
            Database.insert(dealsToCreate, false);
        }
        // Delete the prospect which got converted to new Deal
        if (!prospectIdsToDelete.isEmpty()) {
            List<Prospect__c> prospectsToDelete = [SELECT Id FROM Prospect__c WHERE Id IN :prospectIdsToDelete];
            Database.delete(prospectsToDelete);
        }
    }
}