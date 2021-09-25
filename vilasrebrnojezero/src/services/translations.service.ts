import { Injectable } from '@angular/core';
import data_sr_RS from '../assets/json/translations/sr_RS.json'
import data_en_US from '../assets/json/translations/en_US.json'
import { jsPDF } from "jspdf";

@Injectable({
  providedIn: 'root'
})
export class TranslationsService {

  public labels
  private lang

  private allLangs = [
    {name: 'sr_RS', labels: data_sr_RS},
    {name: 'en_GB', labels: data_en_US},
    {name: 'ro_RO', labels: {}}
  ]

  constructor() {
    if(localStorage.getItem('chosenLanguage')) {
      let chosenLang = localStorage.getItem('chosenLanguage')
      this.lang = chosenLang
      this.labels = this.allLangs.find(l => l.name === this.lang).labels
    } else {
      this.labels = this.allLangs[0].labels
      this.lang = this.allLangs[0].name
    }
    // let keys = Object.values(this.labels)
    // let allValues = []
    // keys.forEach(key =>
    //   allValues = allValues.concat(Object.values(key))
    // )

    // let i=1
    // const doc = new jsPDF();
    // allValues.forEach(key => {
    //     i++
    //     doc.text(key+"\n", 10, (i*10) + (10))
    //   }
    // )
    // doc.save('serbian.pdf')
  }

  getLanguage() {
    return this.lang
  }

  getOtherLanguages() {
    let arr = this.allLangs.filter(l => l.name !== this.lang)
    if(arr.length) {
      return arr.map(l => l.name)
    }
    return arr
  }

  changeLanguage(lang) {
    this.labels = this.allLangs.find(l => l.name === lang).labels
    this.lang = lang
    localStorage.setItem('chosenLanguage', lang)
  }

  getCommonStrings() {
    return this.labels.common
  }

  getHomeStrings() {
    return this.labels.home
  }

}
