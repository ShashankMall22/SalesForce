import { LightningElement ,track,wire } from 'lwc';
import getTask from '@salesforce/apex/CompanyTaskController.getTask'

const columns = [
    { label: 'Name', fieldName: 'Name', type: 'text' },
    { label: 'Subject', fieldName: 'Subject__c', type: 'text' },
    { label: 'Status', fieldName: 'Status__c', type: 'text' },
    { label: 'Due Date', fieldName: 'Due_Date__c', type: 'date' },
    { label: 'Company', fieldName: 'Company__c', type: 'text' },
    { label: 'Priority', fieldName: 'Priority__c', type: 'text' }
];


export default class TaskCompo extends LightningElement {

    @track data ;
    columns = columns;

    @wire(getTask) taskRecords({data,error}){

        if(data){

                this.data = data;
        }
        else if(error){

                this.data = undefined ;

        }

    }

}