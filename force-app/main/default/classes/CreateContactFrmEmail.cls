global class CreateContactFrmEmail implements Messaging.InboundEmailHandler { 
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email,
    Messaging.InboundEnvelope envelope) {
 
        Messaging.InboundEmailResult result = new Messaging.InboundEmailresult();
        
        Try{
            
            String subToCompare = 'Create notification';
 
       		 if(email.subject.equalsIgnoreCase(subToCompare))
       			{
           			 	            
            			Notification__c objNoti = new Notification__c();
            			objNoti.Name__c = email.fromname.substring(0,email.fromName.indexOf(''));
 						objNoti.Notification_Email__c = envelope.fromAddress;
                    	objNoti.Description__c= email.plainTextBody;
            			insert objNoti;
                    system.debug('##Notification Name ' + objNoti.Name__c + envelope.fromAddress + email.plainTextBody);
            
                // Save attachments, if any
            	for (Messaging.Inboundemail.TextAttachment tAttachment : email.textAttachments)
                {
              		Attachment attachment = new Attachment();
 
              		attachment.Name = tAttachment.fileName;
              		attachment.Body = Blob.valueOf(tAttachment.body);
              		attachment.ParentId = objNoti.Id;
              		insert attachment;
            	}
 
           		 //Save any Binary Attachment
            for (Messaging.Inboundemail.BinaryAttachment bAttachment : email.binaryAttachments)
              {
              		Attachment attachment = new Attachment();
 
              		attachment.Name = bAttachment.fileName;
              		attachment.Body = bAttachment.body;
              		attachment.ParentId = objNoti.Id;
              		insert attachment;
           	 }
        }
 
    	result.success = true;
       
        }Catch(Exception e)
        	{
            
           		 result.success = false;
        	}
        
        
        return result;
        
        }
 
         
}