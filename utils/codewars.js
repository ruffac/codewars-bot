import { codeWarsUserAPI } from "../constants.js";

export const getUser = async (user) => {
  const res = await fetch(codeWarsUserAPI + user);
  return res.status;
};

export const getCompletedCodeKatas = async (user) => {
  const url = `https://www.codewars.com/api/v1/users/${user}/code-challenges/completed`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const json = await res.json();
  return json.data;
};
