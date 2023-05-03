//  @Description      :- This is a Component that used to provide for the update stages of Prospects
//  @ Author              :- Darshan Rathi 
// @ Group                :- Webvillee Technology pvt.ltd.
// @ Last Modifield on    :- 24-03-2023
// @ Last Modification by :- Darshan Rathi 
// @ Modification Log      - 
// Version           Date      Author         Modification
// 1              24-03-2023   Darshan       Add the update and Onclick Event

import { LightningElement, track, wire, api } from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import STATUS__C_FIELD from '@salesforce/schema/Milestone__c.Month__c';
import MILESTONE_OBJECT from '@salesforce/schema/Milestone__c';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';


export default class ProgressIndicator extends NavigationMixin(LightningElement) { 

    @track selectedStep = 'Step1';
    picklistValues;
    @api recordId;
    prospectData;
    statusvalue = '';
    @track isModalOpen = false;

      // This is the info of object
    @wire(getObjectInfo, { objectApiName: MILESTONE_OBJECT })
    objectInfo;

    // This is use to get the record from the picklist status

    @wire(getRecord, { recordId: '$recordId', fields: [STATUS__C_FIELD,PROSPECT_COMPANY_NAME,PROSPECT_NAME,PROSPECT_COMPANY_CONTACT_NAME] })
    wiredRecord({ data }) {
        try {
            if (data) {
                console.log('here the object data', data);
                this.prospectData = data;
                this.statusvalue = data.fields.Month__c.value;
                console.log('this.statusvalue data', this.statusvalue);


            }
        } catch (e) {
            console.error('here the error', e.message);
        }
    }

  // this is used to get the record from the piclist status and value

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: STATUS__C_FIELD })
    StatusPickList({ data, error }) {
        if (data) {
            console.log('Here the data ', data);
            this.picklistValues = data;

        }
        if (error) {
            console.error(error);
        }
    }

    //   @wire(updateRecord,(recordInput: '$recordId', clientOptions?: MILESTONE_OBJECT)

       // this method is when the user click on the indicator bar so this update  and throught the tost message  
    onclickHandler(event) {
        const fields = {};

        let change = event.target.value;
        fields[STATUS__C_FIELD.fieldApiName] = event.target.value;
        fields['Id'] = this.recordId;
        console.log("fields" + JSON.stringify(fields));

        const recordInput = { fields };

        if (this.statusvalue == change) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: '',
                    message: 'Already In ' + this.statusvalue,
                    variant: 'warning'
                }))
        } else if (change == 'Convert to Deal') {
                if(this.prospectData.fields.Company_Contact__c.value && this.prospectData.fields.Company_Name__c.value){
                        this.updateRecords(recordInput);
                }else{
                        this.showToast('Missing Fields','Please Check/Fill Company Name or Contact Name','Error');
                }
        } else {
            this.updateRecords(recordInput);
            
        }
    }

    updateRecords(recordInput){
        updateRecord(recordInput)
                    .then(response => {
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Success',
                                message: 'Status updated  '+ this.statusvalue,
                                variant: 'success'
                            }))
                        console.log("response---" + JSON.stringify(response));
                    })
                    .catch(error => {
                        if(error.body.errorCode == 'NOT_FOUND'){
                            this.getDealId();

                        }else{
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Error On Updating',
                                message: error.body.message,
                                variant: 'error'
                            }))

                        console.error("error:" + JSON.stringify(error));
                        }
                    })
                    
    }

    showToast(toastTitle,toastMessage,toastVariant){
        this.dispatchEvent(
            new ShowToastEvent({
                title: toastTitle,
                message: toastMessage,
                variant: toastVariant
            }))
    }
    redirectToDeal(dealId){
        
                // Use the NavigationMixin to navigate to the Deal record page
                this[NavigationMixin.Navigate]({
                    type: 'standard__recordPage',
                    attributes: {
                        recordId: dealId,
                        objectApiName: 'Deal__c',
                        actionName: 'view'
                    }
                });
    }
    getDealId() {
        getDealIdFromController({ searchName: this.prospectData.fields.Name.value })
            .then((result) => {
                console.log('result=> ',result);
               if(result){
                this.showToast('Success','Successfully Deal Created','Success');
                setTimeout(this.redirectToDeal(result), 500);
               }
            })
            .catch((error) => {
               
            });
    }

    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
    }
    
   closeHandler(){
       this.showModal = false;
   }
}