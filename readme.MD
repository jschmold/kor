# Initial Setup

`npm i mocha ts-node typedoc typescript --global`


# Configuration
File: config.yaml

| key   | description | values | required? |
| ----: | ----------- | ------ | --------- |
| mode | Select the mode that the application is to run in. Also affects the database suffix names. (`dbsource.development.yaml`), default is development | "production", "development" | no |
| port | The port that the server will run on. Default 8080 | Any valid port number | no |
| dataConfigs | The directory of the database configuration yamls | a directory string | no |
| dataSources | The data sources to be loaded into the data connections module. These should align with filenames in the data sources directory | string[] | yes |
| verbosity | The level of logging to permit. Default is warn. | debug, log, info, warn, error, none | no |
| secret | The API secret key to use for the cookie-parser and csrf protection. | any string | yes | 

# Modules

Modules are a whole helluva lot like Angular. I built the config this way to enable some sense of familiarity for Angular Developers, and to make it a little easier to manage the whole process of modularizing server applications.

```
import { ApplicationModule } from '@jschmold/kor';
// import your models here
// import your controllers here

@ApplicationModule(
  models: [
    // models here
  ],
  controllers: [
    // controllers here
  ]
)
export class MyApplicationModule {
  
}
