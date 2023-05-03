public class ProspectController {
    @AuraEnabled(cacheable=true)
    public static Integer getFollowUps(String prospectId) {
        system.debug('ID=>'+ prospectId);
        Integer followUpsCount = [SELECT count() FROM Follow_Up__c WHERE Prospect_Name__c = :prospectId];
        system.debug('Count=>' + followUpsCount);
        return followUpsCount;
    }
    @AuraEnabled(cacheable=true)
    public static string getDealIdFromController(String searchName) {
        list<Deal__c> dealList = [
            SELECT Id, Name
            FROM Deal__c
            WHERE Name =: searchName 
            LIMIT 1
        ];
        if(dealList.size() > 0){
            return dealList[0].id ;
            
        }else{
            return null ;
            
        }
    }
    
    
}