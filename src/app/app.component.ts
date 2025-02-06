import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface PeriodicElement {
  no: number;
  firstName: string;
  lastName: string;
  age: number; 
  gender: string;
  email: string;
  subscribe: boolean;
  newsletterPreference: string;
}

let ELEMENT_DATA: PeriodicElement[] = [];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  form!: FormGroup;
  genders = [
    { value: 'male', viewValue: 'Male' },
    { value: 'female', viewValue: 'Female' },
    { value: 'other', viewValue: 'Other' }
  ];
  title = 'student-details-angular';
  displayedColumns: string[] = ['no', 'firstName', 'lastName', 'age', 'gender', 'email', 'subscribe', 'newsletterPreference', 'actions'];
  dataSource = ELEMENT_DATA;

  currentEditIndex: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const storedData = localStorage.getItem('studentData');
    
    if (storedData) {
      ELEMENT_DATA = JSON.parse(storedData);
    }

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [
        Validators.required,
        Validators.min(1),
        Validators.max(120),
        Validators.pattern('^[0-9]+$')
      ]],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subscribe: [false],
      newsletterPreference: ['weekly']
    });

    this.dataSource = ELEMENT_DATA;
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.currentEditIndex === null) {
        const newData = {
          no: ELEMENT_DATA.length + 1,
          ...formData
        };
        ELEMENT_DATA.push(newData);
      } else {
        ELEMENT_DATA[this.currentEditIndex] = {
          ...formData,
          no: ELEMENT_DATA[this.currentEditIndex].no
        };
        this.currentEditIndex = null;
      }

      localStorage.setItem('studentData', JSON.stringify(ELEMENT_DATA));
      this.dataSource = [...ELEMENT_DATA]; 
      this.form.reset();
    }
  }

  editRow(element: PeriodicElement): void {
    this.currentEditIndex = this.dataSource.indexOf(element);
    this.form.setValue({
      firstName: element.firstName,
      lastName: element.lastName,
      age: element.age,
      gender: element.gender,
      email: element.email,
      subscribe: element.subscribe,
      newsletterPreference: element.newsletterPreference
    });
  }

  deleteRow(element: PeriodicElement): void {
    const index = this.dataSource.indexOf(element);
    if (index >= 0) {
      this.dataSource.splice(index, 1);
      localStorage.setItem('studentData', JSON.stringify(this.dataSource));
      this.dataSource = [...this.dataSource];
    }
  }
}
