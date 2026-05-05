import { codeWarsUserAPI } from "../constants.js";

export const getUser = async (user) => {
  const res = await fetch(codeWarsUserAPI + user);
  return res.status;
};

export const getCompletedCodeKatas = async (user) => {
  const url = `https://www.codewars.com/api/v1/users/${user}/code-challenges/completed`;
  const res = await fetch(url);
  console.log("getCompletedCodeKatas res" + res.ok);
  if (!res.ok) return [];
  const text = await res.text();
  console.log("getCompletedCodeKatas res text" + text);

  try {
    const json = JSON.parse(text);
    return json.data ?? [];
  } catch {
    console.error(`Non-JSON response for user ${user}:`, text.slice(0, 200));
    return [];
  }
};
