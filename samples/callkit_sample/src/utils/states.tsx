export const reducer = (state: any, action: any) => ({...state, ...action});

export const initialState = {
  ready: false,
  number: '',
  ringing: false,
  inCall: false,
  held: false,
  videoHeld: false,
  error: null,
};
