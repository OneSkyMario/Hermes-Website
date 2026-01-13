"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function UserInfo() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;
  if (!user) return null;

  const initials = `${user.full_name}${user.full_name ? '' : ''}`.toUpperCase().slice(0, 2);

  return (
    <div className="user-info">
      <div className="user-avatar">
        <span>{initials}</span>
      </div>

      <div
        className="user-details"
        onClick={() => router.push("/profile")}
      >
        <p className="user-name">
          {initials}
        </p>
        <p className="user-role">{user.role}</p>
      </div>
    </div>
  );
}
