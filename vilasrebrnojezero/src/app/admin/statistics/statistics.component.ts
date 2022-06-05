import { Component, OnInit } from '@angular/core';
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip
} from 'chart.js';
import { ReservationsService } from 'src/services/reservations/reservations.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private resService: ReservationsService) {}

  reservations = []

  ngOnInit(): void {
    Chart.register(
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      BubbleController,
      DoughnutController,
      LineController,
      PieController,
      PolarAreaController,
      RadarController,
      ScatterController,
      CategoryScale,
      LinearScale,
      LogarithmicScale,
      RadialLinearScale,
      TimeScale,
      TimeSeriesScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip
    );
    
    this.resService.getAll().subscribe((res:any) => {
      this.reservations = res
      this.setCharts()
    })
  }

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  getAllMonths() {
    let resMonths = []
    this.reservations.forEach(r => {
      let month = new Date(r.date_from).getMonth()
      let resMon = resMonths.find(m => m.name === this.months[month])
      if (resMon) {
        resMon.num++
      } else {
        let color = {c1: this.randomIntFromInterval(0,255), c2: this.randomIntFromInterval(0,255), c3: this.randomIntFromInterval(0,255)}
        resMonths.push({name: this.months[month], num: 1, index: month, color: color})
      }
    })
    return resMonths.sort((a,b) => a.index - b.index)
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  getRgbColor(color) {
    return 'rgb('+color.c1+','+color.c2+','+color.c3+')'
  }
  
  getRgbaColor(color) {
    return 'rgba('+color.c1+','+color.c2+','+color.c3+', 0.3)'
  }

  setCharts() {
    this.setResMonthChart()
    this.setCancelledChart()
  }

  setCancelledChart() {
    const canvas = <HTMLCanvasElement> document.getElementById('cancelledResChart');
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Approved', 'Cancelled', 'No show'],
            datasets: [{
                label: '# of reservations',
                data: [this.reservations.filter(r => !r.status || r.status === 'approved').length, this.reservations.filter(r => r.status === 'cancelled').length, this.reservations.filter(r => r.status === 'no-show').length],
                backgroundColor: ['lightgreen', 'red', 'lightgray'],
                borderColor: ['green', 'darkred', 'gray'],
                borderWidth: 1
            }]
        },
        options: this.options
    });
  }

  setResMonthChart() {
    let reservationMonths = this.getAllMonths()
    const canvas = <HTMLCanvasElement> document.getElementById('roomMonthChart');
    const ctx = canvas.getContext('2d');
    console.log(reservationMonths)
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: reservationMonths.map(r => r.name),
            datasets: [{
                label: '# of reservations',
                data: reservationMonths.map(r => r.num),
                backgroundColor: reservationMonths.map(r => this.getRgbaColor(r.color)),
                borderColor: reservationMonths.map(r => this.getRgbColor(r.color)),
                borderWidth: 1
            }]
        },
        options: this.options
    });
  }
  
  options = {
    plugins: {
      legend: {
        labels: {
          font: {
            size: 15
          }
        }
      }
    },
    scales: {
      y: {
        suggestedMin: 0,
        ticks: {
          font: {
            size: 15,
          },
          beginAtZero: true
        },
      },
      x: {
        ticks: {
          font: {
            size: 15,
          },
          beginAtZero: true
        }
      }
    }
  }

  isAdmin () {
    return localStorage.getItem('admin') !== null
  }

}
