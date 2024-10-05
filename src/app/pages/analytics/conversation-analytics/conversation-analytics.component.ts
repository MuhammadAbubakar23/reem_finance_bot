import { Component } from '@angular/core';

import * as echarts from 'echarts';

import { NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from '../../../core/services/header.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-conversation-analytics',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './conversation-analytics.component.html',
  styleUrls: ['./conversation-analytics.component.scss']
})
export class ConversationAnalyticsComponent {
  totalBot: any;
  fallback: any
  humanbot: any;
  botConversation: any;
  agents: any;
  avgBotConversationTime: any;
  tagsAnalatics: any;
  totalAgentChart: any;
  botTagsChart: any;
  filterDays: any = 1;
  timeSpan: any = "day";
  selectedTimeLabel: any = "Last 24 hours";
  humanTransferRateData: any;
  fallbackRateCount: any;
  constructor(private _hS: HeaderService, private _analytics: AnalyticsService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Conversation Analytics',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fal fa-cubes pe-2"
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
    this.TotalConversation();
    this.TotalAgents();
    this.AvgBotConversationTime();
    this.TagsAnalatics();
    // this.botEscalationRate();
    this.HumanTransferRate();
    this.conversationOverTime();
  }
  TotalConversation() {
    this._analytics.GetTotalBotConversation().subscribe(
      (res: any) => {
        this.botConversation = res;
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot conversation:", error);

      }
    );
  }
  TotalAgents() {
    this._analytics.GetTotalAgents().subscribe(
      (res: any) => {
        this.agents = res?.detail;
        this.fallBackRate();
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot agents:", error);

      }
    );
  }
  fallBackRate() {
    var chartDom = document.getElementById('fallbackrate');
    this.totalAgentChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {

          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 0,
            borderColor: '#fff',
            borderWidth: 0
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 50,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: this.agents?.total_agents, name: 'Total Agents', itemStyle: { color: '#2f9df2' } },
            { value: this.agents?.available_agents, name: 'Available Agents', itemStyle: { color: '#cf61ea' } }
          ]
        }
      ]
    };


    option && this.totalAgentChart.setOption(option);
  }

  AvgBotConversationTime() {
    this._analytics.GetAvgBotConversationTime().subscribe(
      (res: any) => {
        this.avgBotConversationTime = res;
      },
      (error: any) => {
        console.error("An error occurred while fetching the average bot converstion time:", error);

      }
    );
  }
  TagsAnalatics() {
    this._analytics.GetTagsAnalatics().subscribe(
      (res: any) => {
        this.tagsAnalatics = res?.detail;
        this.BotTagst();
      },
      (error: any) => {
        console.error("An error occurred while fetching the tag analytics:", error);

      }
    );
  }
  BotTagst() {
    var chartDom = document.getElementById('Botatgs');
    this.botTagsChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Tags From',
          type: 'pie',
          radius: ['40%', '70%'],

          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: false,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: this.tagsAnalatics?.Information, name: 'Information',
              itemStyle: {
                color: '#2f9df2'
              }
            },
            {
              value: this.tagsAnalatics?.Sell, name: 'Sell',
              itemStyle: {
                color: '#cf61ea'
              }
            },
            {
              value: this.tagsAnalatics?.Analysis, name: 'Analysis',
              itemStyle: {
                color: '#9c87ee'
              }
            },
            {
              value: this.tagsAnalatics?.Reservation, name: 'Reservation',
              itemStyle: {
                color: '#ff505c'
              }
            },
            {
              value: this.tagsAnalatics?.Complaint, name: 'Complaint',
              itemStyle: {
                color: '#3cc2cc'
              }
            }
          ]
        }
      ]
    };

    option && this.botTagsChart.setOption(option);

  }
  HumanTransferRate() {
    this.spinner.show()
    this.fallbackRateCount = 0;
    this._analytics.GethumanTransferRate().subscribe((response: any) => {
      this.spinner.hide()

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
      setTimeout(() => {
        this.botEscalationRate(counts, formattedDaysOrMonths);
      })
    },
      (error: any) => {
        console.error(error.error);
        this.spinner.hide();
      }
    )
  }
  getIntegerPart(rate: number): number {
    return parseFloat((rate > 0 ? rate : 0).toFixed(2));
  }
  botEscalationRate(counts: any, daysOrMonths: any) {
    const formattedDates = daysOrMonths;
    const values = counts;
    var chartDom = document.getElementById('BotRate');
    var myChart = echarts.init(chartDom);

    var option;

    option = {
      tooltip: {
        trigger: 'axis',
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
          // axisLabel: {
          //   rotate: 45,
          //   interval: 0
          // }
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Escalations',
          type: 'bar',
          barWidth: '40%',
          data: values,
          itemStyle: {
            color: '#007bff'
          },
        }
      ]
    };

    option && myChart.setOption(option);
  }
  conversationOverTime() {
    this.spinner.show();
    this._analytics.ConversationOverTimeData(1).subscribe(
      (response: any) => {
        const detail = response.detail;

        const daysOrMonths = Object.keys(detail).reverse();
        const counts = daysOrMonths.map(day => detail[day]);
        const formattedDaysOrMonths = daysOrMonths.map(date => {
          const [year, month, day] = date.split('-');
          return `${parseInt(month)}/${parseInt(day)}`;
        });
        this.totalBotConversation(counts, formattedDaysOrMonths);

        console.log(daysOrMonths);

        this.spinner.hide();
      },
      (error: any) => {
        console.error(error.error);
        this.spinner.hide();
      }
    );
  }
  totalBotConversation(count: any, date: any) {
    const dates = date;
    const counts = count;
    var chartDom = document.getElementById('main');
    this.totalBot = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const date = params[0].name;
          const conversationCount = params[0].value;
          return `${date}<br/>Conversations: ${conversationCount}`;
        }
      },
      grid: {
        left: '4%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        // axisLabel: {
        //   rotate: 45,
        //   interval: 0
        // }
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: counts,
          type: 'line',
          areaStyle: {
            color: 'rgba(0, 123, 255, 0.5)'
          },
          lineStyle: {
            color: '#007bff',
            width: 3
          },
          itemStyle: {
            color: '#007bff'
          },
          barWidth: '80%',
        }
      ]
    };
    option && this.totalBot.setOption(option);

  }

  makeChart() {
    window.addEventListener('resize', () => {
      if (this.fallback) {
        this.fallback.resize();
      }
    });
  }
  human() {
    window.addEventListener('resize', () => {
      if (this.humanbot) {
        this.humanbot.resize();
      }
    });
  }
  ngOnDestroy() {
    localStorage.setItem("filterDays", "1");
    localStorage.setItem("timeSpan", "day");
  }
}
