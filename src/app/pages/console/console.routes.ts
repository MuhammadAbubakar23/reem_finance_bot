import { Routes } from "@angular/router";
import { ConfigurationsComponent } from "./configurations/configurations.component";
import { ConnectChannelsComponent } from "./connect-channels/connect-channels.component";
import { ConversationalBotConfigurationComponent } from "./conversational-bot/conversational-bot-configuration/conversational-bot-configuration.component";
import { ConversationalBotUploadFilesComponent } from "./conversational-bot/conversational-bot-upload-files/conversational-bot-upload-files.component";
import { ConversationalBotComponent } from "./conversational-bot/conversational-bot.component";
import { EventLogsComponent } from "./event-logs/event-logs.component";
import { IntentBotComponent } from "./intent-bot/intent-bot.component";
import { KnowledgeBaseComponent } from "./knowledge-base/knowledge-base.component";
import { MenuBotComponent } from "./menu-bot/menu-bot.component";
import { RulesComponent } from "./rules/rules.component";
import { SettingsComponent } from "./settings/settings.component";
import { TagsComponent } from "./tags/tags.component";
import { TemplatesComponent } from "./templates/templates.component";
import { CreateUserComponent } from "./user-management/create-user/create-user.component";
import { UserManagementComponent } from "./user-management/user-management.component";

export const routes: Routes = [
  { path: '', redirectTo: 'bot-management/conversational-bot', pathMatch: 'full' },
  {path:'bot-management',redirectTo:'conversational-bot'},
  { path: 'event-logs', component: EventLogsComponent },
  { path: 'intent-bot', component: IntentBotComponent },
  { path: 'bot-management/menu-bot', component: MenuBotComponent},
  { path: 'bot-management/conversational-bot', component: ConversationalBotComponent },
  { path: 'bot-management/conversational-bot/configuration', component: ConversationalBotConfigurationComponent },
  { path: 'bot-management/conversational-bot/upload', component: ConversationalBotUploadFilesComponent },
  { path: 'bot-management/configurations', component: ConfigurationsComponent},
  { path: 'bot-management/templates', component: TemplatesComponent},

  { path: 'rules-bot', component: RulesComponent },
  { path: 'connect-channels', component: ConnectChannelsComponent},
  { path: 'settings', component: SettingsComponent },

  { path: 'users', component: UserManagementComponent },
  {
    path: 'users/create',component: CreateUserComponent },
  {
    path: 'users/create/:id',component: CreateUserComponent },
  { path: 'tags', component: TagsComponent},
  { path: 'knowledge-base', component: KnowledgeBaseComponent },
];
