import { Component, OnInit } from '@angular/core';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private translationsService: TranslationsService) { }

  commonStrings
  homeStrings

  ngOnInit() {
    // this.commonStrings = this.translationsService.getCommonStrings()
    // this.homeStrings = this.translationsService.getHomeStrings()
  }

}
