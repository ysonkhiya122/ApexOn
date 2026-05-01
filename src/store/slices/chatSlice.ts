import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatState {
  chatOpen: boolean;
  messages: ChatMessage[];
}

const initialState: ChatState = {
  chatOpen: false,
  messages: [
    {
      id: '1',
      sender: 'assistant',
      text: 'Welcome to the Apexon F1 Hub AI! Ask me anything about F1 rules, seasons, historical achievements, or driver insights.',
      timestamp: new Date().toISOString(),
    },
  ],
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.chatOpen = !state.chatOpen;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = initialState.messages;
    },
  },
});

export const { toggleChat, addMessage, clearMessages } = chatSlice.actions;
export default chatSlice.reducer;
