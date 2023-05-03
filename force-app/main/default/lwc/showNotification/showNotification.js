/*  @Description      :- This is a JS file of a Component that shows no. of task pending for today. And on a click of a button you can change your task stage.
  @ Author              :- Shashank Mall
 @ Group                :- Webvillee Technology pvt.ltd.
 @ Last Modifield on    :- 30-03-2023
 @ Last Modification by :- 
 @ Modification Log      - 
 Version           Date         Author         Modification
 1.              17-04-2023   Shashank Mall      Add the handleSave(event) function.
 2.              17-04-2023   Shashank Mall      Remove snooze button functionality.
 */

    import { LightningElement, track, wire } from 'lwc';
    import { updateRecord } from 'lightning/uiRecordApi';
    import { refreshApex } from '@salesforce/apex';
    import { ShowToastEvent } from 'lightning/platformShowToastEvent';
    import getCompanyTaskList from '@salesforce/apex/CompanyTaskController.getCompanyTaskList';

    // datatable columns
    const columns = [
        { label: 'Task Name', fieldName: 'Name' },
        {
            label: 'Completed',
            type: 'button-icon',
            cellAttributes: {
                alignment: 'left'},
            typeAttributes: {
                iconName: 'utility:check',
                label: 'Complete',
                name: 'complete',
                variant: 'border-filled',
                alternativeText: 'Complete'
            }
        },
        {
            label: 'Closed',
            type: 'button-icon',
            cellAttributes: { 
                alignment: 'left' 
            },
            typeAttributes: {
                iconName: 'utility:close',
                label: 'Close',
                name: 'close',
                variant: 'border-filled',
                alternativeText: 'Close'
        }
    },

    { label: 'Reschedule', fieldName: 'Due_Date__c', editable:true , type: 'date', sortable: true, 
        typeAttributes: {year: "numeric", month: "2-digit", day: "2-digit"} }

    ];
    const FIELDS = ['Company_Task__c.Status__c'];

    export default class CompanyTaskPopUp extends LightningElement {
        @track dueTodayTasks = [];
        @track showModal = false;
        @track taskData = [];
        @track columns = columns;
        wiredTasksResult;
    // calling apex from wire
        @wire(getCompanyTaskList)
        wiredTasks(result) {
            this.wiredTasksResult = result;
            try{
                 if (result.data) {
                this.dueTodayTasks = result.data.filter(task => task.Status__c !== 'Completed' && task.Status__c !== 'Closed');
                if (this.dueTodayTasks.length > 0) {
                    this.taskData = this.dueTodayTasks.map(task => ({
                        Id: task.Id,
                        Name: task.Name,
                        Due_Date__c: task.Due_Date__c 
                    }));
                    this.showModal = true;
                }
            else if (this.dueTodayTasks.length = 0) {
                    this.showModal = false;
                }
            } else if (result.error) {
                console.log(result.error);
            }
            }
            catch (error) {
                console.log(error);
            }
        }
        handleRowAction(event) {
            const actionName = event.detail.action.name;
            const taskId = event.detail.row.Id;
        
            if (actionName === 'complete') {
                // update status to Completed
                const fields = {};
                fields['Id'] = taskId;
                fields['Status__c'] = 'Completed';
                const recordInput = { fields };
        
                updateRecord(recordInput)
                    .then(() => {
                        this.taskData = this.taskData.filter(task => task.Id !== taskId);
                    // refreshing apex class
                        refreshApex(this.wiredTasksResult);
                        const toastEvent = new ShowToastEvent({
                            title: 'Success!',
                            message: 'Task has been marked as Completed.',
                            variant: 'success'
                        });
                        this.dispatchEvent(toastEvent);
                        if(this.taskData<=0){
                            this.showModal = false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else if (actionName === 'close') {
                // update status to Closed
                const fields = {};
                fields['Id'] = taskId;
                fields['Status__c'] = 'Closed';
                const recordInput = { fields };
        
                updateRecord(recordInput)
                    .then(() => {
                        this.taskData = this.taskData.filter(task => task.Id !== taskId);
                        
                        refreshApex(this.wiredTasksResult);
                        const toastEvent = new ShowToastEvent({
                            title: 'Success!',
                            message: 'Task has been Closed.',
                            variant: 'info'
                        });
                        this.dispatchEvent(toastEvent);
                        const taskId = event.detail.row.Id;
                        if(this.taskData<=0){
                            this.showModal = false;
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
    }
    handleSave(event) {
        const recordInputs = event.detail.draftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
        console.log('My record Input',recordInputs);

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Due Date successfully updated',
                    variant: 'success'
                })
            );
        
            refreshApex(this.wiredTasksResult);
        }).catch(error => {
            console.log(error);
        });
        
    }

    closeModal(){
        this.showModal = false;
    }
    }