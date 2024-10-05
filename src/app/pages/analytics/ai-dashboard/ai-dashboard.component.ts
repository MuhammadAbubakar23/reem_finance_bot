import { Component, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import * as echarts from 'echarts';
import { HeaderService } from '../../../core/services/header.service';
import { AnalyticsService } from '../../../core/services/analytics.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ai-dashboard',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './ai-dashboard.component.html',
  styleUrls: ['./ai-dashboard.component.scss']
})
export class AiDashboardComponent implements OnInit {
  sessionChart: any;
  totalSessionsData: any;
  filterDays: any = 1;
  timeSpan: any = "day";
  selectedTimeLabel: any = "Last 24 hours";
  sessionExpiryChartData: any;
  messagesData: any;
  inbound: any;
  outbound: any;
  messagesChartData: any;
  usersChartData: any;
  sessionSummary: any;
  totalSessions: any;
  totalUsersCount: any;
  averageSessionPerUser: any;
  sessionContainmentRate: any;
  userRetentionRate: any;
  isChecked: any = 0;
  sessionTime: any;
  sessiontimeout: any;
  sessionDuration: any;
  totalBotSessionsOvertimeData: any;
  engagedSessionRate: any;
  constructor(private _hS: HeaderService, private _analytics: AnalyticsService, private spinnerServerice: NgxSpinnerService) {
    _hS.updateHeaderData({
      title: 'Sessions',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-chart-line-up"
    })
  }
  ngOnInit(): void {
    this.refreshCharts();
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
  get getTimeSpan() {
    return localStorage.getItem("timeSpan")
  }
  refreshCharts() {
    this.TotalSessions();
    this.TotalUsersCount();
    this.EngagedSessionRate();
    this.UserRetentionRate();
    this.SessionContainmentRate();
    this.SessionDuration();
    this.SessionSummary();
    this.AverageSessionPerUser();
    this.totalBotSessionOvertime();
    this.totalMessages();
    this.messagesDataApi();
    this.sessionExpiry();
    this.usersDataApi();
    this.TimeoutCount();
    this.TotalSessionsData();
    this.conversationOverTime();
  }

  TotalSessionsData() {
    this._analytics.GetTotalBotConversation().subscribe((res: any) => {
      this.totalSessionsData = res;
    })
  }
  sessionExpiry() {
    this._analytics.GetSessionExpiryReason().subscribe((res: any) => {
      this.sessionExpiryChartData = res;
      this.sessionExpiryChart();
    })
  }
  UserRetentionRate() {
    this._analytics.GetUserRetentionRate().subscribe((res: any) => {
      this.userRetentionRate = res.detail;
    })
  }
  SessionContainmentRate() {
    this._analytics.GetSessionContainmentRate().subscribe((res: any) => {
      this.sessionContainmentRate = res.detail;
    })
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
  TotalSessions() {
    this._analytics.getTotalSessions().subscribe((res: any) => {
      this.totalSessions = res.detail;
    })
  }
  EngagedSessionRate() {
    this._analytics.GetEngagedSessionRate().subscribe((res: any) => {
      this.engagedSessionRate = res.detail;
    })
  }
  AverageSessionPerUser() {
    this._analytics.GetAverageSessionPerUser().subscribe((res: any) => {
      this.averageSessionPerUser = res.detail;
    })
  }
  SessionSummary() {
    this._analytics.GetSesionSummary().subscribe((res: any) => {
      this.sessionSummary = res.detail;
    })
  }
  conversationOverTime() {
    this._analytics.GetTotalSessions().subscribe(
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

      },
      (error: any) => {
        console.error(error.error);
      }
    );
  }

  totalBotConversation(count: any, date: any) {
    const dates = this.formatDates(date);
    const counts = count;
    var chartDom = document.getElementById('totalSession');
    var myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        trigger: 'axis',
        formatter: function (params: any) {
          const date = params[0].name;
          const conversationCount = params[0].value;
          return `${date}<br/>Sessions: ${conversationCount}`;
        }
      },
      legend: {
        data: ['All Chatbots'],
        icon: 'square',
      },
      grid: {
        left: '10%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        name: 'Date(s)', // Label at the bottom (x-axis)
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold', // Make the text bold
          color: '#000000',
          padding: 25
        }
        // axisLabel: {
        //   rotate: 45,
        //   interval: 0
        // }
      },
      yAxis: {
        type: 'value',
        name: 'Session(s)', // Label at the bottom (x-axis)
        nameLocation: 'middle',
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold', // Make the text bold
          color: '#000000',
          padding: 25
        }
      },
      series: [
        {
          data: counts,
          name: 'All Chatbots',
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
    option && myChart.setOption(option);
    myChart.setOption(option);
    window.addEventListener('resize', function () {
      myChart.resize();
    });
  }

  TimeoutCount() {
    // this.spinner.show()
    this._analytics.TimeoutCount().subscribe(
      (res: any) => {
        this.sessiontimeout = res;
        // this.spinner.hide()
      },
      (error: any) => {
        console.error("An error occurred while fetching the timeout count:", error);
        // this.spinner.hide()
      }
    );
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
  sessionExpiryChart() {
    var chartDom = document.getElementById('sessionExpiry');
    var data = [
      { value: this.sessionExpiryChartData.expired_sessions, name: 'Expired' },
      // { value: this.sessionExpiryChartData.agent_takeover, name: 'Agent Takeover' },
      { value: this.sessionExpiryChartData.go_to_agent_action, name: 'Agent Handover' },
      { value: this.sessionExpiryChartData.close_session_action, name: 'Agent closed' },
      { value: this.sessionExpiryChartData.user_closed_session, name: 'User Closed' }
    ];
    var myChart = echarts.init(chartDom);
    const response = this.sessionExpiryChartData;
    const totalSentiments = response?.expired_sessions + response?.agent_takeover + response?.go_to_agent_action + response?.close_session_action + response.user_closed_session;

    var option = {
      // color: ['#568bd1', '#c305f2', '#9966FF','#ff505c', '#4BC0C0', ],
      color: ['#568bd1', '#9966FF', '#ff505c', '#4BC0C0',],
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: 'Sessions',
          type: 'pie',
          radius: ['55%', '80%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: 'center',
            formatter: function () {
              const formatValue = (value: number): string => {
                if (value >= 1000000) {
                  return (value / 1000000).toFixed(1) + 'M';
                }
                if (value >= 1000) {
                  return (value / 1000).toFixed(1) + 'K';
                }
                return value.toString();
              };
              return `\n${formatValue(totalSentiments)}\n{interaction|Sessions}`;
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

    myChart.setOption(option);
  }

  messagesDataApi() {
    this._analytics.GetMessages().subscribe((res: any) => {
      this.messagesChartData = res.detail;
      this.messagesChart();
    })
  }

  messagesChart() {
    var chartDom = document.getElementById('main2');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      title: {
        text: `${this.messagesChartData.total}\n Messages`,
        left: 'center',
        top: '50%',
        textAlign: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          lineHeight: 24,
          fontFamily: 'Rubik'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          label: {
            show: false
          },
          name: 'Access From',
          type: 'pie',
          radius: ['90%', '100%'],
          center: ['43.5%', '70%'],
          startAngle: 180,
          endAngle: 360,
          data: [
            {
              value: this.messagesChartData.inbound,
              name: 'Inbound',
              itemStyle: {
                color: 'rgba(163, 161, 251, 1)'
              }
            },
            {
              value: this.messagesChartData.outbound,
              name: 'Outbound',
              itemStyle: {
                color: 'rgba(255, 124, 195, 1)'
              }
            }
          ]
        }
      ]
    };

    option && myChart.setOption(option);
    window.addEventListener('resize', function () {
      myChart.resize();
    });
  }
  TotalUsersCount() {
    this._analytics.GetTotalUsersCount().subscribe((res: any) => {
      this.totalUsersCount = res.detail;
    })
  }
  SessionDuration() {
    this._analytics.GetSessionDuration().subscribe((res: any) => {
      this.sessionDuration = res;
    })
  }
  usersDataApi() {
    this._analytics.GetUsers(this.isChecked).subscribe((res: any) => {
      this.usersChartData = res.detail;
      this.usersChart();
    })
  }
  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.isChecked = checkbox.checked == true ? 1 : 0;
    this.usersDataApi();
  }
  usersChart() {
    var chartDom = document.getElementById('users');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      title: {
        text: `${this.usersChartData?.total || 0}\nUsers`,
        left: 'center',
        top: '50%',
        textAlign: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'Bold',
          lineHeight: 24,
          fontFamily: 'Rubik'
        }
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          label: {
            show: false
          },
          name: 'Access From',
          type: 'pie',
          radius: ['90%', '100%'],
          center: ['46%', '70%'],
          startAngle: 180,
          endAngle: 360,
          data: [
            {
              value: this.usersChartData?.new_users || 0,
              name: 'New Users',
              itemStyle: {
                color: '#25D366' // Adjust alpha value to 1 for full opacity
              }
            },
            {
              value: this.usersChartData?.returning_users || 0,
              name: 'Returning Users',
              itemStyle: {
                color: 'rgba(84,176,242,255)'
              }
            }
          ]
        }
      ]
    };

    option && myChart.setOption(option);
    window.addEventListener('resize', function () {
      myChart.resize();
    });
  }
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
        this.botSessionTime(avg_handle_time, human_transfer_rate, session_timeout, formattedDaysOrMonths);
        // this.botAverageHandleTime(avg_handle_time,formattedDaysOrMonths);
      });
    });
  }
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
        trigger: 'axis',
        formatter: function (params: any) {
          console.log('Tooltip Params:', params);
          const seriesData = params.reduce((acc: any, param: any) => {
            acc[param.seriesName] = param.value;
            return acc;
          }, {});

          const date = params[0].name;

          let tooltipContent = `${date}<br/>`;
          if ('Timeout Rate' in seriesData) {
            tooltipContent += `Timeout Rate: ${seriesData['Timeout Rate']} %<br/>`;
          }
          if ('Handover Rate' in seriesData) {
            tooltipContent += `Handover Rate: ${seriesData['Handover Rate']} %<br/>`;
          }

          return tooltipContent;
        }
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
        name: 'Date(s)',
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
        name: 'Bot Session(s)',
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
          data: timeoutData,
        },
        {
          name: 'Handover Rate',
          type: 'line',
          color: '#25D366',
          data: fallbackData,
        }
      ]
    };

    option && this.sessionTime.setOption(option);
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
  ngOnDestroy() {
    localStorage.setItem("filterDays", "1");
    localStorage.setItem("timeSpan", "day");
  }
}
