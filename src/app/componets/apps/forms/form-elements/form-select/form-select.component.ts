import { Component,OnInit, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
// import Choices, { Choice, Group ,Options } from 'choices.js';
import { SharedModule } from '../../../../../shared/common/sharedmodule';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Observable } from 'rxjs';
import { ShowcodeCardComponent } from '../../../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../../../shared/prismData/forms/formselect'

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [SharedModule,NgSelectModule,FormsModule,ReactiveFormsModule,ShowcodeCardComponent],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss'
})
export class FormSelectComponent {
  prismCode = prismCodeData;
  selectedCompanies: any=['choice 1','choice 2'];
  
  uniqueOptions: any=['child1','child2'];

  selectedChoices: any=['choice 1'];
  selectedValues: any=['one','two'];
  selectedAccount = 'Adam';
  accounts = [
    {
      name: 'London',
      email: 'adam@email.com',
      age: 12,
      country: 'UK',
      child: { state: 'Active' },
    },
    {
      name: 'Manchester',
      email: 'homer@email.com',
      age: 47,
      country: 'UK',
      child: { state: 'Active' },
    },
    {
      name: 'Liverpool',
      email: 'samantha@email.com',
      age: 30,
      country: 'UK',
      child: { state: 'Active' },
    },
    {
      name: 'Paris',
      email: 'amalie@email.com',
      age: 12,
      country: 'FR',
      child: { state: 'Active' },
    },
    {
      name: 'Lyon',
      email: 'estefania@email.com',
      age: 21,
      country: 'FR',
      child: { state: 'Active' },
    },
    {
      name: 'Marseille',
      email: 'adrian@email.com',
      age: 21,
      country: 'FR',
      child: { state: 'Active' },
    },
    {
      name: 'Wladimir',
      email: 'wladimir@email.com',
      age: 30,
      country: 'Ecuador',
      child: { state: 'Inactive' },
    },
    {
      name: 'Natasha',
      email: 'natasha@email.com',
      age: 54,
      country: 'Ecuador',
      child: { state: 'Inactive' },
    },
    {
      name: 'Nicole',
      email: 'nicole@email.com',
      age: 43,
      country: 'Colombia',
      child: { state: 'Inactive' },
    },
    {
      name: 'Michael',
      email: 'michael@email.com',
      age: 15,
      country: 'Colombia',
      child: { state: 'Inactive' },
    },
    {
      name: 'Nicolás',
      email: 'nicole@email.com',
      age: 43,
      country: 'Colombia',
      child: { state: 'Inactive' },
    },
  ];
  Countries = [
    {
      name: 'London',
      email: 'adam@email.com',
      age: 12,
      country: 'UK',
      child: { state: 'Active' },
    },
    {
      name: 'Manchester',
      email: 'homer@email.com',
      age: 47,
      country: 'UK',
      child: { state: 'Active' },
    },
    {
      name: 'Liverpool',
      email: 'samantha@email.com',
      age: 30,
      country: 'UK',
      child: { state: 'Active' },
    },
    {
      name: 'Paris',
      email: 'amalie@email.com',
      age: 12,
      country: 'FR',
      child: { state: 'Active' },
    },
    {
      name: 'Lyon',
      email: 'estefania@email.com',
      age: 21,
      country: 'FR',
      child: { state: 'Active' },
    },
    {
      name: 'Marseille',
      email: 'adrian@email.com',
      age: 21,
      country: 'FR',
      child: { state: 'Active' },
    },
    {
      name: 'Wladimir',
      email: 'wladimir@email.com',
      age: 30,
      country: 'Ecuador',
      child: { state: 'Inactive' },
    },
    {
      name: 'Natasha',
      email: 'natasha@email.com',
      age: 54,
      country: 'Ecuador',
      child: { state: 'Inactive' },
    },
    {
      name: 'Nicole',
      email: 'nicole@email.com',
      age: 43,
      country: 'Colombia',
      child: { state: 'Inactive' },
    },
    {
      name: 'Michael',
      email: 'michael@email.com',
      age: 15,
      country: 'Colombia',
      child: { state: 'Inactive' },
    },
    {
      name: 'Nicolás',
      email: 'nicole@email.com',
      age: 43,
      country: 'Colombia',
      child: { state: 'Inactive' },
    },
  ];
  addTagFn(name: any) {
    return { name: name, tag: true };
  }
  companies: any[] = ['One','Two'];
  email: string = '';
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);
}