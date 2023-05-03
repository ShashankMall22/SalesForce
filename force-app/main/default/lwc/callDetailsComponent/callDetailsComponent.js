import { LightningElement, wire } from 'lwc';
import getTaskSubject from '@salesforce/apex/CompanyTaskController.getTaskSubject';

export default class TaskTable extends LightningElement {
    @wire(getTaskSubject) 
    taskList;
}

