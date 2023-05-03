/*  @Description      :- This is a slider component.
  @ Author              :- Shashank Mall
 @ Group                :- Webvillee Technology pvt.ltd.
 @ Last Modifield on    :- 30-03-2023
 @ Last Modification by :- 
 @ Modification Log      - 
 */

import { LightningElement } from 'lwc';

export default class SliderExample extends LightningElement {
 // Initialize isSliderOpen variable to false
 isSliderOpen = false;

 // Define a getter function to compute the CSS class for the slider
 get sliderClass() {
   return `slider ${this.isSliderOpen ? 'open' : 'closed'}`;
 }

 // Handle the click event of the slider button
 handleClick() {
   // Toggle the isSliderOpen value between true and false
   this.isSliderOpen = !this.isSliderOpen;
 }

 // Handle the close event of the slider
 handleClose(){
   console.log('hello');
   // Set the isSliderOpen value to false
   this.isSliderOpen = false;
 }
}