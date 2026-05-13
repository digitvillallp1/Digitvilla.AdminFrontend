import { createContext } from "react";
import type { User, Collection } from "./DataContext";

export interface DataContextType {
  users: User[];
  collections: Collection[];
  addUser: (user: User) => void;
  addCollection: (collection: Collection) => void;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);
