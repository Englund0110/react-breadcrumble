export type UserModel = {
  id: string;
  name: string;
  description: string;
};

export const users: UserModel[] = [
  {
    id: "1",
    name: "Mark Zuckerberg",
    description: "Founder of Facebook.",
  },
  {
    id: "2",
    name: "Jeff Bezos",
    description: "Founder of Amazon.",
  },
  {
    id: "3",
    name: "Søren Englund",
    description: "Creator of react-breadcrumble.",
  },
];
