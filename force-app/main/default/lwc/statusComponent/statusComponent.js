import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import PROSPECT_STATUS_FIELD from '@salesforce/schema/Prospect__c.Prospect_Status__c';

export default class ProspectStatus extends LightningElement {
    
}