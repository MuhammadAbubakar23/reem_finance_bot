import { Component } from '@angular/core';

import * as echarts from 'echarts';
import { HeaderService } from '../../../core/services/header.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [ CommonModule,SharedModule],
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent {
  avgTokenCount: any
  totalTokenCount: any
  filterDays: any = 1;
  timeSpan: any = "day";
  selectedTimeLabel: any = "Last 24 hours";
  tokenPerDayCount: any;
  averageTokenPerChat: any;
  constructor(private _hS: HeaderService, private _analytics: AnalyticsService) {
    _hS.updateHeaderData({
      title: 'Tokens',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-upload pe-2"
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
    this.AverageTokenPerChat();
    this.TotalToken();
    this.AvgToken();
    this.TokenPerDay();
  }
  TotalToken() {
    this._analytics.TotalToken().subscribe(
      (res: any) => {
        this.totalTokenCount = res.detail;
      },
      (error: any) => {
        console.error("An error occurred while fetching the total token:", error);

      }
    );
  }
  AvgToken() {
    this._analytics.AvgToken().subscribe(
      (res: any) => {
        this.avgTokenCount = res.detail;
      },
      (error: any) => {
        console.error("An error occurred while fetching the avgerage token:", error);
      }
    );
  }
  TokenPerDay() {
    this._analytics.TokenPerDay().subscribe(
      (res: any) => {
        this.tokenPerDayCount = res.detail;
      },
      (error: any) => {
        console.error("An error occurred while fetching the token per day:", error);

      }
    );
  }

  AverageTokenPerChat() {
    this._analytics.GetAverageTokenPerChat().subscribe((response: any) => {
      this.averageTokenPerChat = response.detail


      const detail = response.detail;

      const daysOrMonths = Object.keys(detail).reverse();

      const counts = daysOrMonths.map(day => detail[day].toFixed(2));
      const formattedDaysOrMonths = daysOrMonths.map(date => {
        const [year, month, day] = date.split('-');
        return `${parseInt(month)}/${parseInt(day)}`;
      });

      // const counts = [
      //   parseFloat(response.detail.Monday[0].toFixed(2)),
      //   parseFloat(response.detail.Tuesday[0].toFixed(2)),
      //   parseFloat(response.detail.Wednesday[0].toFixed(2)),
      //   parseFloat(response.detail.Thursday[0].toFixed(2)),
      //   parseFloat(response.detail.Friday[0].toFixed(2)),
      //   parseFloat(response.detail.Saturday[0].toFixed(2)),
      //   parseFloat(response.detail.Sunday[0].toFixed(2))
      // ];
      // this.botEscalationRate(counts);
      setTimeout(() => {
        this.averageToken(counts, formattedDaysOrMonths);
      })
    })
  }
  averageToken(counts: any, daysOrMonths: any) {
    var count = counts
    const formattedDates = daysOrMonths;
    var chartDom = document.getElementById('average');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: formattedDates,
          axisTick: {
            alignWithLabel: true
          }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          color: 'rgb(188,186,251)',
          name: 'Direct',
          type: 'bar',
          barWidth: '60%',
          data: count
        }
      ]
    };

    option && myChart.setOption(option);

  }
  ngOnDestroy() {
    localStorage.setItem("filterDays", "1");
    localStorage.setItem("timeSpan", "day");
  }
}
