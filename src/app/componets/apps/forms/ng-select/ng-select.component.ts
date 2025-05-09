import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgbAlertModule, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
// import { DataService ,} from '../../../../shared/data/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-ng-select',
  standalone: true,
  imports: [SharedModule,NgbAlertModule,NgSelectModule,CommonModule,FormsModule],
  templateUrl: './ng-select.component.html',
  styleUrl: './ng-select.component.scss'
})

  export class NgSelectComponent {
    disabled = false;
    Selection = [
      { value: 1, label: 'Selection-1' },
      { value: 2, label: 'Selection-2' },
      { value: 3, label: 'Selection-3' },
      { value: 3, label: 'Selection-4' },
      { value: 3, label: 'Selection-5' }
  ];
      //Templating
      cities = [
        {
          id: 1,
          name: 'Andrew',
          avatar: './assets/images/users/select2/p-1.jpg',
        },
        {
          id: 2,
          name: 'Maya',
          avatar: './assets/images/users/select2/p-2.jpg',
        },
        {
          id: 3,
          name: 'Brodus Axel',
          avatar: './assets/images/users/select2/p-3.jpg',
        },
        {
          id: 4,
          name: 'Goldens',
          avatar: './assets/images/users/select2/p-4.jpg',
        },
        {
          id: 5,
          name: 'Angelina',
          avatar: './assets/images/users/select2/p-5.jpg',
        },
      ];
      
  cities1 = [
    {
      id: 1,
      name: 'Andrew',
      avatar: './assets/images/users/select2/p-1.jpg',
    },
    {
      id: 2,
      name: 'Maya',
      avatar: './assets/images/users/select2/p-2.jpg',
    },
    {
      id: 3,
      name: 'Brodus Axel',
      avatar: './assets/images/users/select2/p-3.jpg',
    },
    {
      id: 4,
      name: 'Goldens',
      avatar: './assets/images/users/select2/p-4.jpg',
    },
    {
      id: 5,
      name: 'Angelina',
      avatar: './assets/images/users/select2/p-5.jpg',
    },
  ];
  selectedCity = this.cities[0].name;
  selectedCity1 = this.cities1[0].name;
  people$!: Observable<any[]>;

 

    constructor() {
    }

    ngOnInit() {
        // this.people$ = this.dataService.getPeople('');
    }
    selectedPersonId:any;
    enableSelect(): void {
      this.disable = false;
    }
  
    disableSelect(): void {
      this.disable = true;
    }
    disable:any;

    
  customer:any;
  public onSelectAll() {
    const selected = this.cities.map(item => item.id);
    this.customer = selected;
  }

  public onClearAll() {
    this.customer = [];
  }
  }
