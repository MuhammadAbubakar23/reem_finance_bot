import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
let baseUrl = window.location.origin;
// sessionStorage.setItem('baseUrl', baseUrl);
export let bot_id:any;
export let workspace_id:any;
export let bot_name:any;
export let chat_path:any;
if(baseUrl === "https://entertainerbot1.enteract.app"){
  console.log("baseUrl", baseUrl)
  bot_id = environment.entertainer_bot.bot_id
  workspace_id = environment.entertainer_bot.workspace_id
  bot_name = environment.entertainer_bot.bot_name
  chat_path = environment.entertainer_bot.path
}
else if(baseUrl === "https://connect-ui.enteract.app:8444"){
  console.log("baseUrl", baseUrl)
  bot_id = environment.reem_finance.bot_id
  workspace_id = environment.reem_finance.workspace_id
  bot_name = environment.reem_finance.bot_name
  chat_path = environment.reem_finance.path
}
else{
  console.log("baseUrl", baseUrl)
  bot_id = environment.default.bot_id
  workspace_id = environment.default.workspace_id
  bot_name = environment.default.bot_name
  chat_path = environment.default.path
}
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

