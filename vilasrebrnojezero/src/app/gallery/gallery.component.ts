import { Component, OnInit } from '@angular/core';
import { TranslationsService } from 'src/services/translations.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {

  constructor(private translations: TranslationsService) { }

  ngOnInit() {
  }

}
