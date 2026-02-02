export type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
};

export type MainTabParamList = {
    Feed: undefined;
    Reels: undefined;
    Map: { focusEvent?: any } | undefined;
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
