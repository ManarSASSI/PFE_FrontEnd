import { Component, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';

import { NgbTableComponent } from '../data-table-components/ngb-table/ngb-table.component';
import { AddRowComponent } from '../data-table-components/add-row/add-row.component';
import { DeleteRowsComponent } from '../data-table-components/delete-rows/delete-rows.component';
import { AddrowtableComponent } from '../data-table-components/addrowtable/addrowtable.component';
import { ScrollTableComponent } from '../data-table-components/scroll-table/scroll-table.component';
import { SelectionTableComponent } from '../data-table-components/selection-table/selection-table.component';
import { MaterialModuleModule } from '../../../../material-module/material-module.module';

import {
  ELEMENT_DATA1,
  ELEMENT_DATA2,
  ELEMENT_DATA3,
  ELEMENT_DATA4,
  ELEMENT_DATA5,
  PeriodicElement,
  PeriodicElements,
  PeriodicElement2,
  PeriodicElement3,
  PeriodicElement4,
  ELEMENT_DATA6,
  PeriodicElement5,
  ELEMENT_DATA0,
  PeriodicElement0,
  PeriodicElement6,
} from './data';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-ang-material',
  standalone: true,
  imports: [SharedModule,NgbTableComponent,AddRowComponent,DeleteRowsComponent,AddrowtableComponent,ScrollTableComponent,SelectionTableComponent,MaterialModuleModule],
  templateUrl: './ang-material.component.html',
  styleUrl: './ang-material.component.scss'
})

export class AngularMaterialTableComponent {
 // table sample
displayedColumns0: string[] = ['position', 'name', 'weight', 'symbol'];
dataSource0= new MatTableDataSource<PeriodicElement0>(ELEMENT_DATA0);
// table with paginator
displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA1);

// search Table
displayedColumns1: string[] = [
  'position',
  'name',
  'weight',
  'symbol',
  'cost',
];
dataSource1 = new MatTableDataSource<PeriodicElements>(ELEMENT_DATA2);
//Sorting table
displayedColumns2: string[] = ['position', 'name', 'weight', 'symbol'];
dataSource2 = new MatTableDataSource<PeriodicElement2>(ELEMENT_DATA3);
//table slide
displayedColumns3: string[] = ['position', 'name', 'weight', 'symbol'];
dataSource3 = new MatTableDataSource<PeriodicElement3>(ELEMENT_DATA4);
//table fixed header
displayedColumns5: string[] = [
  'position',
  'name',
  'weight',
  'symbol',
  'cost',
];

dataSource5 = new MatTableDataSource<PeriodicElement4>(ELEMENT_DATA5);
//*Wide table/
displayedColumns4: string[] = [
  'position',
  'name',
  'weight',
  'symbol',
  'email',
  'date',
  'category',
];
dataSource4 = new MatTableDataSource<PeriodicElement5>(ELEMENT_DATA6);
//Hidden table
displayedColumns6: string[] = [
  'position',
  'name',
  'weight',
  'symbol',
  'email',
  'date',
  'category',
];
dataSource6= new MatTableDataSource<PeriodicElement6>(ELEMENT_DATA1);


//paginators

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild('paginator1') paginator1!: MatPaginator;
@ViewChild('paginator2') paginator2!: MatPaginator;
@ViewChild('paginator3') paginator3!: MatPaginator;
@ViewChild('paginator5') paginator5!: MatPaginator;
@ViewChild('paginator4') paginator4!: MatPaginator;
@ViewChild('paginator6') paginator6!: MatPaginator;
table: any;



//Sorting
constructor() {}
@ViewChild('sort1') sort1!: MatSort;
@ViewChild('sort2') sort2!: MatSort;
@ViewChild('sort4') sort4!: MatSort;
@ViewChild('sort5') sort5!: MatSort;
@ViewChild('sort6') sort6!: MatSort;
@ViewChild('sort7') sort7!: MatSort;



ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;

  // search Table
  this.dataSource1.paginator = this.paginator1;

  // sorting Table
  this.dataSource2.paginator = this.paginator2;
  this.dataSource2.sort = this.sort1;
  //table slide
  this.dataSource3.paginator = this.paginator3;
  this.dataSource3.sort = this.sort2;
  //table Fixed header
  this.dataSource5.paginator = this.paginator5;
  this.dataSource5.sort = this.sort4;
  //Wide table/
  this.dataSource4.paginator = this.paginator4;
  this.dataSource4.sort = this.sort5;
  //slide table/ 
  this.dataSource6.paginator = this.paginator6;
  this.dataSource6.sort = this.sort5;

}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource1.filter = filterValue.trim().toLowerCase();
}
applyFilter2(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource2.filter = filterValue.trim().toLowerCase();
}
applyFilter3(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource3.filter = filterValue.trim().toLowerCase();
}
applyFilter5(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource5.filter = filterValue.trim().toLowerCase();
}
applyFilter6(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource4.filter = filterValue.trim().toLowerCase();
}
applyFilter7(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource6.filter = filterValue.trim().toLowerCase();
}
applyFilter8(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource6.filter = filterValue.trim().toLowerCase();
}
addData() {
  const randomElementIndex = Math.floor(Math.random() * ELEMENT_DATA6.length);
  this.dataSource6.data.push(ELEMENT_DATA6[randomElementIndex]);
  this.dataSource6.data = [...this.dataSource6.data]; // This line updates the data source
  // this.table.renderRows();
}


removeData() {
  this.dataSource6.data.pop();
  this.dataSource6.data = [...this.dataSource6.data]; // This line updates the data source
  // this.table.renderRows();
} 
}

