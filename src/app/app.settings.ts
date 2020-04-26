export class AppSettings {
  public static BASE_URL = 'http://localhost:8686';
  public static BASE_AUTHORIZATION_URL = 'http://localhost:9999';

  public static CLIENT_ID = 'SVoffice';
  public static CLIENT_SECRET = 'XY7kmzoNzl100';
  public static PAGE_SIZE = 10;
  public static PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50, 100];
  public static DEFAULT_LANGUAGE = 'vi';
  public static DEFAULT_THEME = 'zeus';

  public static USERNAME = '';
  public static AUTHORITIES = [];
  public static DEFAULT_LANGUAGE_ID = '1';
  public static BUTTON_BACK = 1;
  public static BUTTON_NEXT = 2;
  public static BUTTON_SAVE = 3;
  public static LANGS = [
    {id: 1, code: 'vi', name: 'Việt Nam', logo: 'assets/Flags/vi.ico'},
    {id: 2, code: 'en', name: 'English', logo: 'assets/Flags/en.ico'}
  ];
  public static CURR_LANG = AppSettings.LANGS[0].code;
  public static UPLOAD_FILE_CONTROL = '_upload_files';
  public static API_DATE_FORMAT = 'yyyy-MM-dd HH:mm:ss.SSS\'Z\'';
  public static DIS_DATE_FORMAT = 'dd/MM/yyyy';
  public static DOWNLOAD_DATE_FORMAT = 'yyyyMMddHHmmss';

  public static APP_DATE_FORMATS =
    {
      parse: {
        dateInput: {month: 'short', year: 'numeric', day: 'numeric'},
      },
      display: {
        dateInput: 'input',
        monthYearLabel: {year: 'numeric', month: 'numeric'},
        dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
        monthYearA11yLabel: {year: 'numeric', month: 'long'},
      }
    };

}
