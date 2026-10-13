export type User = {
  registration: string;
  username: string;
  password: string;
  contacts: Contact[];
};

export type Contact = {
  id: number;
  name: string;
  email: string;
  comment: string;
};
