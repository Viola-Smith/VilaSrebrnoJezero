import { Component, OnInit } from '@angular/core';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  constructor(private translations: TranslationsService) { }

  ngOnInit() {
  }

}
