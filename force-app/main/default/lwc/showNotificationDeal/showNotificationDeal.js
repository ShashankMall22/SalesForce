/*  @Description      :- This is a JS file of a Component that shows no. of task pending for today for the particular Deal record.
  @ Author              :- Shashank Mall
 @ Group                :- Webvillee Technology pvt.ltd.
 @ Last Modifield on    :- 07-04-2023
 @ Last Modification by :- 
 @ Modification Log      - 
 */
import { LightningElement, wire, api } from 'lwc';
import getDealList from '@salesforce/apex/DealCompanyTaskController.getDealList';

const COLUMNS = [
    { label: 'Task Name', fieldName: 'Name', type: 'text', sortable: true },
    { label: 'Task Due Date', fieldName: 'Due_Date__c', type: 'date', sortable: true, 
    typeAttributes: {year: "numeric", month: "2-digit", day: "2-digit"} },
    { label: 'Task Status', fieldName: 'Status__c', type: 'text', sortable: true },
];

export default class ProspectCompanyTask extends LightningElement {
    @api recordId;
    dealList = [];
    columns = COLUMNS;
    error;

    @wire(getDealList, { dealId: '$recordId' })
    wiredProspectList({ error, data }) {
        if (data) {
            this.dealList = data;
        } else if (error) {
            this.error = error;
        }
    }

    get hasDealList() {
        return this.dealList && this.dealList.length > 0;
    }
}