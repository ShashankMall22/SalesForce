/*  @Description      :- This is a JS file of a Component that create Company Task records on record page using record-form.
  @ Author              :- Shashank Mall
 @ Group                :- Webvillee Technology pvt.ltd.
 @ Last Modifield on    :- 26-03-2023
 @ Last Modification by :- 
 @ Modification Log      - 
 */

import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import COMPANYTASK_OBJECT from '@salesforce/schema/Company_Task__c';
import NAME_FIELD from '@salesforce/schema/Company_Task__c.Name';
import SUBJECT_FIELD from '@salesforce/schema/Company_Task__c.Subject__c';
import STATUS_FIELD from '@salesforce/schema/Company_Task__c.Status__c';
import REMINDER_FIELD from '@salesforce/schema/Company_Task__c.Reminder__c';
import PROSPECT_FIELD from '@salesforce/schema/Company_Task__c.Prospect__c';
import PRIORITY_FIELD from '@salesforce/schema/Company_Task__c.Priority__c';
import DATE_FIELD from '@salesforce/schema/Company_Task__c.Due_Date__c';
import DESCRIPTION_FIELD from '@salesforce/schema/Company_Task__c.Description__c';
import DEAL_FIELD from '@salesforce/schema/Company_Task__c.Deal__c';
import COMPANYC_FIELD from '@salesforce/schema/Company_Task__c.Company_Contact__c';
import COMPANY_FIELD from '@salesforce/schema/Company_Task__c.Company__c';



export default class AccountCreator extends LightningElement {
    @api recordId;
    // Method to show success toast message
showSuccessToast() {
    const evt = new ShowToastEvent({
        title: 'Record Creation Success',
        message: 'Company Task created successful',
        variant: 'success',
        mode: 'dismissable'
    });
    this.dispatchEvent(evt);
}
handleError(event) {
    console.error('An error occurred while trying to save the record:', event.detail);
    const toast = new ShowToastEvent({
        title: 'Error',
        message: 'An error occurred while trying to save the record. Please try again.',
        variant: 'error'
    });
    this.dispatchEvent(toast);
}



// Assigning the task object and fields to the corresponding variables
taskObject = COMPANYTASK_OBJECT;
myFields = [NAME_FIELD, SUBJECT_FIELD,STATUS_FIELD,REMINDER_FIELD,PROSPECT_FIELD,PRIORITY_FIELD,DATE_FIELD,DESCRIPTION_FIELD,DEAL_FIELD,COMPANYC_FIELD,COMPANY_FIELD];

// Method to handle account creation and return the showSuccessToast method
handleAccountCreated(){
    return this.showSuccessToast;
}
}
