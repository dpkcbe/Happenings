export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

export type MainTabParamList = {
    Feed: undefined;
    Map: { focusEvent?: any } | undefined; // Using any temporarily or import Event if possible, but for speed any is fine for param
    Create: undefined;
    Messages: undefined;
    Profile: undefined;
};

export type RootStackParamList = {
    Auth: undefined;
    Main: undefined;
    EventDetails: { eventId: string };
    Chat: { chatId: string };
};
