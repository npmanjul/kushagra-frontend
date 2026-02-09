"use client";

import API_BASE_URL from "@/utils/constants";
import React, { useEffect, useState } from "react";

const ContactPage = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/contact/get-all-contacts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || data);
      } else {
        setError("Failed to fetch contacts");
        console.error("Error fetching contacts:", response.status);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (index) => {
    const colors = [
      "bg-gradient-to-br from-violet-500 to-purple-600",
      "bg-gradient-to-br from-blue-500 to-indigo-600",
      "bg-gradient-to-br from-emerald-500 to-teal-600",
      "bg-gradient-to-br from-orange-500 to-red-500",
      "bg-gradient-to-br from-pink-500 to-rose-600",
      "bg-gradient-to-br from-cyan-500 to-blue-600",
    ];
    return colors[index % colors.length];
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin"></div>
          </div>
          <p className="text-slate-600">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Error</h3>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={fetchContact}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Contact Messages</h1>
          <p className="text-slate-500 mt-1">
            {contacts.length} total message{contacts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Contact List */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              No contacts found
            </h3>
            <p className="text-slate-500">
              {searchTerm
                ? "Try adjusting your search"
                : "No messages have been received yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact, index) => (
              <div
                key={contact._id || index}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full ${getAvatarColor(
                      index
                    )} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                  >
                    {getInitials(contact.name)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Name */}
                    <h3 className="text-lg font-semibold text-slate-800 mb-3">
                      {contact.name}
                    </h3>

                    {/* Contact Info */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {/* Email */}
                      <a
                        href={`mailto:${contact.email}`}
                        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {contact.email}
                      </a>

                      {/* Phone */}
                      <a
                        href={`tel:${contact.phone_number}`}
                        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        {contact.phone_number}
                      </a>
                    </div>

                    {/* Message */}
                    <div className="bg-slate-50 rounded-xl p-4">
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {contact.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results Count */}
        {filteredContacts.length > 0 && searchTerm && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Showing {filteredContacts.length} of {contacts.length} contacts
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactPage;