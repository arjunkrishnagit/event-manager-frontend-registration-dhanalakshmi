import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { RegistrationService } from '../registration.service'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxImageCompressService } from 'ngx-image-compress';
import {eventName, lon, lat, caption} from '../../../../eventEnv'
import { NgbCarouselConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [NgbCarouselConfig]
})
export class RegistrationComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private fb: FormBuilder,  private httpClient: HttpClient,private toastr: ToastrService, private ngxUiLoaderService: NgxUiLoaderService, private registrationService: RegistrationService, private imageCompress: NgxImageCompressService, config: NgbCarouselConfig, private modalService: NgbModal) {
    config.interval = 2000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }

  hide = true;
  loginForm: FormGroup | any;
  username: string | any;
  password: string | any;
  isLoading=false;
  loginValidation = false;

  createAttendeeForm: FormGroup | any;
  createAttendeeFormValidation = false;
  uploadFileName: string | any;
  uploadFile: File = null;

  public dropdownSettingsCountry: IDropdownSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection:1,
    closeDropDownOnSelection:true
  };

  public countryArr: any = [
    { item_id: 'India', item_text: 'India' },
    { item_id: 'Other_Country', item_text: 'Other Country' },
  ];

  countrySelection = '';
  countrySelectionErr = false;
  countryTypeSelected = false;
  indiaSelected = false;

  countryManual = '';
  stateManual = '';
  districtManual = '';
  countryManualErr = false;
  stateManualErr = false;
  districtManualErr = false;

  stateDistrictData = '';

  public dropdownSettingsState: IDropdownSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection:1,
    closeDropDownOnSelection:true
  };
  public stateArr: any = [];
  stateSelection = '';
  stateSelectionErr= false;


public dropdownSettingsDistrict: IDropdownSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection:1,
    closeDropDownOnSelection:true
  };
  public districtArr: any = [];
  districtSelection = '';
  districtSelectionErr = false;

  file: any;
  localUrl: any;
  sizeOfOriginalImage: number;
  sizeOFCompressedImage: number;
  imgResultAfterCompress: string;

  public companyArr: any = [
    { item_id: 'NBFC', item_text: 'NBFC' },
    { item_id: 'SOCIETY', item_text: 'SOCIETY' },
    { item_id: 'NIDHI', item_text: 'NIDHI' },
  ];

  companySelection = '';
  companySelectionErr = false;

  public dropdownSettingsCompany: IDropdownSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection:1,
    closeDropDownOnSelection:true
  };

  public transportationArr: any = [
    { item_id: 'Flight', item_text: 'Flight' },
    { item_id: 'Train', item_text: 'Train' },
    { item_id: 'Bus', item_text: 'Bus' },
    { item_id: 'Own Transport', item_text: 'Own Transport' },
    { item_id: 'Others', item_text: 'Others' },
  ];

  transportationSelection = '';
  transportationSelectionErr = false;

  public dropdownSettingsTransportation: IDropdownSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection:1,
    closeDropDownOnSelection:true
  };

  public arrivalDateArr: any = [
    { item_id: 'Sep-07', item_text: 'Sep-07' },
    { item_id: 'Sep-08', item_text: 'Sep-08' }
  ];

  arrivalDateSelection = '';
  arrivalDateSelectionErr = false;

  public dropdownSettingsArrivalDate: IDropdownSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection:1,
    closeDropDownOnSelection:true
  };

  public arrivalTimeArr: any = [];

  arrivalTimeSelection = '';
  arrivalTimeSelectionErr = false;

  public dropdownSettingsArrivalTime: IDropdownSettings = {
    singleSelection: true,
    idField: 'item_id',
    textField: 'item_text',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    limitSelection:1,
    closeDropDownOnSelection:true
  };

  verificationOtp = '';
  otpVerificationForm: FormGroup | any;
  otpVerificationFormValidation = false;


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: [, [Validators.required,Validators.email]],
      password: [, Validators.required]
    });

    this.createAttendeeForm = this.fb.group({
      Name: [, [Validators.required, Validators.maxLength(50)]],
      Code: [, [Validators.required]],
      Designation: [, [Validators.required]],
      Phone: [, [Validators.required, Validators.minLength(10),Validators.pattern("^[0-9]*$"), Validators.maxLength(10)]],
      Email: [, [Validators.required,  Validators.pattern("^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$")]],
      // Address: [, [Validators.required]],
      Pincode: [, [Validators.required, Validators.minLength(6),Validators.pattern("^[0-9]*$"), Validators.maxLength(6)]],
      // CompanyName: [, [Validators.required]],
      // GSTNumber: [, [Validators.required]],
      ProfileImage: [, [Validators.required]],
      Branch: [, [Validators.required]],
      Department: [, [Validators.required]],
      AreaManager: [, [Validators.required]],
      RegionalManager: [, [Validators.required]],
      BusinessHeadHod: [, [Validators.required]],
    });
    this.createAttendeeFormValidation = false;


    this.registrationService.getstatedistrictJSON().subscribe(data => {
      this.stateDistrictData = data;
      var dataArr = [];
      for(var key in data){
        dataArr.push({ item_id: key, item_text: key })
      }
      this.stateArr = dataArr;
    },
      error => {
        this.ngxUiLoaderService.stop();
        this.toastr.error(error, 'Error')
      }
    );


    this.otpVerificationForm = this.fb.group({
      Otp: [, [Validators.required]]
    });
    this.otpVerificationFormValidation = false;
  }

  handleFileInput(event) {
    if (event.target.files.length > 0) {
      const extension = event.target.files[0].name.split('.').pop();
      if (extension == 'png' || extension == 'jpg' || extension == 'jpeg') {
        if (event.target.files[0].size / 1024 / 1024 > 5) {
          this.toastr.error('File size should be less than 5MB', 'Error')
        }
        else {
          var fileName: any;
          this.file = event.target.files[0];
          fileName = this.file['name'];
          if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            console.log(event.target.files[0])
            reader.onload = (event: any) => {
              this.localUrl = event.target.result;

              this.compressFile(this.localUrl, fileName)
            }
            reader.readAsDataURL(event.target.files[0]);
          }
        }
      }
      else {
        this.toastr.error('Please select image file', 'Error')
      }
    }
  }

  createAttendeeFormAction() {
    this.createAttendeeFormValidation = true;
    var noerror = true;
    if (this.createAttendeeForm.invalid) {
      noerror = false;
    }
    var country = '';
    var state = '';
    var district = '';

    if(this.countrySelection){
      this.countrySelectionErr =false;
      var countrysel = this.countrySelection[0]['item_id'];
      if(countrysel == 'India'){
        country = 'India';
        if(this.stateSelection){
          state = this.stateSelection[0]['item_id'];
          this.stateSelectionErr = false;
        }else{
          this.stateSelectionErr = true;
          noerror = false;
        }
        if(this.districtSelection){
          district = this.districtSelection[0]['item_id'];
          this.districtSelectionErr = false;
        }else{
          this.districtSelectionErr = true;
          noerror = false;
        }
      }else{
        if(this.countryManual == ''){
          this.countryManualErr = true;
          noerror = false;
        }else{
          this.countryManualErr = false;
        }
        if(this.stateManual == ''){
          this.stateManualErr = true;
          noerror = false;
        }else{
          this.stateManualErr = false;
        }
        if(this.districtManual == ''){
          this.districtManualErr = true;
          noerror = false;
        }else{
          this.districtManualErr = false;
        }

        country = this.countryManual;
        state = this.stateManual;
        district = this.districtManual;
      }
    }else{
      this.countrySelectionErr =true;
      noerror = false;
    }

    if(this.companySelection == ''){
      this.companySelectionErr =true;
      noerror = false;
    }
    else{
      this.companySelectionErr =false;
    }

    if(this.transportationSelection == ''){
      this.transportationSelectionErr =true;
      noerror = false;
    }
    else{
      this.transportationSelectionErr =false;
    }

    if(this.arrivalDateSelection == ''){
      this.arrivalDateSelectionErr =true;
      noerror = false;
    }
    else{
      this.arrivalDateSelectionErr =false;
    }

    if(this.arrivalTimeSelection == ''){
      this.arrivalTimeSelectionErr =true;
      noerror = false;
    }
    else{
      this.arrivalTimeSelectionErr =false;
    }

    if(!noerror){
      return ;
    }

    this.ngxUiLoaderService.start();
    this.registrationService.uploadProfilePhoto(this.uploadFile).subscribe(data => {
      if (data.data) {
        var user_data = {
          "name": this.createAttendeeForm.get('Name').value,
          "email": this.createAttendeeForm.get('Email').value,
          "phone": this.createAttendeeForm.get('Phone').value,
          "address": "",
          "country": country,
          "state": state,
          "district": district,
          "pincode": this.createAttendeeForm.get('Pincode').value,
          "profile_image": data.data,
          "company_name": this.companySelection[0]['item_id'],
          "gst": "",
          "event" : eventName,
          "branch": this.createAttendeeForm.get('Branch').value,
          "department": this.createAttendeeForm.get('Department').value,
          "emp_code": this.createAttendeeForm.get('Code').value,
          "designation": this.createAttendeeForm.get('Designation').value,
          "am": this.createAttendeeForm.get('AreaManager').value,
          "rm": this.createAttendeeForm.get('RegionalManager').value,
          "transportation": this.transportationSelection[0]['item_id'],
          "arrival_date": this.arrivalDateSelection[0]['item_id'],
          "arrival_time": this.arrivalTimeSelection[0]['item_id'],
          "business_head_hod":this.createAttendeeForm.get('BusinessHeadHod').value,
          "lat" : lat,
          "lon" : lon,
          "caption" : caption,
        }
        this.registrationService.createAttendee(user_data).subscribe(data => {
          this.toastr.success('New attendee created', 'Success')
          this.resetForm();
          this.ngxUiLoaderService.stop();
          this.modalService.dismissAll();
        },
          error => {
            this.ngxUiLoaderService.stop();
            this.modalService.dismissAll();
            this.toastr.error(error, 'Error')
          }
        );

      }
    },
      error => {
        this.ngxUiLoaderService.stop();
        this.toastr.error(error, 'Error')
        this.modalService.dismissAll();
      }
    );

  }

  onCountrySelect(event){
    this.countryTypeSelected = true;
    if(event.item_id == 'India'){
      this.indiaSelected = true;
    }
    else{
      this.indiaSelected = false;
    }
  }

  onCountryDeSelect(event){
    this.countryTypeSelected = false;;
  }

  onStateSelect(event){
    var districts :any =  this.stateDistrictData[event.item_id]
    var dataArr = [];
      for(var key in districts){
        dataArr.push({ item_id: districts[key], item_text: districts[key] })
      }
      this.districtArr = dataArr;
  }

  onStateDeSelect(event){
    this.districtArr=[];
  }

  resetForm(){
    this.createAttendeeForm.reset();
    this.createAttendeeFormValidation = false;
    this.countrySelection = '';
    this.countryTypeSelected = false
    this.indiaSelected=false;
    this.countryManual = '';
    this.stateManual = '';
    this.districtManual = '';
    this.countryManualErr = false;
    this.stateManualErr = false;
    this.districtManualErr = false;
    this.countrySelectionErr = false;
    this.stateSelection = '';
    this.stateSelectionErr= false;
    this.districtSelection = '';
    this.districtSelectionErr = false;
    this.companySelection = '';
    this.companySelectionErr = false;
    this.transportationSelection = '';
    this.transportationSelectionErr = false;
    this.arrivalDateSelection = '';
    this.arrivalDateSelectionErr = false;
    this.arrivalTimeSelection = '';
    this.arrivalTimeSelectionErr = false;
    this.arrivalTimeArr = []
  }

  compressFile(image, fileName) {
    var orientation = -1;
    this.sizeOfOriginalImage = this.imageCompress.byteCount(image) / (1024 * 1024);
    console.warn('Size in bytes is now:', this.sizeOfOriginalImage);
    this.imageCompress.compressFile(image, orientation, 50, 50, 200).then(
      result => {
        this.imgResultAfterCompress = result;
        const imageName = fileName;
        const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
        const imageFile = new File([imageBlob], imageName, { type: 'image/jpeg' });
        this.uploadFileName = fileName;
        this.uploadFile = imageFile;
      });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
    }

    onArrivalDateSelect(event){
      if(event.item_id == 'Sep-07'){
        this.arrivalTimeArr = [
          { item_id: '1pm-2pm', item_text: '1pm-2pm' },
          { item_id: '2pm-3pm', item_text: '2pm-3pm' },
          { item_id: '3pm-4pm', item_text: '3pm-4pm' },
          { item_id: '4pm-5pm', item_text: '4pm-5pm' },
          { item_id: '5pm-6pm', item_text: '5pm-6pm' },
          { item_id: '6pm-7pm', item_text: '6pm-7pm' },
          { item_id: '7pm-8pm', item_text: '7pm-8pm' },
          { item_id: '8pm-9pm', item_text: '8pm-9pm' },
          { item_id: '9pm-10pm', item_text: '9pm-10pm' },
          { item_id: '10pm-11pm', item_text: '10pm-11pm' },
          { item_id: '11pm-12am', item_text: '11pm-12am' }
        ]
      }
      if(event.item_id == 'Sep-08'){
        this.arrivalTimeArr = [
          { item_id: '12am-1am', item_text: '12am-1am' },
          { item_id: '1am-2am', item_text: '1am-2am' },
          { item_id: '2am-3am', item_text: '2am-3am' },
          { item_id: '3am-4am', item_text: '3am-4am' },
          { item_id: '4am-5am', item_text: '4am-5am' },
          { item_id: '5am-6am', item_text: '5am-6am' },
          { item_id: '6am-7am', item_text: '6am-7am' },
          { item_id: '7am-8am', item_text: '7am-8am' },
        ]
      }
    }

    onArrivalDateDeSelect(event){
      this.arrivalTimeArr=[];
      this.arrivalTimeSelection = '';
    }

    sendOtpValidationToWhatsapp(modalName){
      this.createAttendeeFormValidation = true;
      var noerror = true;
      if (this.createAttendeeForm.invalid) {
        noerror = false;
      }
      var country = '';
      var state = '';
      var district = '';

      if(this.countrySelection){
        this.countrySelectionErr =false;
        var countrysel = this.countrySelection[0]['item_id'];
        if(countrysel == 'India'){
          country = 'India';
          if(this.stateSelection){
            state = this.stateSelection[0]['item_id'];
            this.stateSelectionErr = false;
          }else{
            this.stateSelectionErr = true;
            noerror = false;
          }
          if(this.districtSelection){
            district = this.districtSelection[0]['item_id'];
            this.districtSelectionErr = false;
          }else{
            this.districtSelectionErr = true;
            noerror = false;
          }
        }else{
          if(this.countryManual == ''){
            this.countryManualErr = true;
            noerror = false;
          }else{
            this.countryManualErr = false;
          }
          if(this.stateManual == ''){
            this.stateManualErr = true;
            noerror = false;
          }else{
            this.stateManualErr = false;
          }
          if(this.districtManual == ''){
            this.districtManualErr = true;
            noerror = false;
          }else{
            this.districtManualErr = false;
          }

          country = this.countryManual;
          state = this.stateManual;
          district = this.districtManual;
        }
      }else{
        this.countrySelectionErr =true;
        noerror = false;
      }

      if(this.companySelection == ''){
        this.companySelectionErr =true;
        noerror = false;
      }
      else{
        this.companySelectionErr =false;
      }

      if(this.transportationSelection == ''){
        this.transportationSelectionErr =true;
        noerror = false;
      }
      else{
        this.transportationSelectionErr =false;
      }

      if(this.arrivalDateSelection == ''){
        this.arrivalDateSelectionErr =true;
        noerror = false;
      }
      else{
        this.arrivalDateSelectionErr =false;
      }

      if(this.arrivalTimeSelection == ''){
        this.arrivalTimeSelectionErr =true;
        noerror = false;
      }
      else{
        this.arrivalTimeSelectionErr =false;
      }

      if(!noerror){
        return ;
      }

      this.ngxUiLoaderService.start();
      var reqparam = {
        phone:this.createAttendeeForm.get('Phone').value,
        email:this.createAttendeeForm.get('Email').value,
        event:eventName
      }
      this.registrationService.checkAndSendWhatsappNumberOtp(reqparam).subscribe(data => {
        this.ngxUiLoaderService.stop();
        if(data.message == 'Success'){
          this.verificationOtp = data.data
          this.modalService.open(modalName, { ariaLabelledBy: 'modal-basic-title', size: 'dialog-centered', backdrop: 'static' });
        }else{
          this.toastr.error('Something went wrong!', 'Error')
        }
      },
        error => {
          this.ngxUiLoaderService.stop();
          this.toastr.error(error, 'Error')
        }
      );
    }

    validateOtpAndRegister(){
      console.log('test');
      this.otpVerificationFormValidation = true;
      if (this.otpVerificationForm.invalid) {
        return;
      }
      if(this.verificationOtp == this.otpVerificationForm.get('Otp').value){
        this.createAttendeeFormAction();
      }
      else{
        this.toastr.error('Invalid OTP', 'Error')
      }
    }

}
