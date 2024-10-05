import { Component } from '@angular/core';

import * as echarts from 'echarts';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { HeaderService } from '../../../core/services/header.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sentiments-and-tags',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './sentiments-and-tags.component.html',
  styleUrls: ['./sentiments-and-tags.component.scss']
})
export class SentimentsAndTagsComponent {
  sentimentAnalysis: any;
  humanAgentCsat: any
  filterDays: any = 1;
  timeSpan: any = "day";
  selectedTimeLabel: any = "Last 24 hours";
  constructor(private _hS: HeaderService, private _analytics: AnalyticsService) {
    _hS.updateHeaderData({
      title: 'Sentiments',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-eye-slash pe-2"
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
    this.SentimentAnalysis()
    this.humanCsatApi()
    // this.humanCsat()
  }
  SentimentAnalysis() {
    this._analytics.GetSentimentAnalysis().subscribe(
      (res: any) => {
        this.sentimentAnalysis = res;
        this.sentimentsBOTCsat();
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot sentiment analysis:", error);

      }
    );
  }

  sentimentsBOTCsat() {
    var chartDom = document.getElementById('analysisCsat');
    var myChart = echarts.init(chartDom);
    const sentiments = this.sentimentAnalysis;
    const totalSentiments = sentiments?.positive + sentiments?.negative + sentiments?.neutral;
    const data = [
      {
        value: sentiments?.positive,
        name: 'Positive',
        itemStyle: {
          color: '#abedd0'
        }
      },
      {
        value: sentiments?.negative,
        name: 'Negative',
        itemStyle: {
          color: '#ffcccf'
        }
      },
      {
        value: sentiments?.neutral,
        name: 'Neutral',
        itemStyle: {
          color: '#ffe0b3'
        }
      }
    ];

    var option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Sentiments',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: function () {
              // Apply the thousandSuff logic directly here
              const formatValue = (value: number): string => {
                if (value >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M';
                }
                if (value >= 1000) {
                  return (value / 1000).toFixed(1) + 'K';
                }
                return value.toString();
              };
              return `\n${formatValue(totalSentiments)}\n{interaction|Interactions}`;
            },
            rich: {
              interaction: {
                fontSize: 12,
                padding: [10, 0, 0, 0]
              }
            },
            fontSize: 20,
            fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 24,
              fontWeight: 'bold',
              formatter: '{c}'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    //option.series[0].label.formatter = `\n${totalSentiments}\n{interaction|Interactions}`;
    myChart.setOption(option);

  }
  humanCsatApi() {
    this._analytics.GetHumanAgentCsat().subscribe(
      (res: any) => {
        this.humanAgentCsat = res;
        this.humanCsat();
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot sentiment analysis:", error);

      }
    );
  }
  humanCsat() {
    var chartDom = document.getElementById('humanCsat');
    var myChart = echarts.init(chartDom);
    const sentiments = this.humanAgentCsat;
    const totalSentiments = sentiments?.positive + sentiments?.negative + sentiments?.neutral;
    const data = [
      {
        value: sentiments?.positive,
        name: 'Positive',
        itemStyle: {
          color: '#abedd0'
        }
      },
      {
        value: sentiments?.negative,
        name: 'Negative',
        itemStyle: {
          color: '#ffcccf'
        }
      },
      {
        value: sentiments?.neutral,
        name: 'Neutral',
        itemStyle: {
          color: '#ffe0b3'
        }
      }
    ];

    var option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Sentiments',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: function () {
              // Apply the thousandSuff logic directly here
              const formatValue = (value: number): string => {
                if (value >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M';
                }
                if (value >= 1000) {
                  return (value / 1000).toFixed(1) + 'K';
                }
                return value.toString();
              };
              return `\n${formatValue(totalSentiments)}\n{interaction|Interactions}`;
            },
            rich: {
              interaction: {
                fontSize: 12,
                padding: [10, 0, 0, 0]
              }
            },
            fontSize: 20,
            fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 24,
              fontWeight: 'bold',
              formatter: '{c}'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    //option.series[0].label.formatter = `\n${totalSentiments}\n{interaction|Interactions}`;
    myChart.setOption(option);

  }
  ngOnDestroy() {
    localStorage.setItem("filterDays", "1");
    localStorage.setItem("timeSpan", "day");
  }
}
