import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';


import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { HeaderService } from '../../../core/services/header.service';
import { bot_id } from '../../../../main';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-ai-bot-analytics',
  standalone: true,
  imports: [ CommonModule,NgxSpinnerModule,SharedModule],
  templateUrl: './ai-bot-analytics.component.html',
  styleUrls: ['./ai-bot-analytics.component.scss']
})
export class AiBotAnalyticsComponent {
  totalBot: any
  filterDays: any = 1;
  fallRate: any;
  userRetentionRate: any;
  sessionTime: any;
  avgHandleTimeChart: any;
  botConversation: any;
  sessiontimeout: any;
  fallbackRateCount: any = 0;
  avgTokenCount: any;
  totalTokenCount: any;
  tokenPerDayCount: any;
  agents: any;
  messagesData: any;
  sessionContainmentRate: any;
  avgBotConversationTime: any;
  botEsclationRate: any;
  avgWaitTime: any;
  sentimentAnalysis: any;
  tagsAnalatics: any;
  peakHours: any[] = [];
  peakhoursData: any[] = []
  humanTransferRateData: any;
  averageTokenPerChat: any;
  totalBotSessionsOvertimeData: any;
  timeSpan: any = "day";
  selectedTimeLabel: any = "Last 24 hours";
  formattedDaysOrMonths: any;
  csat: any;
  csatCount: any;
  csatChart: any;
  csatPercentage: any;
  constructor(private _hS: HeaderService, private _analytics: AnalyticsService, private spinner: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Conversations',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-message-lines pe-1"
    })
  }
  ngOnInit(): void {
    // this.websocketService.messages.subscribe(message => {
    //   console.log('Received message:', message);
    // });
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
    this.botCsat();
    this.HumanTransferRate();
    this.AverageTokenPerChat();
    this.TotalConversation();
    this.TotalAgents();
    this.AvgBotConversationTime();
    this.BotEsclationRate();
    this.SessionContainmentRate();
    this.AvgWaitTime();
    this.SentimentAnalysis();
    this.TagsAnalatics();
    this.TotalToken();
    this.AvgToken();
    this.TimeoutCount();
    this.totalMessages();
    this.TokenPerDay();
    this.UserRetentionRate();
    this.PeakHours();
    this.conversationOverTime();
    this.totalBotSessionOvertime();
  }
  botCsat() {
    const action = {
      "bot_id":bot_id,
      "filter_days":localStorage.getItem("filterDays"),
      "action":"tokens_per_day"
    }
    // this.websocketService.send(action);
    this._analytics.getBotcsat().subscribe((res: any) => {
      this.csat = res;
      this.csatCount = res.one + res.two + res.three + res.four + res.five
      this.csatPercentage = ((res.five + res.four) / this.csatCount) * 100;

      this.getCsatChart(this.csat);
    })
  }
  TotalConversation() {
    this.spinner.show()
    this._analytics.GetTotalBotConversation().subscribe(
      (res: any) => {
        this.botConversation = res;
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot conversation:", error);
        this.spinner.hide()
      }
    );
  }
  TotalAgents() {
    this.spinner.show()
    this._analytics.GetTotalAgents().subscribe(
      (res: any) => {
        this.agents = res.detail;
        this.fallBackRate();
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot agents:", error);
        this.spinner.hide()
      }
    );
  }
  fallBackRate() {
    var chartDom = document.getElementById('fallbackrate');
    var myChart = echarts.init(chartDom);
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
            { value: this.agents?.total_agents, name: 'Total Agents', itemStyle: { color: '#5454fb' } },
            { value: this.agents?.available_agents, name: 'Available Agents', itemStyle: { color: '#25D366' } }
          ]
        }
      ]
    };


    option && myChart.setOption(option);
  }

  AvgBotConversationTime() {
    this.spinner.show()
    this._analytics.GetAvgBotConversationTime().subscribe(
      (res: any) => {
        this.avgBotConversationTime = res;
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the average bot converstion time:", error);
        this.spinner.hide()
      }
    );
  }
  BotEsclationRate() {
    this.spinner.show()
    this._analytics.GetBotEsclationRate().subscribe(
      (res: any) => {
        this.botEsclationRate = res;
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot esclation rate:", error);
        this.spinner.hide()
      }
    );
  }
  getIntegerPart(rate: number): number {
    return parseFloat((rate > 0 ? rate : 0).toFixed(2));
  }
  AvgWaitTime() {
    this.spinner.show()
    this._analytics.GetAvgWaitTime().subscribe(
      (res: any) => {
        this.avgWaitTime = res;
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot avgerage wait time:", error);
        this.spinner.hide()
      }
    );
  }
  SentimentAnalysis() {
    this.spinner.show()
    this._analytics.GetSentimentAnalysis().subscribe(
      (res: any) => {
        this.sentimentAnalysis = res;
        this.sentimentsBOTCsat();
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot sentiment analysis:", error);
        this.spinner.hide()
      }
    );
  }
  TagsAnalatics() {
    this.spinner.show()
    this._analytics.GetTagsAnalatics().subscribe(
      (res: any) => {
        this.tagsAnalatics = res.detail;
        this.BotTagst();
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the tag analytics:", error);
        this.spinner.hide()
      }
    );
  }

  PeakHours() {
    this.spinner.show()
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
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the peak hours:", error);
        this.spinner.hide()
      }
    );
  }
  TotalToken() {
    this.spinner.show()
    this._analytics.TotalToken().subscribe(
      (res: any) => {
        this.totalTokenCount = res.detail;
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the total token:", error);
        this.spinner.hide()
      }
    );
  }
  AvgToken() {
    this.spinner.show()
    this._analytics.AvgToken().subscribe(
      (res: any) => {
        // const tokenData = res.tokens;
        // const tokenValues = Object.values(tokenData) as number[];
        // const totalTokens = tokenValues.reduce((acc, value) => acc + value, 0);
        // const averageTokens = totalTokens / tokenValues.length;
        // this.avgTokenCount = averageTokens.toFixed(0);
        //res && res['avg tokens'] !== undefined
        this.avgTokenCount = res.detail;
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the avgerage token:", error);
        this.spinner.hide()
      }
    );
  }
  TimeoutCount() {
    this.spinner.show()
    this._analytics.TimeoutCount().subscribe(
      (res: any) => {
        this.sessiontimeout = res;
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the timeout count:", error);
        this.spinner.hide()
      }
    );
  }
  TokenPerDay() {
    this.spinner.show()
    this._analytics.TokenPerDay().subscribe(
      (res: any) => {
        this.tokenPerDayCount = res.detail;
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the token per day:", error);
        this.spinner.hide()
      }
    );
  }

  UserRetentionRate() {
    this._analytics.GetUserRetentionRate().subscribe((res: any) => {
      this.userRetentionRate = res.detail;
    })
  }

  FallBackCount() {
    this.spinner.show()
    this._analytics.FallBackCount().subscribe(
      (res: any) => {
        const countData = res.count
        const countKey = Object.keys(countData)[0];
        this.fallbackRateCount = countData[countKey];;
        //this.fullBackRate();
        this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the bot conversation:", error);
        this.spinner.hide()

      }
    );
  }

  // conversationOverTime() {
  //   this.spinner.show()
  //   this._analytics.ConversationOverTimeData(1).subscribe((response: any) => {
  //     const counts = [
  //       response.detail.Monday[0],
  //       response.detail.Tuesday[0],
  //       response.detail.Wednesday[0],
  //       response.detail.Thursday[0],
  //       response.detail.Friday[0],
  //       response.detail.Saturday[0],
  //       response.detail.Sunday[0]
  //     ];
  //     this.totalBotConversation(counts);
  //     this.spinner.hide()
  //   },
  //     (error: any) => {
  //       console.error(error.error);
  //     }
  //   )
  // }
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

        console.log(formattedDaysOrMonths);

        this.spinner.hide();
      },
      (error: any) => {
        console.error(error.error);
        this.spinner.hide();
      }
    );
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
  totalBotConversation(count: any, date: any) {
    const dates = this.formatDates(date);
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
        left: '13%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        name: 'Date(s)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14, // Increase font size
          fontWeight: 'bold', // Make the text bold
          color: '#000000',
          padding: 15
        }
        // axisLabel: {
        //   rotate: 45,
        //   interval: 0
        // }
      },
      yAxis: {
        type: 'value',
        name: 'Conversation(s)', // Label on the left side (y-axis)
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold', // Make the text bold
          color: '#000000',
          padding: 20
        }
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
  // botEscalationRate(counts: any, daysOrMonths: any) {
  //   const formattedDates = daysOrMonths;
  //   const values = counts;
  //   var chartDom = document.getElementById('BotRate');
  //   var myChart = echarts.init(chartDom);

  //   var option;

  //   option = {
  //     tooltip: {
  //       trigger: 'axis',
  //     },
  //     grid: {
  //       left: '10%',
  //       right: '4%',
  //       bottom: '10%',
  //       containLabel: true
  //     },
  //     xAxis: [
  //       {
  //         type: 'category',
  //         data: formattedDates,
  //         axisTick: {
  //           alignWithLabel: true
  //         },
  //         name: 'Date(s)', // Label at the bottom (x-axis)
  //         nameLocation: 'middle',
  //         nameTextStyle: {
  //           fontSize: 14,
  //           fontWeight: 'bold', // Make the text bold
  //           color: '#000000',
  //           padding: 15
  //         }
  //         // axisLabel: {
  //         // rotate: 45,
  //         // interval: 0
  //         // }
  //       }
  //     ],
  //     yAxis: [
  //       {
  //         type: 'value',
  //         name: 'Conversation(s)', // Label on the left side (y-axis)
  //         nameLocation: 'middle',
  //         nameTextStyle: {
  //           fontSize: 14,
  //           fontWeight: 'bold', // Make the text bold
  //           color: '#000000',
  //           padding: 15
  //         }
  //       }
  //     ],
  //     series: [
  //       {
  //         name: 'Escalations',
  //         type: 'bar',
  //         barWidth: '40%',
  //         data: values,
  //         itemStyle: {
  //           color: '#007bff'
  //         },
  //       }
  //     ]
  //   };

  //   option && myChart.setOption(option);
  // }
  botEscalationRate(counts: any, daysOrMonths: any) {
    const formattedDates = this.formatDates(daysOrMonths);
    const values = counts;
    var chartDom = document.getElementById('BotRate');
    var myChart = echarts.init(chartDom);

    var option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const date = params[0].name;
          const escalationCount = params[0].value;
          return `${date}<br/>Escalations: ${escalationCount}`;
        }
      },
      grid: {
        left: '13%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: formattedDates,
        name: 'Date(s)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000000',
          padding: 15
        },
        // axisLabel: {
        //   rotate: 45,
        //   interval: 0
        // }
      },
      yAxis: {
        type: 'value',
        name: 'Handover(S)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000000',
          padding: 20
        }
      },
      series: [
        {
          name: 'Escalations',
          type: 'line',
          data: values,
          areaStyle: {
            color: 'rgba(0, 123, 255, 0.5)' // Match the area style color of the first chart
          },
          lineStyle: {
            color: '#007bff', // Match the line color of the first chart
            width: 3 // Match the line width of the first chart
          },
          itemStyle: {
            color: '#007bff' // Match the item color of the first chart
          },
          // barWidth: '80%', // Remove barWidth as this is a line chart
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
  abadonRate() {
    var chartDom = document.getElementById('abadonRate');
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
          color: '#f8cf61',
          type: 'bar',
          barWidth: '85%',
          data: [10, 52, 200, 334, 390, 330, 220]
        }
      ]
    };

    option && this.fallRate.setOption(option);
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
  // totalBotSessionOvertime() {
  //   this._analytics.GetTotalBotSessionsOvertime().subscribe((response: any) => {
  //     this.totalBotSessionsOvertimeData = response.detail;
  //     const avg_handle_time = [
  //       response.detail.Monday.avg_handle_time,
  //       response.detail.Tuesday.avg_handle_time,
  //       response.detail.Wednesday.avg_handle_time,
  //       response.detail.Thursday.avg_handle_time,
  //       response.detail.Friday.avg_handle_time,
  //       response.detail.Saturday.avg_handle_time,
  //       response.detail.Sunday.avg_handle_time
  //     ];
  //     const human_transfer_rate = [
  //       response.detail.Monday.human_transfer_rate,
  //       response.detail.Tuesday.human_transfer_rate,
  //       response.detail.Wednesday.human_transfer_rate,
  //       response.detail.Thursday.human_transfer_rate,
  //       response.detail.Friday.human_transfer_rate,
  //       response.detail.Saturday.human_transfer_rate,
  //       response.detail.Sunday.human_transfer_rate
  //     ];
  //     const session_timeout = [
  //       response.detail.Monday.session_timeout,
  //       response.detail.Tuesday.session_timeout,
  //       response.detail.Wednesday.session_timeout,
  //       response.detail.Thursday.session_timeout,
  //       response.detail.Friday.session_timeout,
  //       response.detail.Saturday.session_timeout,
  //       response.detail.Sunday.session_timeout
  //     ];
  //     setTimeout(() => {
  //       this.botSessionTime(avg_handle_time, human_transfer_rate, session_timeout)
  //     })
  //   })
  // }
  totalBotSessionOvertime() {
    this._analytics.GetTotalBotSessionsOvertime().subscribe((response: any) => {
      this.totalBotSessionsOvertimeData = response.detail;
      const daysOrMonths = Object.keys(response.detail).reverse();
      const avg_handle_time = daysOrMonths.map(day => response.detail[day].avg_handle_time.toFixed(2));
      const human_transfer_rate = daysOrMonths.map(day => response.detail[day].human_transfer_rate.toFixed(2));
      const session_timeout = daysOrMonths.map(day => response.detail[day].session_timeout.toFixed(2));
      const formattedDaysOrMonths = daysOrMonths.map(date => {
        const [year, month, day] = date.split('-');
        return `${parseInt(month)}/${parseInt(day)}`;
      });
      setTimeout(() => {
        // this.botSessionTime(avg_handle_time, human_transfer_rate, session_timeout, formattedDaysOrMonths);
        this.botAverageHandleTime(avg_handle_time, formattedDaysOrMonths);
      });
    });
  }

  // botSessionTime(avg_handle_time: any, human_transfer_rate: any, session_timeout: any, daysOrMonths:any) {
  //   console.log("daysOrMonths = ", daysOrMonths)
  //   console.log("avg_handle_time = ", avg_handle_time)
  //   console.log("human_transfer_rate = ", human_transfer_rate)
  //   console.log("session_timeout = ", session_timeout)
  //   const formattedDates = daysOrMonths;
  //   const timeoutData = session_timeout;
  //   const fallbackData = human_transfer_rate;
  //   const averageHandleTime = avg_handle_time
  //   var chartDom = document.getElementById('sessionTime');
  //   this.sessionTime = echarts.init(chartDom);
  //   const option = {
  //     tooltip: {
  //       trigger: 'axis'
  //     },
  //     legend: {
  //       data: ['Average Handle Time', 'Session Timeout', 'Human Transfer rate'],
  //       icon: 'square',
  //     },
  //     grid: {
  //       left: '13%',
  //       right: '4%',
  //       bottom: '10%',
  //       containLabel: true
  //     },
  //     xAxis: {
  //       type: 'category',
  //       boundaryGap: false,
  //       data: formattedDates,
  //       name: 'Date(s)', // Label at the bottom (x-axis)
  //       nameLocation: 'middle',
  //       nameTextStyle: {
  //         fontSize: 14,
  //         fontWeight: 'bold', // Make the text bold
  //         color: '#000000',
  //         padding: 15
  //       }
  //     },
  //     yAxis: {
  //       type: 'value',
  //       name: 'Bot  Session(s)', // Label on the left side (y-axis)
  //       nameLocation: 'middle',
  //       nameTextStyle: {
  //         fontSize: 14,
  //         fontWeight: 'bold', // Make the text bold
  //         color: '#000000',
  //         padding: 30
  //       }
  //     },
  //     series: [
  //       {
  //         name: 'Average Handle Time',
  //         type: 'line',
  //         stack: 'Total',
  //         data: averageHandleTime,
  //         // lineStyle: {
  //         //   color: '#FAC858',
  //         // }
  //       },
  //       {
  //         name: 'Session Timeout',
  //         type: 'line',
  //         stack: 'Total',
  //         data: timeoutData,
  //         // lineStyle: {
  //         //   color: '#91CC75',
  //         // }
  //       },
  //       {
  //         name: 'Human Transfer rate',
  //         type: 'line',
  //         stack: 'Total',
  //         data: fallbackData,
  //         // lineStyle: {
  //         //   color: '#6a4fe3',
  //         // }
  //       }
  //     ]
  //   };

  //   option && this.sessionTime.setOption(option);

  // }
  botSessionTime(avg_handle_time: any, human_transfer_rate: any, session_timeout: any, daysOrMonths: any) {
    console.log("daysOrMonths = ", daysOrMonths);
    console.log("session_timeout = ", session_timeout);
    console.log("human_transfer_rate = ", human_transfer_rate);

    const formattedDates = this.formatDates(daysOrMonths);
    const timeoutData = session_timeout;
    const fallbackData = human_transfer_rate;

    var chartDom = document.getElementById('sessionTime');
    this.sessionTime = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Timeout Rate', 'Handover Rate'],
        icon: 'square',
      },
      grid: {
        left: '13%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: formattedDates,
        name: 'Date(s)', // Label at the bottom (x-axis)
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000000',
          padding: 15
        }
      },
      yAxis: {
        type: 'value',
        name: 'Bot Session(s)', // Label on the left side (y-axis)
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000000',
          padding: 30
        }
      },
      series: [
        {
          name: 'Timeout Rate',
          type: 'line',
          stack: 'Total',
          data: timeoutData,
        },
        {
          name: 'Handover Rate',
          type: 'line',
          stack: 'Total',
          data: fallbackData,
        }
      ]
    };

    option && this.sessionTime.setOption(option);
  }

  botAverageHandleTime(avg_handle_time: any, daysOrMonths: any) {
    console.log("daysOrMonths = ", daysOrMonths);
    console.log("avg_handle_time = ", avg_handle_time);

    const formattedDates = this.formatDates(daysOrMonths);
    const averageHandleTime = avg_handle_time;

    var chartDom = document.getElementById('avgHandleTime');
    this.avgHandleTimeChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const date = params[0].name;
          const handleTime = params[0].value;
          return `${date}<br/>Average Handle Time: ${handleTime} min`;
        }
      },
      legend: {
        data: ['Average Handle Time'],
        icon: 'square',
      },
      grid: {
        left: '13%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: formattedDates,
        name: 'Date(s)', // Label at the bottom (x-axis)
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000000',
          padding: 15
        }
      },
      yAxis: {
        type: 'value',
        name: 'AHT (min)', // Label on the left side (y-axis)
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000000',
          padding: 30
        }
      },
      series: [
        {
          name: 'Average Handle Time',
          type: 'line',
          stack: 'Total',
          data: averageHandleTime,
        }
      ]
    };

    option && this.avgHandleTimeChart.setOption(option);
  }

  SessionContainmentRate() {
    this._analytics.GetSessionContainmentRate().subscribe((res: any) => {
      this.sessionContainmentRate = res.detail;
    })
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
          color: '#25D366'
        }
      },
      {
        value: sentiments?.negative,
        name: 'Negative',
        itemStyle: {
          color: '#fa7373'
        }
      },
      {
        value: sentiments?.neutral,
        name: 'Neutral',
        itemStyle: {
          color: '#f7c465'
        }
      }
    ];

    var option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {//
          name: 'Sentiments',
          type: 'pie',
          radius: ['50%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
            // formatter: function () {
            //   const formatValue = (value: number): string => {
            //     if (value >= 1000000) {
            //       return (value / 1000000).toFixed(1) + 'M';
            //     }
            //     if (value >= 1000) {
            //       return (value / 1000).toFixed(1) + 'K';
            //     }
            //     return value.toString();
            //   };
            //   return `\n${formatValue(totalSentiments)}\n{interaction|Interactions}`;
            // },
            // rich: {
            //   interaction: {
            //     fontSize: 12,
            //     padding: [10, 0, 0, 0]
            //   }
            // },
            // fontSize: 20,
            // fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 15,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: data
        }
      ]
    };

    myChart.setOption(option);

  }

  getCsatChart(data: any): void {

    const total = Object.values(data).length;
    const satisfiedCount = Object.values(data).filter((value: any) => value > 0).length;
    const satisfactionPercentage = (satisfiedCount / total) * 100;

    const chartDom = document.getElementById('donut-chart');
    this.csatChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        show: false
      },
      series: [
        {
          name: 'Satisfaction',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: false
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2
          },
          data: [
            { value: this.csatPercentage, name: 'Satisfaction', itemStyle: { color: '#25D366' } }, // Green
            { value: 100 - this.csatPercentage, name: 'Remaining', itemStyle: { color: '#DCDCDC' } } // Gray
          ]
        }
      ],
      graphic: [
        {
          type: 'text',
          top: 'center',
          left: 'center',
          style: {
            text: `${this.csatPercentage.toFixed(0)}%`,
            fontSize: 30,
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fill: '#25D366'
          }
        }
      ]
    };

    this.csatChart.setOption(option);

  }
  BotTagst() {
    var chartDom = document.getElementById('Botatgs');
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Tags From',
          type: 'pie',
          radius: ['50%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 15,
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
              value: this.tagsAnalatics?.Investor, name: 'Investor',
              itemStyle: {
                color: '#cf61ea'
              }
            },
            {
              value: this.tagsAnalatics?.Creditor, name: 'Creditor',
              itemStyle: {
                color: '#9c87ee'
              }
            },
            {
              value: this.tagsAnalatics?.SQL, name: 'SQL',
              itemStyle: {
                color: '#ff505c'
              }
            },
            {
              value: this.tagsAnalatics?.Customer_Support, name: 'Customer Support',
              itemStyle: {
                color: '#3cc2cc'
              }
            }
          ]
        }
      ]
    };

    option && myChart.setOption(option);

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
    const formattedDates = this.formatDates(daysOrMonths);
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
        left: '10%',
        right: '4%',
        bottom: '20%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: formattedDates,
          axisTick: {
            alignWithLabel: true
          },
          name: 'Date(s)', // Label at the bottom (x-axis)
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold', // Make the text bold
            color: '#000000',
            padding: 20
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Token(s)', // Label on the left side (y-axis)
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold', // Make the text bold
            color: '#000000',
            padding: 40
          }
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
  heatMap() {
    var chartDom = document.getElementById('heatMap');
    var myChart = echarts.init(chartDom);

    const hours = [
      '0', '1', '2', '3', '4', '5', '6',
      '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17',
      '18', '19', '20', '21', '22', '23'
    ];
    const days = this.formatDates(this.formattedDaysOrMonths);
    const firstDay = days[0]; // Get the first date
    const data = this.peakhoursData
      .map((item: any) => {
        return [item[1], item[0], item[2] || '-'];
      });

    var option = {
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
        },
        name: 'Hour(s)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000000',
          padding: 20
        }
      },
      yAxis: {
        type: 'category',
        data: days,
        splitArea: {
          show: true
        },
        name: 'Date(s)',
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#000000',
          padding: 50
        },
        axisLabel: {
          formatter: function (value: string) {
            // Highlight the first date
            if (value === firstDay) {
              return `{highlight|${value}}`;
            }
            return value;
          },
          rich: {
            highlight: {
              color: '#000000',
              fontWeight: 'bold', // Make the font bold
            }
          }
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

  formatDates(dates: string[]): string[] {
    // Array of month names for formatting
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    return dates.map(dateStr => {
      // Split the date string into month and day
      const [month, day] = dateStr.split('/').map(Number);

      // Create a Date object with the given month and day
      const date = new Date(2024, month - 1, day); // Using a dummy year (2024) for conversion

      // Format the date into "Day Month" format
      const formattedDate = `${day} ${monthNames[date.getMonth()]}`;

      return formattedDate;
    });
  }
  totalMessages() {
    this._analytics.GetTotalMessages().subscribe((res: any) => {
      this.messagesData = res.detail;
      const detail = res.detail;
      const daysOrMonths = Object.keys(detail).reverse();
      const inbound = daysOrMonths.map(day => detail[day].inbound)
      const outbound = daysOrMonths.map(day => detail[day].outbound)
      const total = daysOrMonths.map(day => detail[day].total)
      const formattedDaysOrMonths = daysOrMonths.map(date => {
        const [year, month, day] = date.split('-');
        return `${parseInt(month)}/${parseInt(day)}`;
      });
      this.totalMessagesChart(inbound, outbound, total, formattedDaysOrMonths);
    })
  }
  totalMessagesChart(inbound: any, outbound: any, total: any, formattedDaysOrMonths: any) {
    var chartDom = document.getElementById('totalMessages');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['Inbound', 'Outbound'],
        icon: 'square',
      },

      grid: {
        left: '10%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: this.formatDates(formattedDaysOrMonths),
          name: 'Date(s)', // Label at the bottom (x-axis)
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold', // Make the text bold
            color: '#000000',
            padding: 20
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Message(s)', // Label at the bottom (x-axis)
          nameLocation: 'middle',
          nameTextStyle: {
            fontSize: 14,
            fontWeight: 'bold', // Make the text bold
            color: '#000000',
            padding: 30
          }
        }
      ],
      series: [
        {
          name: 'Inbound',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          // showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(52,199,213,255)'
              },
              {
                offset: 1,
                color: 'rgb(52,199,213,255)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: inbound
        },
        {
          name: 'Outbound',
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: {
            width: 0
          },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: 'rgb(130,221,176,255)'
              },
              {
                offset: 1,
                color: 'rgb(130,221,176,255)'
              }
            ])
          },
          emphasis: {
            focus: 'series'
          },
          data: outbound
        }
      ]
    };
    option && myChart.setOption(option);
    window.addEventListener('resize', function () {
      myChart.resize();
    });
  }

  makeChartResponsive() {
    window.addEventListener('resize', () => {
      if (this.totalBot) {
        this.totalBot.resize();
      }
    });
  }
  makeCharte() {
    window.addEventListener('resize', () => {
      if (this.fallRate) {
        this.fallRate.resize();
      }
    });
  }
  makeChart() {
    window.addEventListener('resize', () => {
      if (this.sessionTime) {
        this.sessionTime.resize();
      }
    });
  }
  ngOnDestroy() {
    localStorage.setItem("filterDays", "1");
    localStorage.setItem("timeSpan", "day");
  }
}

