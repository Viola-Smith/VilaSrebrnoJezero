import { Component, OnInit } from '@angular/core';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  constructor(private translations: TranslationsService) { }

  ngOnInit() {
  }

}
