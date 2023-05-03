import { LightningElement, api, wire,track } from 'lwc';
import getFollowUps from '@salesforce/apex/ProspectController.getFollowUps';
import { updateRecord } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
export default class ProspectProgressIndicator extends LightningElement {

    @api recordId;
    @track selectedStep;
    @track steps = [];
    totalFollowUps;

    @wire(getFollowUps, { prospectId: '$recordId'})
    countOfFollowUps;
  
    getSteps() {
        let steps = [];

        for (let i = 1; i <= 12; i++) {
            let step = {
                
                label: 'FL' + i,
                value: 'Step' + i
            };
            steps.push(step);
        }
        console.log('My steps',steps);

        return steps;
    }

    updateSelectedStep() {

        console.log('this totalFollowUps=>',this.totalFollowUps);
        let followUpCount = this.totalFollowUps;
        followUpCount = this.totalFollowUps != undefined ? this.totalFollowUps : 0;
        try{

        if (followUpCount >= 12) {
            this.selectedStep = 'Step12';
        } else {
            this.selectedStep = 'Step' + (followUpCount + 1);
        }
    }catch (e) {
        console.error(e);
    }

    }

    connectedCallback() {
        this.steps = this.getSteps();
    console.log('record-id',this.recordId);

    }
    

    renderedCallback() {
        this.updateSelectedStep();
    }
    handler() { 
        updateRecord(recordInput).then(() => {
          refreshApex(this.countOfFollowUps);
          console.log('see=> updateRecord',this.countOfFollowUps);

        });
      }

      // this code is add by Darshan Rathi for updating the onclic event on the  following step
        onclickHandler(event){
            const fields={};    
            let change = event.target.value; 
            fields[STATUS__C_FIELD.fieldApiName] = event.target.value;  
            fields['Id'] = this.recordId;
            console.log("fields"+JSON.stringify(fields));
             
            const recordInput = {fields};

            if(this.totalFollowUps == change){
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: '',
                        message: 'Already In '+this.statusvalue,
                        variant: 'warning'
                    }))
                }else {

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
    get checkData(){
        this.totalFollowUps = this.countOfFollowUps.data;
        console.log('totalFollowUps => ',this.totalFollowUps);

    }
}