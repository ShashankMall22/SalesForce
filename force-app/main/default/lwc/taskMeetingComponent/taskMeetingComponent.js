/*  @Description      :- This is a JS file of a Component that shows no. of task in a Datatable that has subject = call.
  @ Author              :- Shashank Mall
 @ Group                :- Webvillee Technology pvt.ltd.
 @ Last Modifield on    :- 12-04-2023
 @ Last Modification by :- 
 @ Modification Log      - 
 */
// Importing necessary modules and functions from Lightning Web Components and Apex Controller
import { LightningElement, wire, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import TASK_OBJECT from '@salesforce/schema/Company_Task__c';
import getTaskSubjectMeeting from '@salesforce/apex/CompanyTaskController.getTaskSubjectMeeting';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import TASK_STATUS_FIELD from '@salesforce/schema/Company_Task__c.Status__c';

// Setting up the columns for the data table
const columns = [
{ label: 'Task Name', fieldName: 'Name', type: 'text', sortable: true },
{
label: 'Deal Name',
fieldName: 'DealName',
type: 'button',
typeAttributes: {
label: { fieldName: 'DealName' },
title: 'View Deal',
name: 'view_deal',
variant: 'base'
}
},
{
label: 'Prospect Name',
fieldName: 'ProspectName',
type: 'button',
typeAttributes: {
label: { fieldName: 'ProspectName' },
title: 'View Prospect',
name: 'view_prospect',
variant: 'base'
}
},
{ label: 'Description', fieldName: 'Description__c', type: 'text', sortable: true, editable: true}, 
{ label: 'Task Due Date', fieldName: 'Due_Date__c', editable:true , type: 'date', sortable: true, 
    typeAttributes: {year: "numeric", month: "2-digit", day: "2-digit"} }, 
{
    label: 'Task Status', fieldName: 'Status__c', type: 'picklistColumn', editable: false
    , typeAttributes: {
        placeholder: 'Choose Type', options: { fieldName: 'pickListOptions' }, 
        value: { fieldName: 'Status__c' }, 
        context: { fieldName: 'Id'} 
    }
}

];

export default class ProspectCompanyTask extends NavigationMixin(LightningElement) {
// Declaring variables for storing data and errors
records;
 wiredRecords;
error;

// Setting up the columns for the data table
columnss = columns;
lastSavedData = [];
@ track pickListOptions;
 @ track data = [];
 @track fetchTaskData

// Setting up a variable for draft values in case of inline editing
draftValues = [];
@wire(getObjectInfo, { objectApiName: TASK_OBJECT })
    objectInfo;
 
    //fetch picklist options
    @wire(getPicklistValues, {
        recordTypeId: "$objectInfo.data.defaultRecordTypeId",
        fieldApiName: TASK_STATUS_FIELD
    })
 
    wirePickList({ error, data }) {
        if (data) {
            this.pickListOptions = data.values;
            console.log('My Picklist Values',this.pickListOptions);
        } else if (error) {
            console.log(error);
        }
    }

// Wiring the Apex controller method to retrieve data from Salesforce
/*
@wire( getTaskSubject )  
wiredAccount( value ) {

    try{

        this.wiredRecords = value;

        // Destructuring the value object to get the data and error variables
        const { data, error } = value;

        if ( data ) {
            let tempRecords = JSON.parse( JSON.stringify( data ) );
            
            // Mapping the retrieved data to display the appropriate Prospect or Deal name in the table
            tempRecords = tempRecords.map((row) => {
                if (row.Prospect__r) {
                    return {
                        ...row,
                        kavay: row.Prospect__r.Name,
                        kothari: ''
                    };
                } else if (row.Deal__r) {
                    return {
                        ...row,
                        kothari: row.Deal__r.Name,
                        kavay: ''
                    };
                }
                return { ...row };
            });
            

            // Setting the records variable to the transformed data
            this.records = tempRecords;
            console.log('Data for the Task',this.records);

            // Resetting the error variable
            this.error = undefined;
            console.log('this.statusvalue data',tempRecords);

        } else if ( error ) {
            // Setting the error variable
            this.error = error;

            // Resetting the records variable
            this.records = undefined;
        }
    } catch( e ) {  
        console.error('here the error', e.message);
    }  
}*/
@wire(getTaskSubjectMeeting, { pickList: '$pickListOptions' })
fetchTaskData(result) {
        
        this.fetchTaskData = result;
        console.log('My data is=>', this.fetchTaskData);
        if (result.data) {
            this.data = JSON.parse(JSON.stringify(result.data));
            console.log('My data 1st=>', this.data);
 
            this.data.forEach(ele => {
                ele.pickListOptions = this.pickListOptions;
            })

            
            let tempRecords = JSON.parse( JSON.stringify( this.data ) );
            
            // Mapping the retrieved data to display the appropriate Prospect or Deal name in the table
            tempRecords = tempRecords.map((row) => {
                if (row.Prospect__r) {
                    return {
                        ...row,
                        ProspectName: row.Prospect__r.Name
                     };
                } 
                
                if (row.Deal__r) {
                    return {
                        ...row,
                        DealName: row.Deal__r.Name
                    };
                }
                return { ...row };
            });
            

            // Setting the records variable to the transformed data
            this.records = tempRecords;
            console.log('Data for the Task',this.records);

            // Resetting the error variable
            this.error = undefined;
            console.log('this.statusvalue data',tempRecords);


            console.log('My Picklist Values',this.pickListOptions);
 
            this.lastSavedData = JSON.parse(JSON.stringify(this.data));
            console.log('My Last Save Data',this.lastSavedData);
 
        } else if (result.error) {
            this.data = undefined;
        }
    };
 
    updateDataValues(updateItem) {
        let copyData = JSON.parse(JSON.stringify(this.data));
        console.log('Updated Value',copyData);
 
        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
            }
        });
 
        //write changes back to original data
        this.data = [...copyData];
    }
 
    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        //store changed value to do operations
        //on save. This will enable inline editing &
        //show standard cancel & save button
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });
 
        if (draftValueChanged) {
            this.draftValues = [...copyDraftValues];
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }
 
    //handler to handle cell changes & update values in draft values
    handleCellChange(event) {
        //this.updateDraftValues(event.detail.draftValues[0]);
        let draftValues = event.detail.draftValues;
        console.log('My Draft Values',draftValues
        );
        draftValues.forEach(ele=>{
            this.updateDraftValues(ele);
        })
    }
 
    handleSave(event) {
        this.showSpinner = true;
        this.saveDraftValues = this.draftValues;
 
        const recordInputs = this.saveDraftValues.slice().map(draft => {
            const fields = Object.assign({}, draft);
            return { fields };
        });
 
        // Updateing the records using the UiRecordAPi
        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.showToast('Success', 'Records Updated Successfully!', 'success', 'dismissable');
            this.draftValues = [];
            return this.refresh();
        }).catch(error => {
            console.log(error);
            this.showToast('Error', 'An Error Occured!!', 'error', 'dismissable');
        }).finally(() => {
            this.draftValues = [];
            this.showSpinner = false;
        });
    }
 
    handleCancel(event) {
        //remove draftValues & revert data changes
        this.data = JSON.parse(JSON.stringify(this.lastSavedData));
        this.draftValues = [];
    }
 
    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
 
    // This function is used to refresh the table once data updated
    async refresh() {
        await refreshApex(this.fetchTaskData);
    }

// Handling row actions like clicking the View Deal or View Prospect buttons in the table
handleRowAction(event) {
    const action = event.detail.action;
    console.log('Action Details',action);
    const row = event.detail.row;
    console.log('Row Details',row);

    if (action.name === 'view_deal') {
        // Navigating to the Deal record page using the NavigationMixin
        this[NavigationMixin.GenerateUrl]({
            type: "standard__recordPage",
            attributes: {
                        recordId: row.Deal__c,
                        objectApiName: 'Deal__c',
                        actionName: 'view',
                    }
        }).then(url => {
            console.log('object url=> ',url);
            window.open(url, "_blank");
        });
    }
        else if (action.name === 'view_prospect') {
            this[NavigationMixin.GenerateUrl]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: row.Prospect__c,
                    objectApiName: 'Prospect__c',
                    actionName: 'view'
                }
            }).then(url => {
                console.log('object url=> ',url);
                window.open(url, "_blank");
            });
        }
    }
    get hasRecordList() {
        return this.records && this.records.length > 0;
    }
}