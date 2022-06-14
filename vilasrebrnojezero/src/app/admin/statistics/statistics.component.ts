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
import { RoomsService } from 'src/services/rooms/rooms.service';
import { TranslationsService } from 'src/services/translations.service';
import { VisitorService } from 'src/services/visitor.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  constructor(private visitorService: VisitorService, private resService: ReservationsService, private roomService: RoomsService, private translateService: TranslationsService) {}

  reservations = []
  rooms = []

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
      this.roomService.getRoomNumbers().subscribe((roomsNum:any)=>{
        this.rooms = roomsNum
        this.visitorService.getAll().subscribe((v:any)=>{
          this.visits = v
          this.setCharts()
        })
      })
    })
  }

  visits = []
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  getAllMonths() {
    let resMonths = []
    this.reservations.forEach(r => {
      let month = new Date(r.date_from).getMonth()
      let resMon = resMonths.find(m => m.name === this.months[month])
      if (resMon) {
        resMon.num++
        resMon.totalAmount += r.price
      } else {
        let color = {c1: this.randomIntFromInterval(0,255), c2: this.randomIntFromInterval(0,255), c3: this.randomIntFromInterval(0,255)}
        resMonths.push({name: this.months[month], num: 1, totalAmount: r.price, index: month, color: color})
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
    this.setResRoomChart()
    this.setResRevenueChart()
    this.setResSuccessChart()
    this.setBookingInAdvanceChart()
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
        options: {
          plugins: {
            legend: {
              labels: {
                font: {
                  size: 15
                }
              }
            }
          },
          scales: { x: { display: false} }
        }
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
                borderWidth: 1,
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

  setResRoomChart() {
    let roomsRes = []
    let roomNames = this.rooms.reduce(function(rv, x) {
      (rv[x['name']] = rv[x['name']] || []).push(x['id']);
      return rv;
    }, {});
    let roomNamesKeys = Object.keys(roomNames)

    for (let i = 0; i < roomNamesKeys.length; i++) {
      let resRoom = this.reservations.filter(res => roomNames[roomNamesKeys[i]].includes(res.room) )
      roomsRes.push({room: roomNamesKeys[i], count: resRoom.length})
    }
   
    const canvas = <HTMLCanvasElement> document.getElementById('resRoomChart');
    const ctx = canvas.getContext('2d');
  
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: roomsRes.map(r => r.room),
            datasets: [{
                label: '# of reservations',
                data: roomsRes.map(r => r.count),
                backgroundColor: '#c1e1ec',
                borderColor:'black',
                borderWidth: 1
            }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }      
    });
  }

  setResRevenueChart() {
    let revenueMonths = this.getAllMonths()
    const canvas = <HTMLCanvasElement> document.getElementById('resRevenueChart');
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: revenueMonths.map(r => r.name),
            datasets: [{
                label: 'Total Amount in RSD',
                data: revenueMonths.map(r => r.totalAmount),
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                borderColor:'rgb(153, 102, 255)',
                borderWidth: 1
            }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }   
    });
  }

  setResSuccessChart() {
    const canvas = <HTMLCanvasElement> document.getElementById('resSuccessChart');
    const ctx = canvas.getContext('2d');
    console.log(this.visits)
    console.log(this.visits.filter(v => v.reserved).length)
    const myChart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: ['Didn\' Book reservation', 'Booked reservation'],
          datasets: [{
              data: [this.visits.length - this.visits.filter(v => v.reserved).length, this.visits.filter(v => v.reserved).length],
              backgroundColor: ['lightgray', 'lightgreen']
          }]
      },
      options: {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 15
              }
            }
          }
        },
        scales: { x: { display: false} }
      }
    });
  }

  calculateDaysInAdvance(min, max = null) {
    return this.reservations.filter(r => {
      let diff = new Date(r.date_from).getTime() - (new Date(r.timestamp)).getTime()
      let days = Math.ceil(diff / (1000 * 3600 * 24));
      return days >= min && (max ? days <= max : true)
    }).length
  }

  setBookingInAdvanceChart() {
    const canvas = <HTMLCanvasElement> document.getElementById('resDaysInAdvanceChart');
    const ctx = canvas.getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: ['0-1', '2-7', '8-15', 'more'],
          datasets: [{
              label: '# of reservations',
              data: [this.calculateDaysInAdvance(0, 1), this.calculateDaysInAdvance(2,7), this.calculateDaysInAdvance(8,15), this.calculateDaysInAdvance(16)],
              backgroundColor: ['rgba(132, 140, 207, 1)', 'rgba(132, 140, 207, 0.8)', 'rgba(132, 140, 207, 0.6)', 'rgba(132, 140, 207, 0.4)']
          }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }


  isAdmin () {
    return localStorage.getItem('admin') !== null
  }

}
