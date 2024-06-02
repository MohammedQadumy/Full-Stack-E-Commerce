import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

  // white space validation

  static notOnlyWhiteSpace(control:FormControl):ValidationErrors|null{

    // check if string only contains white space
    if((control.value != null) && (control.value.trim().length ===0)){
      return {'notOnlyWhiteSpace':true};
    }
    else{
      return null;
    }
  }

}
