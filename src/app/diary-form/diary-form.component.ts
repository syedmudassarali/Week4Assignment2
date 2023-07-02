import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { DiaryEntry } from '../shared/dairy-entry.model';
import { DiaryDataService } from '../shared/diary-data.component';

@Component({
  selector: 'app-diary-form',
  templateUrl: './diary-form.component.html',
  styleUrls: ['./diary-form.component.css']
})
export class DiaryFormComponent implements OnInit {

  editMode = false;
  private paramId: string;
  diaryEntry: DiaryEntry;

  diaryForm : FormGroup;
  
  
  constructor(private diaryDataService: DiaryDataService, private router: Router, private activatedRoute: ActivatedRoute) { }
  
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('id')){
        this.editMode = true;
        this.paramId = paramMap.get('id')!;
        this.diaryEntry = this.diaryDataService.getDiaryEntry(this.paramId);
      }
      else{
        this.editMode = false;
      }
    })
    this.diaryForm = new FormGroup({
      'testdate': new FormControl(this.editMode ? this.diaryEntry.testdate : '', [Validators.required]),
      'matchtype': new FormControl(this.editMode ? this.diaryEntry.matchtype : '', [Validators.required]),
      'team': new FormControl(this.editMode ? this.diaryEntry.team:'', [Validators.required]),
      'player': new FormControl(this.editMode ? this.diaryEntry.player:'', [Validators.required]),
      'runs': new FormControl(this.editMode ? this.diaryEntry.runs:'', [Validators.required]),
      'balls': new FormControl(this.editMode ? this.diaryEntry.balls:'', [Validators.required]),
      'fours': new FormControl(this.editMode ? this.diaryEntry.fours:'', [Validators.required]),
      'sixes': new FormControl(this.editMode ? this.diaryEntry.sixes:'', [Validators.required]),
      'strike': new FormControl(this.editMode ? this.diaryEntry.strike:'', [Validators.required]),
      'wickets': new FormControl(this.editMode ? this.diaryEntry.wickets:'', [Validators.required]),
      'conceded': new FormControl(this.editMode ? this.diaryEntry.conceded:'', [Validators.required])
    })
    
  }

  onSubmit(){
    const entry = new DiaryEntry('', this.diaryForm.value.testdate, this.diaryForm.value.matchtype,
    this.diaryForm.value.team, this.diaryForm.value.player,this.diaryForm.value.runs,this.diaryForm.value.balls,
    this.diaryForm.value.fours,this.diaryForm.value.sixes,this.diaryForm.value.strike,
    this.diaryForm.value.wickets,this.diaryForm.value.conceded);
    if(this.editMode){
      entry.id = this.paramId;
      this.diaryDataService.updateEntry(this.paramId, entry);
    }
    else{
      this.diaryDataService.onAddDiaryEntry(entry);
    }
    this.router.navigateByUrl("");
  }
}
