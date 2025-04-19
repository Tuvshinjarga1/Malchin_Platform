"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { FaSearch, FaFilter, FaUserCog, FaTrash } from "react-icons/fa";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "herder" | "admin";
  createdAt: number;
}

export default function AdminUsersPage() {
  const { currentUser, userRole, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Хэрэглэгчийн мэдээлэл ачаалагдахыг хүлээх
  useEffect(() => {
    if (!loading) {
      // Хэрэглэгч нэвтрээгүй эсвэл админ биш бол нэвтрэх хуудас руу шилжүүлэх
      if (!currentUser || userRole !== "admin") {
        router.push("/login");
      }
    }
  }, [currentUser, loading, router, userRole]);

  // Бүх хэрэглэгчдийг авах
  useEffect(() => {
    const fetchUsers = async () => {
      if (currentUser && userRole === "admin") {
        setDataLoading(true);
        try {
          const usersQuery = query(
            collection(db, "users"),
            orderBy("createdAt", "desc")
          );
          const querySnapshot = await getDocs(usersQuery);
          const usersData: User[] = [];

          querySnapshot.forEach((doc) => {
            const userData = doc.data() as User;
            usersData.push({
              ...userData,
              id: doc.id,
            });
          });

          setUsers(usersData);
        } catch (error) {
          console.error("Error fetching users:", error);
        } finally {
          setDataLoading(false);
        }
      }
    };

    fetchUsers();
  }, [currentUser, userRole]);

  // Хэрэглэгчийн эрхийн тохиргоо өөрчлөх
  const handleRoleChange = async (
    userId: string,
    newRole: "user" | "herder" | "admin"
  ) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });

      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  // Хэрэглэгчийг устгах
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Та энэ хэрэглэгчийг устгахдаа итгэлтэй байна уу?")) {
      try {
        await deleteDoc(doc(db, "users", userId));
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Хайлт ба шүүлтүүрийн хэрэгжүүлэлт
  const filteredUsers = users.filter((user) => {
    // Хайлтын термээр шүүх
    const searchMatch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    // Эрхээр шүүх
    const roleMatch = roleFilter === "all" || user.role === roleFilter;

    return searchMatch && roleMatch;
  });

  if (loading || !currentUser || userRole !== "admin") {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Хэрэглэгчийн удирдлага</h1>
        <Link
          href="/admin/dashboard"
          className="text-purple-600 hover:underline"
        >
          &larr; Хянах самбар руу буцах
        </Link>
      </div>

      {/* Хайлт ба шүүлтүүр */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Хэрэглэгч хайх..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex items-center">
            <FaFilter className="text-gray-500 mr-2" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Бүх эрхүүд</option>
              <option value="user">Энгийн хэрэглэгч</option>
              <option value="herder">Малчин</option>
              <option value="admin">Админ</option>
            </select>
          </div>
        </div>
      </div>

      {dataLoading ? (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Хэрэглэгчийн нэр
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Имэйл
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Утас
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Эрх
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Бүртгүүлсэн огноо
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Үйлдэл
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as "user" | "herder" | "admin"
                        )
                      }
                      className="text-sm border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="user">Энгийн хэрэглэгч</option>
                      <option value="herder">Малчин</option>
                      <option value="admin">Админ</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString("mn-MN")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Устгах"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg mb-4">
            {searchTerm || roleFilter !== "all"
              ? "Шүүлтүүрт тохирох хэрэглэгч олдсонгүй"
              : "Хэрэглэгч олдсонгүй"}
          </p>
          {(searchTerm || roleFilter !== "all") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
              }}
              className="text-purple-600 hover:underline"
            >
              Шүүлтүүрийг арилгах
            </button>
          )}
        </div>
      )}
    </div>
  );
}
