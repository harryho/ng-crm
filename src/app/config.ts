export interface AppSettings {

  sidenavOpened: boolean;
  sidenavCollapsed: boolean;

}

export const defaults: AppSettings = {
  sidenavOpened: false,
  sidenavCollapsed: false,
};

export const USE_LOCAL_MOCK_DATA = true