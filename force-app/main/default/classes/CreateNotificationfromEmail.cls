global class CreateNotificationfromEmail implements Messaging.InboundEmailHandler { 
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email,
    Messaging.InboundEnvelope envelope) {
 
        Messaging.InboundEmailResult result = new Messaging.InboundEmailresult();
        
        try{
            String fromAdd = email.fromAddress;
            Contact objCon = [SELECT Id FROM Contact WHERE Email = :fromAdd LIMIT 1];
                       
            Notification__c objNoti = new Notification__c();
            objNoti.Name__c = email.fromname != null ? email.fromname.substring(0,email.fromName.indexOf('')) : '';
            objNoti.Notification_Email__c = envelope.fromAddress != null ? envelope.fromAddress : '';
            objNoti.Description__c= email.plainTextBody != null ? email.plainTextBody : '';
            objNoti.Contact__c= objCon.Id;
            insert objNoti;
            system.debug('##Notification Name ' + objNoti.Name__c + envelope.fromAddress + email.plainTextBody);
            
            // Save attachments, if any
            if (email.textAttachments != null) {
                for (Messaging.Inboundemail.TextAttachment tAttachment : email.textAttachments) {
                    Attachment attachment = new Attachment();
                    attachment.Name = tAttachment.fileName != null ? tAttachment.fileName : '';
                    attachment.Body = tAttachment.body != null ? Blob.valueOf(tAttachment.body) : Blob.valueOf('');
                    attachment.ParentId = objNoti.Id;
                    insert attachment;
                }
            }
            
            //Save any Binary Attachment
            if (email.binaryAttachments != null) {
                for (Messaging.Inboundemail.BinaryAttachment bAttachment : email.binaryAttachments) {
                    Attachment attachment = new Attachment();
                    attachment.Name = bAttachment.fileName != null ? bAttachment.fileName : '';
                    attachment.Body = bAttachment.body != null ? bAttachment.body : Blob.valueOf('');
                    attachment.ParentId = objNoti.Id;
                    insert attachment;
                }
            }
 
            result.success = true;
        } catch(Exception e) {
            result.success = false;
            system.debug('Error processing inbound email: ' + e.getMessage());
        }
        
        return result;
    }
}