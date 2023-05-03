/*  @Description      :- This is a JS file of a Component that shows no. of task pending for today for the particular Prospect record.
  @ Author              :- Shashank Mall
 @ Group                :- Webvillee Technology pvt.ltd.
 @ Last Modifield on    :- 07-04-2023
 @ Last Modification by :- 
 @ Modification Log      - 
 */
import { LightningElement, wire, api, track } from 'lwc';
import getProspectList from '@salesforce/apex/ProspectCompanyTaskController.getProspectList';

const COLUMNS = [
    { label: 'Task Name', fieldName: 'Name', type: 'text', sortable: true },
    { label: 'Task Due Date', fieldName: 'Due_Date__c', type: 'date', sortable: true, 
    typeAttributes: {year: "numeric", month: "2-digit", day: "2-digit"} },
    { label: 'Task Status', fieldName: 'Status__c', type: 'text', sortable: true },
];

export default class ProspectCompanyTask extends LightningElement {
    @api recordId;
    prospectList = [];
    columns = COLUMNS;
    @track dueTodayTasks = [];
    error;

    @wire(getProspectList, { prospectId: '$recordId' })
    wiredProspectList({ error, data }) {
        if (data) {
            this.prospectList = data;
            console.log('Here comes the data=>',data);
        } else if (error) {
            this.error = error;
        }
    }

    get hasProspectList() {
        return this.prospectList && this.prospectList.length > 0;
    }
}