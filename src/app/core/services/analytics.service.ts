import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { bot_id } from '../../../main';


@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor(private http: HttpClient) { }
  chatBotBaseUrl = environment.chatBotBaseUrl
  getTotalBotConversation = environment.link.analytics.getTotalBotConversation
  sessionExpiryReason = environment.link.analytics.sessionExpiryReason
  botcsat = environment.link.analytics.botCsat
  messages = environment.link.analytics.messages
  totalMessages = environment.link.analytics.totalMessages
  totalUsers = environment.link.analytics.totalUsers
  totalUsersCount = environment.link.analytics.totalUsersCount
  sessionContainmentRate = environment.link.analytics.sessionContainmentRate
  userRetentionRate = environment.link.analytics.userRetentionRate
  sessionDuration = environment.link.analytics.sessionDuration
  getTotalAgents = environment.link.analytics.getTotalAgents
  avgBotConversationTime = environment.link.analytics.avgBotConversationTime
  botEsclationRate = environment.link.analytics.botEsclationRate
  avgWaitTime = environment.link.analytics.avgWaitTime
  sentimentAnalysis = environment.link.analytics.sentimentAnalysis
  humanAgentCsat = environment.link.analytics.humanAgentCsat
  tagsAnalatics = environment.link.analytics.tagsAnalatics
  peakHours = environment.link.analytics.peakHours
  totalToken = environment.link.analytics.totalToken
  conversationOverTime = environment.link.analytics.conversationOverTime
  totalSessionsData = environment.link.analytics.totalSessionsData
  totalSessions = environment.link.analytics.totalSessions
  engagedSessionRate = environment.link.analytics.engagedSessionRate
  sessionsSummary = environment.link.analytics.sessionsSummary
  averageSessionPerUser = environment.link.analytics.averageSessionPerUser
  tokenPerDay = environment.link.analytics.tokenPerDay
  baseUrlAI = environment.baseUrlAI
  avgToken = environment.link.analytics.avgToken
  fallBackCount = environment.link.analytics.fallBackCount
  timeoutCount = environment.link.analytics.timeoutCount
  humanTransferRate = environment.link.analytics.humanTransferRate
  averageTokenPerChat = environment.link.analytics.averageTokenPerChat
  totalBotSessionsOvertime = environment.link.analytics.totalBotSessionsOvertime



  GetTotalBotConversation() {
    return this.http.get(this.chatBotBaseUrl + this.getTotalBotConversation + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  getBotcsat () {
    return this.http.get(this.chatBotBaseUrl + this.botcsat +`?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetSessionExpiryReason() {
    return this.http.get(this.chatBotBaseUrl + this.sessionExpiryReason + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetMessages() {
    return this.http.get(this.chatBotBaseUrl + this.messages + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetTotalMessages() {
    return this.http.get(this.chatBotBaseUrl + this.totalMessages + `?bot_id=${bot_id}&filter_days=7`)
  }
  GetUsers(isChecked: any) {
    return this.http.get(this.chatBotBaseUrl + this.totalUsers + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}&engaged_sessions=${isChecked}`)
  }
  GetTotalUsersCount() {
    return this.http.get(this.chatBotBaseUrl + this.totalUsersCount + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetSessionContainmentRate() {
    return this.http.get(this.chatBotBaseUrl + this.sessionContainmentRate + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetUserRetentionRate() {
    return this.http.get(this.chatBotBaseUrl + this.userRetentionRate + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetSessionDuration() {
    return this.http.get(this.chatBotBaseUrl + this.sessionDuration + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetTotalAgents() {
    return this.http.get(this.chatBotBaseUrl + this.getTotalAgents + `?bot_id=${bot_id}`)
  }
  GetAvgBotConversationTime() {
    return this.http.get(this.chatBotBaseUrl + this.avgBotConversationTime + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetBotEsclationRate() {
    return this.http.get(this.chatBotBaseUrl + this.botEsclationRate + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetAvgWaitTime() {
    return this.http.get(this.chatBotBaseUrl + this.avgWaitTime + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetSentimentAnalysis() {
    return this.http.get(this.chatBotBaseUrl + this.sentimentAnalysis + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetHumanAgentCsat() {
    return this.http.get(this.chatBotBaseUrl + this.humanAgentCsat + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetTagsAnalatics() {
    return this.http.get(this.chatBotBaseUrl + this.tagsAnalatics + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetPeakHours() {
    return this.http.get(this.chatBotBaseUrl + this.peakHours + `?bot_id=${bot_id}&filter_days=7`)
  }
  TotalToken() {
    return this.http.get(this.chatBotBaseUrl + this.totalToken + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  AvgToken() {
    return this.http.get(this.chatBotBaseUrl + this.avgToken + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  TimeoutCount() {
    return this.http.get(this.chatBotBaseUrl + this.timeoutCount + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  TokenPerDay() {
    return this.http.get(this.chatBotBaseUrl + this.tokenPerDay + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }


  FallBackCount() {
    return this.http.get(this.chatBotBaseUrl + this.fallBackCount)
  }

  ConversationOverTimeData(botId: any) {
    // return this.http.get(this.chatBotBaseUrl + this.conversationOverTime + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
    return this.http.get(this.chatBotBaseUrl + this.conversationOverTime + `?bot_id=${bot_id}&filter_days=7`)
    // return this.http.get('http://52.77.162.250:5005/analytics/conversations_over_time?bot_id=7&filter_days=7')
  }

  GetTotalSessions() {
    return this.http.get(this.chatBotBaseUrl + this.totalSessionsData + `?bot_id=${bot_id}&filter_days=7`)
  }
  GetSesionSummary() {
    return this.http.get(this.chatBotBaseUrl + this.sessionsSummary + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetAverageSessionPerUser() {
    return this.http.get(this.chatBotBaseUrl + this.averageSessionPerUser + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  getTotalSessions() {
    return this.http.get(this.chatBotBaseUrl + this.totalSessions + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GetEngagedSessionRate() {
    return this.http.get(this.chatBotBaseUrl + this.engagedSessionRate + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
  }
  GethumanTransferRate() {
    // return this.http.get(this.chatBotBaseUrl + this.humanTransferRate + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
    return this.http.get(this.chatBotBaseUrl + this.humanTransferRate + `?bot_id=${bot_id}&filter_days=7`)
  }

  GetAverageTokenPerChat() {
    // return this.http.get(this.chatBotBaseUrl + this.averageTokenPerChat + `?bot_id=${bot_id}&filter_days=${localStorage.getItem("filterDays")}`)
    return this.http.get(this.chatBotBaseUrl + this.averageTokenPerChat + `?bot_id=${bot_id}&filter_days=7`)
  }

  GetTotalBotSessionsOvertime() {
    return this.http.get(this.chatBotBaseUrl + this.totalBotSessionsOvertime + `?bot_id=${bot_id}&filter_days=7`)
  }
}
