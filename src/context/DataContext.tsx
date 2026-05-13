import { useState } from "react";
import type { ReactNode } from "react";
import { DataContext } from "./DataContextProvider";

export type User = {
  id?: string;
  name: string;
  course: string;
  phone: string;
  status: "Paid" | "Pending";
};

export type Collection = {
  id?: string;
  userName: string;
  amount: number;
  date: string;
  paymentMethod: "Cash" | "Cheque" | "Online";
  status: "Paid" | "Pending";
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([
    { name: "Siya Sharma", course: "BCA", phone: "9876543210", status: "Paid" },
    { name: "Radha Singh", course: "BBA", phone: "9123456780", status: "Pending" },
    { name: "Pinku Verma", course: "MCA", phone: "9988776655", status: "Paid" },
    { name: "Mayank Patel", course: "BTech", phone: "9871234567", status: "Pending" },
    { name: "Anku Sharma", course: "MBA", phone: "9090909090", status: "Paid" },
  ]);

  const [collections, setCollections] = useState<Collection[]>([
    {
      userName: "Siya Sharma",
      amount: 5000,
      date: "2024-05-20",
      paymentMethod: "Online",
      status: "Paid",
    },
    {
      userName: "Radha Singh",
      amount: 5000,
      date: "2024-05-19",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      userName: "Pinku Verma",
      amount: 5000,
      date: "2024-05-18",
      paymentMethod: "Cheque",
      status: "Paid",
    },
    {
      userName: "Mayank Patel",
      amount: 3000,
      date: "2024-05-17",
      paymentMethod: "Online",
      status: "Pending",
    },
    {
      userName: "Anku Sharma",
      amount: 5000,
      date: "2024-05-16",
      paymentMethod: "Cash",
      status: "Paid",
    },
  ]);

  const addUser = (user: User) => {
    setUsers((prev) => [user, ...prev]);
  };

  const addCollection = (collection: Collection) => {
    setCollections((prev) => [collection, ...prev]);
  };

  return (
    <DataContext.Provider value={{ users, collections, addUser, addCollection }}>
      {children}
    </DataContext.Provider>
  );
}
