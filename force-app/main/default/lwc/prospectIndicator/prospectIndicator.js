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
import  STATUS__C_FIELD   from '@salesforce/schema/Prospect__c.Prospect_Status__c';
import PROSPECT_OBJECT from '@salesforce/schema/Prospect__c';
import { getRecord , updateRecord} from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ProgressIndicator extends LightningElement {

        @track selectedStep = 'Step1';
        picklistValues;
        @api recordId ;
        statusvalue='';
 

        @wire(getObjectInfo,{objectApiName:PROSPECT_OBJECT})
        objectInfo;

        @wire(getRecord, { recordId: '$recordId', fields: STATUS__C_FIELD }) 
        wiredRecord({data}){
            try{
            if(data){
                console.log('here the object data',data);
                this.statusvalue = data.fields.Prospect_Status__c.value;
                console.log('this.statusvalue data',this.statusvalue);

               
            }  
        }catch(e){
            console.error('here the error',e.message);
        }
        }
        
        @wire(getPicklistValues,{recordTypeId:'$objectInfo.data.defaultRecordTypeId',fieldApiName:STATUS__C_FIELD})
        StatusPickList({data, error}){
            if(data){
                console.log('Here the data ',data);
                this.picklistValues = data;
                
            }
            if(error){
                console.error(error);
            }
        }

        //   @wire(updateRecord,(recordInput: '$recordId', clientOptions?: PROSPECT_OBJECT)

       
          onclickHandler(event){
            const fields={}; 
            
            let change = event.target.value; 
            fields[STATUS__C_FIELD.fieldApiName] = event.target.value;  
            fields['Id'] = this.recordId;
            console.log("fields"+JSON.stringify(fields));
             
            const recordInput = {fields};

            if(this.statusvalue == change){
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: '',
                        message: 'Already In '+this.statusvalue,
                        variant: 'warning'
                    }))
                }else 
                    if(this.statusvalue == 'Convert to Deal'){
                        this.dispatchEvent(
                            new ShowToastEvent({
                                title: 'Convert to Deal ',
                                message: 'Deal Created '+this.statusvalue,
                                variant: 'success'
                            }))
                        } else {

            updateRecord(recordInput)
            .then(response =>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Status updated',
                        variant: 'success'
                    }))
                console.log("response---"+JSON.stringify(response));
            })
            .catch(error =>{
                
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error On Updating',
                        message: error.body.message,
                        variant: 'error'
                    }))
                console.error("error:"+JSON.stringify(error));
            })
        }
        }
   }