/*  @Description      :- This is a Component that shows no. of task pending for today. And on a click of a button you can change your task stage.
  @ Author              :- Shashank Mall
 @ Group                :- Webvillee Technology pvt.ltd.
 @ Last Modifield on    :- 21-03-2023
 @ Last Modification by :- 
 @ Modification Log      - 
 */


import { LightningElement,api, wire } from 'lwc';
import getFollowUps from '@salesforce/apex/ProspectController.getFollowUps';

export default class FollowUpCount extends LightningElement {
   @api recordId;
   followUpCount;

    @wire(getFollowUps, { prospectId: '$recordId' })
    followUpCountResult({ error, data }) {
        if (data) {
            console.log(error);
            this.followUpCount = data.length;
        } else if (error) {
            console.log(error);
        }
    }
}