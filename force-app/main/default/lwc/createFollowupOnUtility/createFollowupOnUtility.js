//  @Description      :- This is a Component that used to provide for the update stages of Prospects
//  @ Author              :- Darshan Rathi 
// @ Group                :- Webvillee Technology pvt.ltd.
// @ Last Modifield on    :- 24-03-2023
// @ Last Modification by :- Darshan Rathi 
// @ Modification Log      - 
// Version           Date      Author         Modification
// 1              24-03-2023   Darshan       Add the update and Onclick Event
// 2              30-03-2023   Darshan       Adding the modal and record page form for the followup.
// 3              31-03-2023   Darshan       Adding the getRecord method for prospect to show the lookup on followup object      

import { LightningElement, api, wire,track } from 'lwc';
import getFollowUps from '@salesforce/apex/ProspectController.getFollowUps';
import { updateRecord } from 'lightning/uiRecordApi';
import { getRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import PROSPECT_NAME from '@salesforce/schema/Prospect__c.Name';
import FOLLOWUPOBJECT_OBJECT from '@salesforce/schema/Follow_Up__c';
import NAME_FIELD from '@salesforce/schema/Follow_Up__c.Name';
import DATE_FIELD from '@salesforce/schema/Follow_Up__c.Date__c';
import NOTESANDATTACHMENT_FIELD from '@salesforce/schema/Follow_Up__c.Notes_Attachment__c';


 


export default class ProspectProgressIndicator extends LightningElement {


  
    @track showModal = true;
    @api recordId;
    @track selectedStep;
    @track prospectId;
    @track steps = [];
    totalFollowUps;
    @track isModalOpen = false;


    // this Toast message is use to display the Toast Message WHEN FOLLOWUP is Created 
    showSuccessToast() 
    {
        const evt = new ShowToastEvent({
            title: 'Record Creation Success',
            message: 'Follow Up created successful',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
        this.isModalOpen = false;
        refreshApex(this.countOfFollowUps);
    }

    // use to store the fields value for the followups 
    followUpObject = FOLLOWUPOBJECT_OBJECT;
    myFields = [NAME_FIELD,DATE_FIELD,NOTESANDATTACHMENT_FIELD];
    
    // get record from the prospect object and display on the followup object
    @wire(getRecord, { recordId: '$recordId', fields: PROSPECT_NAME})
    wiredProspect({ error, data }) 
    {
        try {
               if (data) 
                 {
                    console.log('here the Prospect Name' ,data);
                    this.prospectName = data.fields.Name.value;
                 } else if (error) 
                         {
                            console.error(error);
                        }
            } catch(err)
                     {
                          console.error('An error occurred in wiredProspect :', err);
                     }
    }

    connectedCallback() {
        this.recordId = this._pageReference.state.recordId;
    }

     // this is the submit when the user clicks on the save button to store the records 
    handleSubmit(event) {

                            try{
                                event.preventDefault(); 
                                this.prospectId = event.detail.id;
                                this.template.querySelector('lightning-record-form').submit();
                                } catch(err) {
                                                console.error('An error occurred handleSubmit  :', err);
                                            }
                       }

// this method is use to store the step of the followup when the use click on the progress indicator so the record is created on the followup object
    @wire(getFollowUps, { prospectId: '$recordId'})
    countOfFollowUps;
  
    getSteps() {
        let steps = [];

        for (let i = 1; i <= 12; i++) {
            let step = {
                
                label: 'FL' + i,
                value: 'Step' + i
            };
            steps.push(step);
        }
        console.log('My steps',steps);

        return steps;
    }

    updateSelectedStep() {

                    try{
                         console.log('this totalFollowUps=>',this.totalFollowUps);
                         let followUpCount = this.totalFollowUps;
                          followUpCount = this.totalFollowUps != undefined ? this.totalFollowUps : 0;

                            if (followUpCount >= 12) {
                                this.selectedStep = 'Step12';
                            } else {
                                this.selectedStep = 'Step' + (followUpCount + 1);
                            }

                        }catch(err)
                                {
                                    console.error('An error occurred updateSelectedStep:', err);
                                }
                        }

    connectedCallback() {
        this.steps = this.getSteps();
    console.log('record-id',this.recordId);

    }
    

    renderedCallback() {
        this.updateSelectedStep();
    }
    handler() { 

              try{
                   updateRecord(recordInput).then(() =>
                    {
                   refreshApex(this.countOfFollowUps);
                   console.log('see=> updateRecord',this.countOfFollowUps);
                    });
                } catch(err)
                          {
                            console.error('An error occurred:', err);
                          }
            }

    get checkData(){
        this.totalFollowUps = this.countOfFollowUps.data;
        console.log('totalFollowUps => ',this.totalFollowUps);

    }
// to open the model when the use click the progess indicator 
    onclickHandler(event){
                    try{
                            this.isModalOpen = true;
                            this.currentStep = event.target.index;
                            console.log('My Current Step',this.currentStep);
                       }catch(err)
                            {
                                console.error('An error occurred:', err);
                            }

    }
     //Boolean tracked variable to indicate if modal is open or not default value is false as modal is closed when page is loaded 
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