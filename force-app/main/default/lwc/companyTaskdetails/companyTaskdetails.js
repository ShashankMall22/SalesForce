import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getRecordUi } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';
import COMPANY_TASK_OBJECT from '@salesforce/schema/Company_Task__c';
import SUBJECT_FIELD from '@salesforce/schema/Company_Task__c.Subject__c';
import STATUS_FIELD from '@salesforce/schema/Company_Task__c.Status__c';
import DUE_DATE_FIELD from '@salesforce/schema/Company_Task__c.Due_Date__c';
import COMPANY_FIELD from '@salesforce/schema/Company_Task__c.Company__c';
import PRIORITY_FIELD from '@salesforce/schema/Company_Task__c.Priority__c';

const COLUMNS = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Subject', fieldName: SUBJECT_FIELD.fieldApiName, type: 'text' },
    { label: 'Status', fieldName: STATUS_FIELD.fieldApiName, type: 'text' },
    { label: 'Due Date', fieldName: DUE_DATE_FIELD.fieldApiName, type: 'date' },
    { label: 'Company', fieldName: COMPANY_FIELD.fieldApiName, type: 'text' },
    { label: 'Priority', fieldName: PRIORITY_FIELD.fieldApiName, type: 'text' }
];
export default class CompanyTaskdetails extends LightningElement {

    columns = COLUMNS;
    companyTasks = [];
    objectInfo;
    subjectPicklistValues;
    statusPicklistValues;
    priorityPicklistValues;

    @wire(getObjectInfo, { objectApiName: COMPANY_TASK_OBJECT })
    objectInfo;

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: SUBJECT_FIELD
    })
    subjectPicklistValues;

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: STATUS_FIELD
    })
    statusPicklistValues;

    @wire(getPicklistValues, {
        recordTypeId: '$objectInfo.data.defaultRecordTypeId',
        fieldApiName: PRIORITY_FIELD
    })
    priorityPicklistValues;

    @wire(getRecordUi, {
        recordIds: '$companyTasks',
        layoutTypes: 'Full',
        modes: 'View'
    })

    wiredCompanyTasks({ error, data }) {
        if (data) {
            this.companyTasks = data.records.map(record => ({
                Id: record.id,
                Name: record.fields.Name.value,
                Subject__c: record.fields.Subject__c.value,
                Status__c: record.fields.Status__c.value,
                Due_Date__c: record.fields.Due_Date__c.value,
                Company__c: record.fields.Company__c.value,
                Priority__c: record.fields.Priority__c.value
            }));
        } else if (error) {
            console.log(error);
        }
    }

}