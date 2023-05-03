import { LightningElement,api,wire,track} from 'lwc';
import { getObjectInfo, getPicklistValues } from 'lightning/uiObjectInfoApi';
import MILESTONE_OBJECT from '@salesforce/schema/Milestone__c';
import  MONTH_FIELD   from '@salesforce/schema/Milestone__c.Month__c';
import { getRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CreateMilestoneIndicator extends LightningElement {

    @track picklistValues
    @api recordId
    monthValue = ''
    objectInfoData = {};

    @wire(getObjectInfo, {objectApiName: MILESTONE_OBJECT})
    objectInfo({data}){
        if(data){
            console.log('My Data is=>',data);
            this.objectInfoData = data;
            console.log('Default Record Type ID:', data.defaultRecordTypeId);
        }
    }
    
    
    @wire(getRecord, { recordId: '$recordId', fields: [MONTH_FIELD] })
    getMilestoneRecord({data}){
        try{
        if(data){
            console.log('My Data is',data);
            this.monthValue = data.fields.Month__c.value;
            console.log('monthValueData',this.monthValue);
        }
    }
    catch(e){
        console.error(error);
    }
    }
    @wire(getPicklistValues, { recordTypeId: '$objectInfoData.defaultRecordTypeId', fieldApiName: MONTH_FIELD})
  myPicklistValues({ data, error }) {
    if (data) {
      console.log('Picklist Values:', data);
      this.picklistValues = data;
    } else if (error) {
      console.error(error);
    }
  }
}

