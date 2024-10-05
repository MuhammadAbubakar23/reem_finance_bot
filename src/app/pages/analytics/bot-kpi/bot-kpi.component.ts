import { Component } from '@angular/core';

import * as echarts from 'echarts';
import { HeaderService } from '../../../core/services/header.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-bot-kpi',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './bot-kpi.component.html',
  styleUrls: ['./bot-kpi.component.scss']
})
export class BotKpiComponent {
  sessionTime: any;
  fallRate: any;
  filterDays: any = 1;
  timeSpan: any = "day";
  selectedTimeLabel: any = "Last 24 hours";
  fallbackRateCount: any = 0;
  sessiontimeout: any;
  botEsclationRate: any;
  avgWaitTime: any;
  peakHours: any[] = [];
  totalBotSessionsOvertimeData: any;
  humanTransferRateData: any;
  formattedDaysOrMonths: any;
  constructor(private _hS: HeaderService, private _analytics: AnalyticsService) {
    _hS.updateHeaderData({
      title: 'Bot Kpi',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-calendar pe-2"
    })
  }
  ngOnInit(): void {
    this.refreshCharts()
    localStorage.setItem("filterDays", this.filterDays);
    localStorage.setItem("timeSpan", this.timeSpan);
  }
  get getTimeSpan() {
    return localStorage.getItem("timeSpan")
  }
  refreshFilters(NumberOfDays: any, timeSpan: any, selectedTimeLabel: any) {
    this.filterDays = NumberOfDays;
    this.timeSpan = timeSpan;
    this.selectedTimeLabel = selectedTimeLabel;
    // const filterDays = { filterDays: this.filterDays, timeSpan: this.timeSpan };
    localStorage.setItem("filterDays", this.filterDays);
    localStorage.setItem("timeSpan", this.timeSpan);
    this.refreshCharts();
  }
  refreshCharts() {
    this.BotEsclationRate();
    this.AvgWaitTime();
    this.TimeoutCount();
    this.PeakHours();


    //this.fallback();
    //this.abadonRate();
    //this.waitTime();
    // this.botSessionTime();
    this.totalBotSessionOvertime();
    this.FallBackCount()
    this.HumanTransferRate()
    this.heatMap();
    this.TimeoutCount()
  }
  BotEsclationRate() {
    this._analytics.GetBotEsclationRate().subscribe(
      (res: any) => {
        this.botEsclationRate = res;
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot esclation rate:", error);

      }
    );
  }
  AvgWaitTime() {
    this._analytics.GetAvgWaitTime().subscribe(
      (res: any) => {
        this.avgWaitTime = res;
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot avgerage wait time:", error);

      }
    );
  }
  TimeoutCount() {
    this._analytics.TimeoutCount().subscribe(
      (res: any) => {
        // const countData = res.count
        // const countKey = Object.keys(countData)[0];
        // this.sessiontimeout = countData[countKey];;
        this.sessiontimeout = res;

      },
      (error: any) => {
        console.error("An error occurred while fetching the timeout count:", error);

      }
    );
  }
  peakhoursData: any[] = []
  PeakHours() {
    this._analytics.GetPeakHours().subscribe(
      (res: any) => {
        this.peakHours = res.detail;
        let index = 0;
        let hours = 0;
        for (const [day, values] of Object.entries(this.peakHours)) {
          values.forEach((value: number, hour: number) => {
            this.peakhoursData.push([index, hour, value]);
          });
          index++;
        }
        const daysOrMonths = Object.keys(this.peakHours);
        this.formattedDaysOrMonths = daysOrMonths.map(date => {
          const [year, month, day] = date.split('-');
          return `${parseInt(month)}/${parseInt(day)}`;
        });
        this.heatMap();
      },
      (error: any) => {
        console.error("An error occurred while fetching the peak hours:", error);

      }
    );
  }


  HumanTransferRate() {
    // this.spinner.show()
    this.fallbackRateCount = 0;
    this._analytics.GethumanTransferRate().subscribe((response: any) => {
      // this.spinner.hide()
      this.humanTransferRateData = response.detail;
      const detail = response.detail;

      const daysOrMonths = Object.keys(detail).reverse();

      const counts = daysOrMonths.map(day => detail[day]);

      this.humanTransferRateData = response.detail;
      // const counts = [
      //   response.detail.Monday[0],
      //   response.detail.Tuesday[0],
      //   response.detail.Wednesday[0],
      //   response.detail.Thursday[0],
      //   response.detail.Friday[0],
      //   response.detail.Saturday[0],
      //   response.detail.Sunday[0]
      // ];
      counts.forEach((count: any) => {
        this.fallbackRateCount = this.fallbackRateCount + count;
      })
      const formattedDaysOrMonths = daysOrMonths.map(date => {
        const [year, month, day] = date.split('-');
        return `${parseInt(month)}/${parseInt(day)}`;
      });
      // setTimeout(() => {
      //   this.botEscalationRate(counts);
      // })
    })
  }


  FallBackCount() {
    // this.spinner.show()
    this._analytics.FallBackCount().subscribe(
      (res: any) => {
        const countData = res.count
        const countKey = Object.keys(countData)[0];
        this.fallbackRateCount = countData[countKey];;
        //this.fullBackRate();
        // this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot conversation:", error);
        // this.spinner.hide()

      }
    );
  }
  makeChart() {
    window.addEventListener('resize', () => {
      if (this.sessionTime) {
        this.sessionTime.resize();
      }
    });
  }
  waitTime() {
    var chartDom = document.getElementById('waitTime');
    this.fallRate = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },

      xAxis: [
        {
          show: false,
          type: 'category',

          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      series: [
        {
          color: '#a3a0fb',
          type: 'bar',
          barWidth: '85%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };

    option && this.fallRate.setOption(option);
  }
  heatMap() {
    var chartDom = document.getElementById('heatMap');
    var myChart = echarts.init(chartDom);
    var option;

    // prettier-ignore
    const hours = [
      '0', '1', '2', '3', '4', '5', '6',
      '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17',
      '18', '19', '20', '21', '22', '23'
    ];
    // prettier-ignore
    const days = this.formattedDaysOrMonths
    // prettier-ignore
    const data = this.peakhoursData
      .map(function (item) {
        return [item[1], item[0], item[2] || '-'];
      });
    option = {
      tooltip: {
        position: 'top'
      },
      grid: {
        height: '50%',
        top: '10%'
      },
      xAxis: {
        type: 'category',
        data: hours,
        splitArea: {
          show: true
        }
      },
      yAxis: {
        type: 'category',
        data: days,
        splitArea: {
          show: true
        }
      },
      visualMap: {
        min: 0,
        max: 10,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '15%',
        inRange: {
          color: ['#b9ddf4', '#0e90e2']
        }
      },
      series: [
        {
          name: 'Peak Hours',
          type: 'heatmap',
          data: data,
          label: {
            show: true
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };

    option && myChart.setOption(option);

  }
  getIntegerPart(rate: number): number {
    return parseFloat((rate > 0 ? rate : 0).toFixed(2));
  }
  fallback() {
    var chartDom = document.getElementById('fallbackrate');
    const myChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },

      xAxis: [
        {
          show: false,
          type: 'category',

          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      series: [
        {
          color: '#328cdd',
          type: 'bar',
          barWidth: '85%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };

    option && myChart.setOption(option);
  }
  abadonRate() {
    var chartDom = document.getElementById('abadonRate');
    const myChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },

      xAxis: [
        {
          show: false,
          type: 'category',

          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      series: [
        {
          color: '#f8cf61',
          type: 'bar',
          barWidth: '85%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };

    option && myChart.setOption(option);
  }
  fullBackRate() {
    var chartDom = document.getElementById('backRate');
    this.fallRate = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },

      xAxis: [
        {
          show: false,
          type: 'category',

          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          show: false,
          type: 'value'
        }
      ],
      series: [
        {
          color: '#d475ef',
          type: 'bar',
          barWidth: '85%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };

    option && this.fallRate.setOption(option);
  }
  totalBotSessionOvertime() {
    this._analytics.GetTotalBotSessionsOvertime().subscribe((response: any) => {
      this.totalBotSessionsOvertimeData = response.detail;
      const daysOrMonths = Object.keys(response.detail).reverse();

      // Extract avg_handle_time for each day
      const avg_handle_time = daysOrMonths.map(day => response.detail[day].avg_handle_time.toFixed(2));

      // Extract human_transfer_rate for each day
      const human_transfer_rate = daysOrMonths.map(day => response.detail[day].human_transfer_rate.toFixed(2));

      // Extract session_timeout for each day
      const session_timeout = daysOrMonths.map(day => response.detail[day].session_timeout.toFixed(2));
      const formattedDaysOrMonths = daysOrMonths.map(date => {
        const [year, month, day] = date.split('-');
        return `${parseInt(month)}/${parseInt(day)}`;
      });
      setTimeout(() => {
        this.botSessionTime(avg_handle_time, human_transfer_rate, session_timeout, formattedDaysOrMonths);
      });
    });
  }
  botSessionTime(avg_handle_time: any, human_transfer_rate: any, session_timeout: any, daysOrMonths: any) {
    console.log("daysOrMonths = ", daysOrMonths)
    console.log("avg_handle_time = ", avg_handle_time)
    console.log("human_transfer_rate = ", human_transfer_rate)
    console.log("session_timeout = ", session_timeout)
    const formattedDates = daysOrMonths;
    const timeoutData = session_timeout;
    const fallbackData = human_transfer_rate;
    const averageHandleTime = avg_handle_time

    var chartDom = document.getElementById('sessionTime');
    this.sessionTime = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Average Handle Time', 'Session Timeout', 'Human Transfer rate'],
        icon: 'square',
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: formattedDates
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Average Handle Time',
          type: 'line',
          stack: 'Total',
          data: averageHandleTime,
          lineStyle: {
            color: '#FAC858',
          }
        },
        {
          name: 'Session Timeout',
          type: 'line',
          stack: 'Total',
          data: timeoutData,
          lineStyle: {
            color: '#91CC75',
          }
        },
        {
          name: 'Human Transfer rate',
          type: 'line',
          stack: 'Total',
          data: fallbackData,
          lineStyle: {
            color: '#6a4fe3',
          }
        }
      ]
    };

    option && this.sessionTime.setOption(option);

  }
  ngOnDestroy() {
    localStorage.setItem("filterDays", "1");
    localStorage.setItem("timeSpan", "day");
  }
}
