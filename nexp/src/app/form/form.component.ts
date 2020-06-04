import { Component, OnInit, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import * as data from "./../../assets/data/nigeria-states.json";
import * as InputTypes from "./../../assets/data/input-types.json";
import { Observable, from, combineLatest, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { DataService } from '../services/data/data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

  defaultSelectMsg: string = "Select an item";
  
  form: FormGroup;
  state: FormControl;
  statesAsArray: any = (data as any).default;
  inputTypesAsArray: any = (InputTypes as any).default;
  stateListVisibility: boolean = false;
  items: FormArray;


  states$: Observable<Array<{ name: string, id: string }>>;
  filteredStates$: Observable<Array<{name: string, id:string}>>;
  filter: FormControl;
  filter$: Observable<string>;

  constructor(public fb: FormBuilder, private ds: DataService) {
    this.form = fb.group({
      // "state": new FormControl(this.state, [Validators.required]),
      // "state_data": [""],
      // "education": [""],
      "items_group": fb.array([this.createItem()], [Validators.required])
    });

    this.states$ = of(this.statesAsArray);
    this.filter = new FormControl('');
    this.state = new FormControl('');
    this.filter$ = this.filter.valueChanges.pipe(startWith(''));
    this.filteredStates$ = combineLatest(this.states$, this.filter$).pipe(
      map(([states, filterString]) => states.filter(state => state.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1))
    );
  }

  ngOnInit(): void {
  }

  createItem(): FormGroup {
    return this.fb.group({
      type: '',
      state: '',
      state_value: ''
    });
  }

  addItem(): void {
    this.items = this.form.get('items_group') as FormArray;
    this.items.push(this.createItem());
  }

  removeItem(i: number) {
    const control = <FormArray>this.form.get('items_group');
    control.removeAt(i);
  }

  onSubmit() {
    // console.log(this.form);
    this.ds.sendMessage(this.form.value)
  }

  resetForm(){
    this.ds.sendMessage(null);
  }

  public onClickState(id, item) {
    console.log(id, item);
    this.form.patchValue({ state: item.name, state_data: item });
    this.toggleStateList();
  }

  toggleStateList(){
    this.stateListVisibility = !this.stateListVisibility;
  }

}
