import { create } from "zustand";
import type { Contact, User } from "%/utils/types.ts";

interface UserStore {
  user: User | undefined;
  setUser: (user: User | undefined) => void;
  addContact: (contact: Contact) => void;
  removeContact: (id: number) => void;
  updateContact: (contact: Contact) => void;
}

export default create<UserStore>((set) => ({
  user: undefined,
  setUser: (user: User | undefined) => set({ user }),
  addContact: (contact: Contact) => {
    set((state) => {
      if (!state.user) throw new Error("No current user found");

      return {
        user: {
          ...state.user,
          contacts: [contact, ...state.user.contacts]
        }
      };
    });
  },
  removeContact: (id: number) => {
    set((state) => {
      if (!state.user) throw new Error("No current user found");

      return {
        user: {
          ...state.user,
          contacts: state.user.contacts.filter((c) => c.id !== id)
        }
      };
    });
  },
  updateContact: (contact) => {
    set((state) => {
      if (!state.user) throw new Error("No current user found");

      return {
        user: {
          ...state.user,
          contacts: state.user.contacts.map((c) => (c.id === contact.id ? contact : c))
        }
      };
    });
  }
}));
