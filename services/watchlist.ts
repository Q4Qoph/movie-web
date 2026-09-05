"use client";

import { WatchlistItem } from "@/interfaces/interfaces";

const WATCHLIST_STORAGE_KEY = "movieweb_user_watchlist";
const FAVORITES_STORAGE_KEY = "movieweb_user_favorites";

export const getWatchlist = (): WatchlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(WATCHLIST_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isInWatchlist = (id: number): boolean => {
  const list = getWatchlist();
  return list.some((item) => item.id === id);
};

export const toggleWatchlist = (item: Omit<WatchlistItem, "addedAt">): boolean => {
  const current = getWatchlist();
  const index = current.findIndex((i) => i.id === item.id);
  let updated: WatchlistItem[];
  let isAdded = false;

  if (index >= 0) {
    updated = current.filter((i) => i.id !== item.id);
    isAdded = false;
  } else {
    updated = [{ ...item, addedAt: Date.now() }, ...current];
    isAdded = true;
  }

  try {
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("watchlist-updated"));
  } catch (err) {
    console.error("Failed to save watchlist", err);
  }

  return isAdded;
};

export const getFavorites = (): WatchlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const isInFavorites = (id: number): boolean => {
  const list = getFavorites();
  return list.some((item) => item.id === id);
};

export const toggleFavorite = (item: Omit<WatchlistItem, "addedAt">): boolean => {
  const current = getFavorites();
  const index = current.findIndex((i) => i.id === item.id);
  let updated: WatchlistItem[];
  let isAdded = false;

  if (index >= 0) {
    updated = current.filter((i) => i.id !== item.id);
    isAdded = false;
  } else {
    updated = [{ ...item, addedAt: Date.now() }, ...current];
    isAdded = true;
  }

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("favorites-updated"));
  } catch (err) {
    console.error("Failed to save favorites", err);
  }

  return isAdded;
};
